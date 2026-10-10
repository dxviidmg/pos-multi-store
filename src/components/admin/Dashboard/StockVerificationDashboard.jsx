import React, { useEffect, useCallback, useMemo } from "react";
import useTaskPolling from "../../../hooks/useTaskPolling";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import EmptyState from "../../ui/EmptyState/EmptyState";
import DoughnutChart from "./DoughnutChart";
import DashboardLoading from "./DashboardLoading";
import StatCard from "./StatCard";
import { Grid, Box, Typography } from "@mui/material";
import { exportToExcel } from "../../../utils/excel";
import { formatNumber } from "../../../utils/currency";
import { getStockVerificationDashboard } from "../../../api/dashboards";
import WarningIcon from "@mui/icons-material/Warning";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import DownloadIcon from "@mui/icons-material/Download";

const TITLE = "Verificación de stock";

const DESCRIPTION = "En SmartVenta sabemos que la precisión en tu operación diaria marca la diferencia. Aunque las inconsistencias o duplicidades en el stock no son frecuentes, cuando llegan a presentarse estamos atentos para detectarlas y ayudarte a resolverlas de forma rápida y confiable. Porque para nosotros, cuidar tus datos no es solo una función del sistema, es un compromiso con tu tranquilidad y la continuidad de tu negocio.";

const COLUMNS = [
  { name: "Código", selector: (row) => row.Código },
  { name: "Producto", selector: (row) => row.Producto },
  { name: "Marca", selector: (row) => row.Marca },
  { name: "Stock", selector: (row) => row.Stock, width: 80 },
  { name: "Tienda", selector: (row) => row.Tienda },
];

const StockVerificationDashboard = () => {
  const startTask = useCallback(async () => {
    const response = await getStockVerificationDashboard();
    return response.data.task;
  }, []);

  const { data, loading, progress, countdown, fetchData } = useTaskPolling(startTask);

  useEffect(() => { fetchData(); }, [fetchData]);

  const products = useMemo(() => data?.store_products?.map(p => ({
    Código: p.code,
    Producto: p.product_name,
    Marca: p.brand,
    Stock: p.stock,
    Tienda: p.store_name,
  })), [data]);

  const kpis = useMemo(() => {
    if (!data?.store_products?.length) return null;
    const total = data.store_products.length;
    const totalStores = data.stores?.length || 0;
    const totalStoreProducts = data.total_store_products || 0;
    return {
      total,
      totalStoreProducts,
      avgPerStore: totalStores > 0 ? Math.round(total / totalStores) : 0,
      coverage: totalStoreProducts > 0 ? ((total / totalStoreProducts) * 100).toFixed(1) : 0,
    };
  }, [data]);

  const chartData = useMemo(() => {
    if (!data?.store_products) return null;
    return { sales: data.store_products.map(p => ({ store_name: p.store_name })) };
  }, [data]);

  const handleDownload = useCallback(() => {
    exportToExcel(products, "Inventario a verificar");
  }, [products]);

  if (loading) {
    return <DashboardLoading title={TITLE} progress={progress} countdown={countdown} />;
  }

  if (!kpis) {
    return (
      <Box>
        <Box className="card" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{TITLE}</Typography>
          <Typography variant="body2" color="text.secondary">{DESCRIPTION}</Typography>
        </Box>
        <EmptyState message="Todo el stock está correcto" />
      </Box>
    );
  }

  return (
    <Box>
      <Box className="card" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{TITLE}</Typography>
        <Typography variant="body2" color="text.secondary">{DESCRIPTION}</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <StatCard icon={WarningIcon} iconColor="warning.main" label="Productos a verificar" value={kpis.total} />
        <StatCard icon={InventoryIcon} iconColor="info.main" label="Total de productos" value={formatNumber(kpis.totalStoreProducts)} />
        <StatCard icon={StorefrontIcon} iconColor="primary.main" label="Cobertura" value={`${kpis.coverage}%`} />
        <StatCard icon={InventoryIcon} iconColor="success.main" label="Promedio por tienda" value={kpis.avgPerStore} />
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Box className="card" sx={{ height: "100%" }}>
            {chartData && <DoughnutChart title="Productos a verificar por tienda" data={chartData} dataType="store" />}
          </Box>
        </Grid>
      </Grid>

      <Box className="card" sx={{ mb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Productos a verificar</Typography>
          <CustomButton onClick={handleDownload} disabled={!products?.length} startIcon={<DownloadIcon />}>
            Descargar
          </CustomButton>
        </Box>
        <DataTable
          progressPending={loading}
          noDataComponent="Sin productos a verificar"
          searcher
          data={products || []}
          columns={COLUMNS}
        />
      </Box>
    </Box>
  );
};

export default StockVerificationDashboard;
