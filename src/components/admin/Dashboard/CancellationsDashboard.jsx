import React, { useEffect, useState } from "react";
import { getTaskResult } from "../../../api/products";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import KPICard from "./KPICard";
import {
  Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography,
  LinearProgress, Skeleton,
} from "@mui/material";
import { showError } from "../../../utils/alerts";
import {
  MONTH_NAMES, MONTH_NAMES_SHORT, DAY_NAMES, CHART_COLORS,
  formatCurrency, getErrorMessage, getTied,
} from "../../../utils/utils";
import httpClient from "../../../api/httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "../../../api/utils";
import BlockIcon from "@mui/icons-material/Block";
import UndoIcon from "@mui/icons-material/Undo";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import InboxIcon from "@mui/icons-material/Inbox";

const CancellationsDashboard = () => {
  const [data, setData] = useState(null);
  const [metricType, setMetricType] = useState("count");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setProgress(0);
    try {
      const url = buildUrlWithParams(getApiUrl("sales-dashboard-cancellations"), { year, month });
      const response = await httpClient.get(url, { headers: getHeaders() });
      const taskId = response.data.task;
      const pollTask = async () => {
        try {
          const { data: taskData } = await getTaskResult(taskId);
          if (taskData.meta?.current && taskData.meta?.total) setProgress((taskData.meta.current / taskData.meta.total) * 100);
          if (taskData.status === "SUCCESS") {
            setData(taskData.result);
            setLoading(false);
            setProgress(100);
            clearInterval(intervalId);
          } else if (taskData.status === "FAILURE") {
            showError("Error", taskData.error?.message || "Error desconocido");
            setLoading(false);
            clearInterval(intervalId);
          }
        } catch (error) {
          showError("Error", getErrorMessage(error));
          setLoading(false);
          clearInterval(intervalId);
        }
      };
      let intervalId;
      pollTask();
      intervalId = setInterval(pollTask, 10000);
    } catch (error) {
      showError("Error al cargar el tablero", getErrorMessage(error));
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [year, month]);

  const calculateKPIs = () => {
    if (!data?.sales?.length) return null;
    const sales = data.sales;
    const canceled = sales.filter(s => s.is_canceled);
    const returned = sales.filter(s => s.has_return);
    const totalLost = sales.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalValidSales = data.total_sales || 0;
    const percentage = totalValidSales > 0 ? ((sales.length / (totalValidSales + sales.length)) * 100).toFixed(1) : 0;

    const byStore = {};
    if (data.stores) data.stores.forEach(s => { byStore[s.name] = 0; });
    sales.forEach(s => { byStore[s.store_name] = (byStore[s.store_name] || 0) + 1; });
    const storeEntries = Object.entries(byStore).filter(([, v]) => v > 0);
    const worstStore = storeEntries.length ? getTied(storeEntries, k => k, "best") : "N/A";

    const byWeekday = {};
    sales.forEach(s => { const d = new Date(s.created_at).getDay(); byWeekday[d] = (byWeekday[d] || 0) + 1; });
    const worstWeekday = getTied(Object.entries(byWeekday), k => DAY_NAMES[k], "best");

    const byHour = {};
    sales.forEach(s => { const h = new Date(s.created_at).getHours(); byHour[h] = (byHour[h] || 0) + 1; });
    const worstHour = getTied(Object.entries(byHour), k => `${k}:00`, "best");

    return { totalCanceled: canceled.length, totalReturned: returned.length, totalLost, total: sales.length, totalValidSales, percentage, worstStore, worstWeekday, worstHour };
  };

  const kpis = calculateKPIs();
  const periodLabel = month === 0 ? "Todo el año" : `${MONTH_NAMES[month - 1]} ${year}`;
  const hasMultipleStores = data?.stores?.length > 1;

  const typeChartData = data ? {
    sales: data.sales.map(s => ({ ...s, store_name: s.is_canceled ? "Cancelada" : "Devolución" })),
    stores: [{ name: "Cancelada" }, { name: "Devolución" }],
  } : null;

  if (loading) {
    return (
      <Box>
        <Box className="card" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Ventas modificadas y/o canceladas</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Procesando datos...</Typography>
          <LinearProgress variant={progress > 0 ? "determinate" : "indeterminate"} value={progress} sx={{ height: 6, borderRadius: 3, mb: 1 }} />
        </Box>
        <Grid container spacing={2}>
          {[0,1,2,3].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: "14px" }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!kpis) {
    return (
      <Box>
        <Box className="card">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Ventas modificadas y/o canceladas</Typography>
          <Filters {...{ metricType, setMetricType, year, setYear, month, setMonth }} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 350, gap: 2, opacity: 0.7 }}>
          <InboxIcon sx={{ fontSize: 64, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary">No hay cancelaciones ni devoluciones en este periodo</Typography>
        </Box>
      </Box>
    );
  }

  const daysLabels = month !== 0
    ? Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => (i + 1).toString())
    : [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box className="card" sx={{ mb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Ventas modificadas y/o canceladas</Typography>
            <Typography variant="body2" color="text.secondary">{periodLabel}</Typography>
          </Box>
        </Box>
        <Filters {...{ metricType, setMetricType, year, setYear, month, setMonth }} />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <Box className="card" sx={{ height: "100%", mb: 0 }}>
            <KPICard title="Canceladas/Devueltas" value={kpis.total} subtitle={`${kpis.percentage}% de ${kpis.totalValidSales + kpis.total} ventas`} icon={BlockIcon} index={0} />
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box className="card" sx={{ height: "100%", mb: 0 }}>
            <KPICard title="Canceladas" value={kpis.totalCanceled} subtitle="Ventas canceladas" icon={BlockIcon} index={1} />
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box className="card" sx={{ height: "100%", mb: 0 }}>
            <KPICard title="Devoluciones" value={kpis.totalReturned} subtitle="Ventas con devolución" icon={UndoIcon} index={2} />
          </Box>
        </Grid>

        {hasMultipleStores && (
          <Grid item xs={6} md={4}>
            <Box className="card" sx={{ height: "100%", mb: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <StorefrontIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>Más cancelaciones</Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{kpis.worstStore}</Typography>
            </Box>
          </Grid>
        )}
        <Grid item xs={6} md={4}>
          <Box className="card" sx={{ height: "100%", mb: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CalendarMonthIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>Día con más</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{kpis.worstWeekday}</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box className="card" sx={{ height: "100%", mb: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AccessTimeIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>Hora con más</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{kpis.worstHour}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box className="card">
        <LineChart
          title={month === 0 ? "Cancelaciones/devoluciones por mes" : "Cancelaciones/devoluciones por día"}
          data={data}
          metricType={metricType}
          labels={month === 0 ? MONTH_NAMES_SHORT : daysLabels}
          yText="Cantidad"
          xText={month === 0 ? "Meses" : "Días"}
          dataType={month === 0 ? "monthly" : "day_of_month"}
        />
      </Box>

      {hasMultipleStores && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box className="card" sx={{ height: "100%" }}>
              <DoughnutChart title="Por tienda" data={data} metricType={metricType} dataType="store" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="card" sx={{ height: "100%" }}>
              <DoughnutChart title="Por tipo" data={typeChartData} metricType="count" dataType="store" />
            </Box>
          </Grid>
        </Grid>
      )}

      {!hasMultipleStores && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box className="card" sx={{ height: "100%" }}>
              <DoughnutChart title="Por tipo" data={typeChartData} metricType="count" dataType="store" />
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Listado de motivos */}
      <Box className="card">
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Motivos</Typography>
        {data.sales.filter(s => s.reason_cancel || s.reason_return).map((s) => (
          <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
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

const Filters = ({ metricType, setMetricType, year, setYear, month, setMonth }) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} sm={4}>
      <FormControl size="small" fullWidth>
        <InputLabel>Métrica</InputLabel>
        <Select value={metricType} label="Métrica" onChange={(e) => setMetricType(e.target.value)}>
          <MenuItem value="count">Cantidad</MenuItem>
          <MenuItem value="total">Monto</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={4}>
      <FormControl size="small" fullWidth>
        <InputLabel>Año</InputLabel>
        <Select value={year} label="Año" onChange={(e) => setYear(e.target.value)}>
          {Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => 2025 + i).map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    <Grid item xs={12} sm={4}>
      <FormControl size="small" fullWidth>
        <InputLabel>Mes</InputLabel>
        <Select value={month} label="Mes" onChange={(e) => setMonth(e.target.value)}>
          <MenuItem value={0}>Todo el año</MenuItem>
          {MONTH_NAMES.map((m, i) => (
            <MenuItem key={i + 1} value={i + 1}>{m}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  </Grid>
);

export default CancellationsDashboard;
