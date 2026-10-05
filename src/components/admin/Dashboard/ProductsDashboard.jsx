import React, { useEffect, useState, useCallback } from "react";
import useTaskPolling from "../../../hooks/useTaskPolling";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import StoreSelect from "../../ui/StoreSelect/StoreSelect";
import EmptyState from "../../ui/EmptyState/EmptyState";
import Filters from "./Filters";
import DashboardLoading from "./DashboardLoading";
import { Grid, Box, Typography } from "@mui/material";
import { MONTH_NAMES } from "../../../utils/date";
import { getProductsDashboard } from "../../../api/dashboards";

const TITLE = "Marcas y productos";

const LOADING_ITEM_PROPS = { xs: 12, md: 4 };

const TOP_BRANDS_COLUMNS = [
  { name: "Marca", selector: (row) => row.name },
  { name: "Productos", selector: (row) => row.product_count },
  { name: "% de ventas", selector: (row) => `${row.percentage}%` },
];

const TOP_PRODUCTS_COLUMNS = [
  { name: "Código", selector: (row) => row.code },
  { name: "Nombre", selector: (row) => row.name },
  { name: "Marca", selector: (row) => row.brand_name },
  { name: "% de ventas", selector: (row) => `${row.percentage}%` },
];

const ProductsDashboard = () => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [storeId, setStoreId] = useState("");

  const startTask = useCallback(async () => {
    const response = await getProductsDashboard({ year, month, ...(storeId && { store_id: storeId }) });
    return response.data.task;
  }, [year, month, storeId]);

  const { data, loading, progress, countdown, fetchData } = useTaskPolling(startTask);

  useEffect(() => { fetchData(); }, [year, month, storeId, fetchData]);

  const periodLabel = month === 0 ? "Todo el año" : `${MONTH_NAMES[month - 1]} ${year}`;

  const filters = (
    <Filters
      leading={
        <StoreSelect
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          label="Tienda"
          allLabel="Todas"
        />
      }
      year={year}
      onYearChange={setYear}
      month={month}
      onMonthChange={setMonth}
    />
  );

  if (loading) {
    return (
      <DashboardLoading
        title={TITLE}
        progress={progress}
        countdown={countdown}
        kpiCount={3}
        kpiItemProps={LOADING_ITEM_PROPS}
      />
    );
  }

  if (!data) {
    return (
      <Box>
        <Box className="card">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>{TITLE}</Typography>
          {filters}
        </Box>
        <EmptyState message="No hay datos en este periodo" />
      </Box>
    );
  }

  const { top_products, top_brands, worst_products } = data;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box className="card" sx={{ mb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{TITLE}</Typography>
            <Typography variant="body2" color="text.secondary">{periodLabel}</Typography>
          </Box>
        </Box>
        {filters}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Marcas más vendidas</Typography>
            <SimpleTable
              noDataComponent="Sin marcas"
              data={top_brands}
              columns={TOP_BRANDS_COLUMNS}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Productos más vendidos</Typography>
            <SimpleTable
              noDataComponent="Sin productos"
              data={top_products}
              columns={TOP_PRODUCTS_COLUMNS}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className="card">
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Productos menos vendidos</Typography>
            <SimpleTable
              noDataComponent="Sin productos"
              data={worst_products}
              columns={TOP_PRODUCTS_COLUMNS}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductsDashboard;
