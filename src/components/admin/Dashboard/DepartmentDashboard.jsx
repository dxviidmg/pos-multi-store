import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { PieChart } from "@mui/x-charts/PieChart";
import useTaskPolling from "../../../hooks/useTaskPolling";
import { useDepartments } from "../../../hooks/useDepartments";
import EmptyState from "../../ui/EmptyState/EmptyState";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import Filters from "./Filters";
import KPICard from "./KPICard";
import DashboardLoading from "./DashboardLoading";
import { MONTH_NAMES } from "../../../utils/date";
import { CHART_COLORS } from "../../../utils/chart";
import { formatCurrency } from "../../../utils/currency";
import { getDepartmentDashboard } from "../../../api/dashboards";

const TITLE = "Por departamento";
const NO_DEPARTMENT = "0";

const KPI_ITEM_PROPS = { xs: 12, md: 4 };

const KPIS = [
  { key: "investment", title: "Inversión total", icon: Inventory2OutlinedIcon },
  { key: "sales", title: "Ventas totales", icon: PointOfSaleIcon },
  { key: "units", title: "Unidades en existencia", icon: LayersOutlinedIcon },
];

const TOP_PRODUCTS_COLUMNS = [
  { name: "#", selector: (row) => row.rank, width: "60px" },
  { name: "Código", selector: (row) => row.code },
  { name: "Producto", selector: (row) => row.name },
  { name: "Unidades vendidas", selector: (row) => row.quantity.toLocaleString("es-MX") },
  { name: "Ventas", selector: (row) => formatCurrency(row.sales) },
];

const CHARTS = [
  { key: "investment", title: "Inversión por tienda" },
  { key: "sales", title: "Ventas por tienda" },
];

const PIE_LEGEND = {
  direction: "column",
  position: { vertical: "middle", horizontal: "right" },
  padding: 0,
  itemMarkWidth: 12,
  itemMarkHeight: 12,
  markGap: 8,
  itemGap: 10,
  labelStyle: { fontSize: 13, fill: "var(--color-text-secondary)" },
};

const PIE_MARGIN = { top: 10, bottom: 10, left: 10, right: 10 };

const StoreChart = ({ title, stores, field }) => {
  const total = stores.reduce((sum, s) => sum + s[field], 0);
  const data = stores
    .filter((s) => s[field] > 0)
    .map((s, index) => ({
      id: index,
      value: s[field],
      label: `${s.name} (${((s[field] / total) * 100).toFixed(1)}%)`,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

  return (
    <Box className="card" sx={{ height: "100%" }}>
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>{title}</Typography>
      {data.length === 0 ? (
        <EmptyState message="Sin datos en el periodo" />
      ) : (
        <PieChart
          series={[{
            data,
            outerRadius: 105,
            paddingAngle: 1,
            cornerRadius: 4,
            valueFormatter: ({ value }) => formatCurrency(value),
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { additionalRadius: -5, color: "gray" },
          }]}
          height={300}
          margin={PIE_MARGIN}
          slotProps={{ legend: PIE_LEGEND }}
        />
      )}
    </Box>
  );
};

const DepartmentDashboard = () => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [departmentId, setDepartmentId] = useState("");
  const { data: departments = [] } = useDepartments();

  const startTask = useCallback(async () => {
    const response = await getDepartmentDashboard({ department_id: departmentId, year, month });
    return response.data.task;
  }, [departmentId, year, month]);

  const { data, loading, progress, countdown, fetchData } = useTaskPolling(startTask);

  useEffect(() => {
    if (departmentId !== "") fetchData();
  }, [departmentId, year, month, fetchData]);

  const periodLabel = month === 0 ? "Todo el año" : `${MONTH_NAMES[month - 1]} ${year}`;

  const filters = useMemo(() => (
    <Filters
      leading={
        <FormControl size="small" fullWidth>
          <InputLabel>Departamento</InputLabel>
          <Select value={departmentId} label="Departamento" onChange={(e) => setDepartmentId(e.target.value)}>
            <MenuItem value={NO_DEPARTMENT}>Sin departamento</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d.id} value={String(d.id)}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      year={year}
      onYearChange={setYear}
      month={month}
      onMonthChange={setMonth}
    />
  ), [departments, departmentId, year, month]);

  const stores = departmentId !== "" ? data?.stores : null;
  const totals = useMemo(
    () => (stores || []).reduce(
      (acc, s) => ({ investment: acc.investment + s.investment, sales: acc.sales + s.sales, units: acc.units + (s.units || 0) }),
      { investment: 0, sales: 0, units: 0 }
    ),
    [stores]
  );

  if (loading && departmentId !== "") {
    return <DashboardLoading title={TITLE} progress={progress} countdown={countdown} kpiCount={3} kpiItemProps={KPI_ITEM_PROPS} chartCount={2} />;
  }


  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box className="card" sx={{ mb: 0 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{TITLE}</Typography>
          <Typography variant="body2" color="text.secondary">{periodLabel}</Typography>
        </Box>
        {filters}
      </Box>

      {!stores ? (
        <EmptyState message="Selecciona un departamento" />
      ) : (
        <>
          <Grid container spacing={2}>
            {KPIS.map(({ key, title, icon }, i) => (
              <KPICard
                key={key}
                title={title}
                value={key === "units" ? totals.units.toLocaleString("es-MX") : formatCurrency(totals[key])}
                icon={icon}
                index={i}
                itemProps={KPI_ITEM_PROPS}
              />
            ))}
          </Grid>
          <Grid container spacing={3}>
            {CHARTS.map(({ key, title }) => (
              <Grid item xs={12} md={6} key={key}>
                <StoreChart title={title} stores={stores} field={key} />
              </Grid>
            ))}
          </Grid>
          <Box className="card">
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>Top 10 productos más vendidos</Typography>
            <SimpleTable
              noDataComponent="Sin ventas en el periodo"
              data={(data?.top_products || []).map((p, i) => ({ ...p, rank: i + 1 }))}
              columns={TOP_PRODUCTS_COLUMNS}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default DepartmentDashboard;
