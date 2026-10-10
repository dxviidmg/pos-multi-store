import React, { useEffect, useState, useCallback, useMemo } from "react";
import useTaskPolling from "../../../hooks/useTaskPolling";
import LineChart from "./LineChart";
import MainBarChart from "./MainBarChart";
import DoughnutChart from "./DoughnutChart";
import KPICard from "./KPICard";
import Filters from "./Filters";
import DashboardLoading from "./DashboardLoading";
import EmptyState from "../../ui/EmptyState/EmptyState";
import { Grid, FormControl, Select, MenuItem, Box, Typography } from "@mui/material";
import { MONTH_NAMES, MONTH_NAMES_SHORT, DAY_NAMES } from "../../../utils/date";
import { getTied } from "../../../utils/chart";
import { getCancellationsDashboard } from "../../../api/dashboards";
import BlockIcon from "@mui/icons-material/Block";
import UndoIcon from "@mui/icons-material/Undo";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const TITLE = "Ventas canceladas";

const METRIC_OPTIONS = [
  { value: "count", label: "Cantidad" },
  { value: "total", label: "Monto" },
];

const KPI_ITEM_PROPS = { xs: 6, md: 4 };

const HighlightCard = ({ icon: Icon, title, value }) => (
  <Grid item {...KPI_ITEM_PROPS}>
    <Box className="card card-interactive" sx={{ height: "100%", mb: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Icon sx={{ fontSize: 18, color: "primary.main" }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>{title}</Typography>
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
  </Grid>
);

const CancellationsDashboard = () => {
  const [metricType, setMetricType] = useState("count");
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [chartType, setChartType] = useState("line");

  const startTask = useCallback(async () => {
    const response = await getCancellationsDashboard({ year, month });
    return response.data.task;
  }, [year, month]);

  const { data, loading, progress, countdown, fetchData } = useTaskPolling(startTask);

  useEffect(() => { fetchData(); }, [year, month, fetchData]);

  const kpis = useMemo(() => {
    if (!data?.sales?.length) return null;
    const sales = data.sales;
    const canceled = sales.filter(s => s.is_canceled);
    const returned = sales.filter(s => s.has_return);
    const totalValidSales = data.total_sales || 0;
    const percentage = totalValidSales > 0 ? ((sales.length / (totalValidSales + sales.length)) * 100).toFixed(1) : 0;
    const val = (s) => metricType === "total" ? (s.total || 0) : 1;

    const byStore = {};
    if (data.stores) data.stores.forEach(s => { byStore[s.name] = 0; });
    sales.forEach(s => { byStore[s.store_name] = (byStore[s.store_name] || 0) + val(s); });
    const storeEntries = Object.entries(byStore).filter(([, v]) => v > 0);
    const worstStore = storeEntries.length ? getTied(storeEntries, k => k, "best") : "N/A";

    const byWeekday = {};
    sales.forEach(s => { const d = new Date(s.created_at).getDay(); byWeekday[d] = (byWeekday[d] || 0) + val(s); });
    const worstWeekday = getTied(Object.entries(byWeekday), k => DAY_NAMES[k], "best");

    const byHour = {};
    sales.forEach(s => { const h = new Date(s.created_at).getHours(); byHour[h] = (byHour[h] || 0) + val(s); });
    const worstHour = getTied(Object.entries(byHour), k => `${k}:00`, "best");

    return { totalCanceled: canceled.length, totalReturned: returned.length, total: sales.length, totalValidSales, percentage, worstStore, worstWeekday, worstHour };
  }, [data, metricType]);

  const periodLabel = month === 0 ? "Todo el año" : `${MONTH_NAMES[month - 1]} ${year}`;
  const hasMultipleStores = data?.stores?.length > 1;

  const typeChartData = useMemo(() => {
    if (!data?.sales) return null;
    return {
      sales: data.sales.map(s => ({ ...s, store_name: s.is_canceled ? "Cancelada" : "Devolución" })),
      stores: [{ name: "Cancelada" }, { name: "Devolución" }],
    };
  }, [data]);

  const filters = (
    <Filters
      metricOptions={METRIC_OPTIONS}
      metricType={metricType}
      onMetricChange={setMetricType}
      year={year}
      onYearChange={setYear}
      month={month}
      onMonthChange={setMonth}
    />
  );

  if (loading) {
    return <DashboardLoading title={TITLE} progress={progress} countdown={countdown} />;
  }

  if (!kpis) {
    return (
      <Box>
        <Box className="card">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>{TITLE}</Typography>
          {filters}
        </Box>
        <EmptyState message="No hay cancelaciones ni devoluciones en este periodo" />
      </Box>
    );
  }

  const isYear = month === 0;
  const daysLabels = isYear
    ? []
    : Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => (i + 1).toString());
  const chartLabels = isYear ? MONTH_NAMES_SHORT : daysLabels;
  const chartDataType = isYear ? "monthly" : "day_of_month";

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

      <Grid container spacing={2}>
        <KPICard title="Canceladas/Devueltas" value={kpis.total} subtitle={`${kpis.percentage}% de ${kpis.totalValidSales + kpis.total} ventas`} icon={BlockIcon} index={0} itemProps={KPI_ITEM_PROPS} />
        <KPICard title="Canceladas" value={kpis.totalCanceled} subtitle="Ventas canceladas" icon={BlockIcon} index={1} itemProps={KPI_ITEM_PROPS} />
        <KPICard title="Devoluciones" value={kpis.totalReturned} subtitle="Ventas con devolución" icon={UndoIcon} index={2} itemProps={KPI_ITEM_PROPS} />
        {hasMultipleStores && <HighlightCard icon={StorefrontIcon} title="Más cancelaciones" value={kpis.worstStore} />}
        <HighlightCard icon={CalendarMonthIcon} title="Día con más" value={kpis.worstWeekday} />
        <HighlightCard icon={AccessTimeIcon} title="Hora con más" value={kpis.worstHour} />
      </Grid>

      <Box className="card">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {isYear ? "Cancelaciones/devoluciones por mes" : "Cancelaciones/devoluciones por día"}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <MenuItem value="line">Líneas</MenuItem>
              <MenuItem value="bar">Barras</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {chartType === "line" ? (
          <LineChart
            title=""
            data={data}
            metricType={metricType}
            labels={chartLabels}
            xText={isYear ? "Meses" : "Días"}
            dataType={chartDataType}
          />
        ) : (
          <MainBarChart
            data={data}
            metricType={metricType}
            labels={chartLabels}
            dataType={chartDataType}
            daysInMonth={isYear ? 12 : daysLabels.length}
          />
        )}
      </Box>

      <Grid container spacing={3}>
        {hasMultipleStores && (
          <Grid item xs={12} md={6}>
            <Box className="card" sx={{ height: "100%" }}>
              <DoughnutChart title="Por tienda" data={data} metricType={metricType} dataType="store" />
            </Box>
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <DoughnutChart title="Por tipo" data={typeChartData} metricType="count" dataType="store" />
          </Box>
        </Grid>
      </Grid>

      <Box className="card">
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Motivos</Typography>
        {data.sales.filter(s => s.reason_cancel || s.reason_return).map((s) => (
          <Box key={s.id} sx={{ display: "flex", justifyContent: "space-between", py: 0.75, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="body2">
              <strong>#{s.id}</strong> — {s.is_canceled ? "Cancelación" : "Devolución"}: {s.reason_cancel || s.reason_return}
            </Typography>
            <Typography variant="caption" color="text.secondary">{s.store_name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CancellationsDashboard;
