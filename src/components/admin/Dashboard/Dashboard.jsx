import React, { useEffect, useState } from "react";
import { getSalesDashboard } from "../../../api/sales";
import { getTaskResult } from "../../../api/products";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import SalesHeatmap from "./SalesHeatmap";
import AvgTicketChart from "./AvgTicketChart";
import KPICard from "./KPICard";
import { BarChart } from "@mui/x-charts/BarChart";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import {
  Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography,
  LinearProgress, Skeleton,
} from "@mui/material";
import { showError } from "../../../utils/alerts";
import {
  MONTH_NAMES, MONTH_NAMES_SHORT, DAY_NAMES, CHART_COLORS,
  formatCurrency, getErrorMessage, getTied,
} from "../../../utils/utils";
import { getUserData } from "../../../api/utils";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InboxIcon from "@mui/icons-material/Inbox";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LockIcon from "@mui/icons-material/Lock";

const Dashboard = () => {
  const user = getUserData();
  const currentHour = new Date().getHours();
  const isRestricted = user.store_count > 1 && currentHour >= 10 && currentHour < 21;

  const [dashboardData, setDashboardData] = useState(null);
  const [metricType, setMetricType] = useState("count");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mainChartType, setMainChartType] = useState("line");

  const fetchData = async () => {
    setLoading(true);
    setProgress(0);
    try {
      const response = await getSalesDashboard({ year, month });
      const taskId = response.data.task;
      const pollTask = async () => {
        try {
          const { data: taskData } = await getTaskResult(taskId);
          const { result, status, meta } = taskData;
          if (meta?.current && meta?.total) setProgress((meta.current / meta.total) * 100);
          if (status === "SUCCESS") {
            setDashboardData(result);
            setLoading(false);
            setProgress(100);
            clearInterval(intervalId);
          } else if (status === "FAILURE") {
            showError("Error al cargar los datos del dashboard", taskData.error.message || "Error desconocido");
            setLoading(false);
            clearInterval(intervalId);
          }
        } catch (error) {
          showError("Error al obtener los datos del dashboard", getErrorMessage(error));
          setLoading(false);
          clearInterval(intervalId);
        }
      };
      let intervalId;
      pollTask();
      intervalId = setInterval(pollTask, 10000);
    } catch (error) {
      if (error.response?.data?.message?.includes('max requests limit exceeded')) {
        showError("Límite de Redis Excedido", "Se ha alcanzado el límite de solicitudes de Redis. Por favor, contacta al administrador del sistema");
      } else {
        showError("Error al cargar el dashboard", getErrorMessage(error));
      }
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [year, month]);

  if (isRestricted) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 2 }}>
        <LockIcon sx={{ fontSize: 64, color: "text.secondary" }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Dashboard no disponible</Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          El dashboard está disponible únicamente antes de las 10:00 AM y después de las 9:00 PM.
        </Typography>
      </Box>
    );
  }

  const calculateKPIs = () => {
    if (!dashboardData?.sales?.length) return null;
    const salesData = dashboardData.sales;
    const totalSales = salesData.length;
    const totalAmount = salesData.reduce((sum, s) => sum + (s.total || 0), 0);
    const now = new Date();
    const totalDaysInPeriod = month === 0 ? 365 : new Date(year, month, 0).getDate();
    const isCurrentPeriod = month === 0 ? year === now.getFullYear() : (year === now.getFullYear() && month === now.getMonth() + 1);
    const daysInPeriod = isCurrentPeriod ? (month === 0 ? Math.floor((now - new Date(year, 0, 1)) / 86400000) + 1 : now.getDate()) : totalDaysInPeriod;
    const avgDaily = totalAmount / daysInPeriod;

    // Por tienda
    const salesByStore = {};
    if (dashboardData.stores) dashboardData.stores.forEach(s => { salesByStore[s.name] = 0; });
    salesData.forEach(s => { const store = s.store_name || "Sin tienda"; salesByStore[store] = (salesByStore[store] || 0) + (s.total || 0); });
    const storeEntries = Object.entries(salesByStore);
    const bestStore = getTied(storeEntries, k => k, "best");
    const worstStore = getTied(storeEntries, k => k, "worst");

    // Mejor/peor periodo
    let bestPeriod = "N/A", worstPeriod = "N/A";
    if (month === 0) {
      const byMonth = {};
      salesData.forEach(s => { const m = new Date(s.created_at).getMonth(); byMonth[m] = (byMonth[m] || 0) + 1; });
      const entries = Object.entries(byMonth);
      bestPeriod = getTied(entries, k => MONTH_NAMES[k] || "N/A", "best");
      worstPeriod = getTied(entries, k => MONTH_NAMES[k] || "N/A", "worst");
    } else {
      const byDate = {};
      salesData.forEach(s => { const d = new Date(s.created_at).getDate(); byDate[d] = (byDate[d] || 0) + 1; });
      const entries = Object.entries(byDate);
      bestPeriod = getTied(entries, k => `Día ${k}`, "best");
      worstPeriod = getTied(entries, k => `Día ${k}`, "worst");
    }

    // Por día de semana
    const byWeekday = {};
    salesData.forEach(s => { const d = new Date(s.created_at).getDay(); byWeekday[d] = (byWeekday[d] || 0) + 1; });
    const wdEntries = Object.entries(byWeekday);
    const bestWeekday = getTied(wdEntries, k => DAY_NAMES[k], "best");
    const worstWeekday = getTied(wdEntries, k => DAY_NAMES[k], "worst");

    // Por hora
    const byHour = {};
    salesData.forEach(s => { const h = new Date(s.created_at).getHours(); byHour[h] = (byHour[h] || 0) + 1; });
    const hourEntries = Object.entries(byHour);
    const bestHour = getTied(hourEntries, k => `${k}:00`, "best");
    const worstHour = getTied(hourEntries, k => `${k}:00`, "worst");

    const storeCount = dashboardData.stores?.length || 1;
    const avgPerStore = totalAmount / storeCount;

    return { totalSales, totalAmount, avgDaily, avgPerStore, daysInPeriod, bestStore, worstStore, bestPeriod, worstPeriod, bestWeekday, worstWeekday, bestHour, worstHour };
  };

  const kpis = calculateKPIs();
  const hasMultipleStores = dashboardData?.stores?.length > 1;
  const periodLabel = month === 0 ? MONTH_NAMES[month] : `${MONTH_NAMES[month - 1]} ${year}`;

  // --- LOADING STATE ---
  if (loading) {
    return (
      <Box>
        <Box className="card" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Dashboard de Ventas</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Procesando datos...</Typography>
          <LinearProgress
            variant={progress > 0 ? "determinate" : "indeterminate"}
            value={progress}
            sx={{ height: 6, borderRadius: 3, mb: 1 }}
          />
          {progress > 0 && (
            <Typography variant="caption" color="text.secondary">{Math.round(progress)}% completado</Typography>
          )}
        </Box>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[0,1,2,3].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: "14px" }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          {[0,1].map(i => (
            <Grid item xs={12} md={6} key={i}>
              <Skeleton variant="rounded" height={350} sx={{ borderRadius: "14px" }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // --- EMPTY STATE ---
  if (!kpis) {
    return (
      <Box>
        <Box className="card">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Dashboard de Ventas</Typography>
          <Filters {...{ metricType, setMetricType, year, setYear, month, setMonth }} />
        </Box>
        <Box sx={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: 350, gap: 2, opacity: 0.7,
        }}>
          <InboxIcon sx={{ fontSize: 64, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary">No hay ventas registradas en este periodo</Typography>
          <Typography variant="body2" color="text.secondary">Selecciona otro mes o año para ver datos</Typography>
        </Box>
      </Box>
    );
  }

  // --- INSIGHTS: pares mejor/peor agrupados ---
  const insightPairs = [
    ...(hasMultipleStores ? [{
      icon: StorefrontIcon, title: "Tiendas",
      best: kpis.bestStore, worst: kpis.worstStore,
    }] : []),
    {
      icon: CalendarMonthIcon, title: month === 0 ? "Meses" : "Días del mes",
      best: kpis.bestPeriod, worst: kpis.worstPeriod,
    },
    {
      icon: CalendarMonthIcon, title: "Día de semana",
      best: kpis.bestWeekday, worst: kpis.worstWeekday,
    },
    {
      icon: AccessTimeIcon, title: "Hora",
      best: kpis.bestHour, worst: kpis.worstHour,
    },
  ];

  const daysLabels = month !== 0
    ? Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => (i + 1).toString())
    : [];

  const now = new Date();
  const todayLabel = month !== 0 && year === now.getFullYear() && month === now.getMonth() + 1
    ? now.getDate().toString() : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header + Filtros */}
      <Box className="card" sx={{ mb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Dashboard de Ventas</Typography>
            <Typography variant="body2" color="text.secondary">{periodLabel}</Typography>
          </Box>
        </Box>
        <Filters {...{ metricType, setMetricType, year, setYear, month, setMonth }} />
      </Box>

      {/* KPI Cards + Insights en un solo bloque */}
      <Grid container spacing={2}>
        {/* KPIs */}
        <Grid item xs={6} md={3}>
          <Box className="card" sx={{ height: "100%", mb: 0 }}>
            <KPICard title="Total Ventas" value={kpis.totalSales.toLocaleString()} subtitle={periodLabel} icon={ShoppingCartIcon} index={0} />
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box className="card" sx={{ height: "100%", mb: 0 }}>
            <KPICard title="Monto Total" value={formatCurrency(kpis.totalAmount)} subtitle="Ingresos del periodo" icon={AttachMoneyIcon} index={1} />
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box className="card" sx={{ height: "100%", mb: 0 }}>
            <KPICard title="Ingreso Diario" value={formatCurrency(kpis.avgDaily)} subtitle={`${formatCurrency(kpis.totalAmount)} ÷ ${kpis.daysInPeriod} días`} icon={TrendingUpIcon} index={2} />
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box className="card" sx={{ height: "100%", mb: 0 }}>
            <KPICard title="Promedio por Tienda" value={formatCurrency(kpis.avgPerStore)} subtitle={`${formatCurrency(kpis.totalAmount)} ÷ ${dashboardData.stores?.length || 1} tienda${(dashboardData.stores?.length || 1) > 1 ? 's' : ''}`} icon={StorefrontIcon} index={4} />
          </Box>
        </Grid>

        {/* Insights — misma fila visual */}
        {insightPairs.map((pair, i) => (
          <Grid item xs={6} md={3} key={`insight-${i}`}>
            <Box className="card" sx={{
              height: "100%", mb: 0,
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <pair.icon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>{pair.title}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowUpwardIcon sx={{ fontSize: 14, color: "#11998e" }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{pair.best}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowDownwardIcon sx={{ fontSize: 14, color: "#e94560" }} />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>{pair.worst}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Gráfica principal */}
      <Box className="card">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "text.primary" }}>
            {month === 0 ? "Ventas por mes" : "Ventas por día del mes"}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={mainChartType} onChange={(e) => setMainChartType(e.target.value)}>
              <MenuItem value="line">Líneas</MenuItem>
              <MenuItem value="bar">Barras</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {mainChartType === "line" ? (
          <LineChart
            title=""
            data={dashboardData}
            metricType={metricType}
            labels={month === 0
              ? MONTH_NAMES_SHORT
              : daysLabels
            }
            yText="Ventas"
            xText={month === 0 ? "Meses" : "Días"}
            dataType={month === 0 ? "monthly" : "day_of_month"}
            todayLabel={todayLabel}
          />
        ) : (
          <MainBarChart
            data={dashboardData}
            metricType={metricType}
            labels={month === 0
              ? MONTH_NAMES_SHORT
              : daysLabels
            }
            dataType={month === 0 ? "monthly" : "day_of_month"}
            daysInMonth={month !== 0 ? daysLabels.length : 12}
            todayLabel={todayLabel}
          />
        )}
      </Box>

      {/* Gráficas secundarias */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <AvgTicketChart data={dashboardData} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <DoughnutChart
              title="Ventas por tienda"
              data={dashboardData}
              metricType={metricType}
              dataType="store"
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className="card">
            <SalesHeatmap data={dashboardData} metricType={metricType} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// --- Barras agrupadas para gráfica principal ---
const processBarData = (result, dataType, metricType, daysInMonth) => {
  if (!result?.sales?.length) return [];
  const { stores, sales } = result;
  const len = dataType === "monthly" ? 12 : daysInMonth;
  const grouped = {};
  stores.forEach((s) => { grouped[s.name] = Array(len).fill(0); });
  sales.forEach((s) => {
    if (!grouped[s.store_name]) return;
    const d = new Date(s.created_at);
    const idx = dataType === "monthly" ? d.getMonth() : d.getDate() - 1;
    if (idx >= 0 && idx < len) grouped[s.store_name][idx] += metricType === "total" ? (s.total || 0) : 1;
  });
  return stores.map((store, i) => ({
    data: grouped[store.name],
    label: store.name,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));
};

const MainBarChart = ({ data, metricType, labels, dataType, daysInMonth, todayLabel }) => {
  const series = React.useMemo(() => processBarData(data, dataType, metricType, daysInMonth), [data, dataType, metricType, daysInMonth]);
  if (!series.length) return null;
  return (
    <BarChart
      xAxis={[{ data: labels, scaleType: "band", tickLabelStyle: { fontSize: 11, fill: "#64748b" } }]}
      yAxis={[{ min: 0, tickLabelStyle: { fontSize: 11, fill: "#64748b" } }]}
      series={series}
      height={300}
      margin={{ top: 50, bottom: 50, left: 70, right: 10 }}
      borderRadius={4}
      slotProps={{
        legend: { direction: "row", position: { vertical: "top", horizontal: "middle" }, padding: 0 },
      }}
      grid={{ horizontal: true }}
    >
      {todayLabel && <ChartsReferenceLine x={todayLabel} lineStyle={{ stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "6 3" }} labelStyle={{ fill: "#ef4444", fontSize: 11, fontWeight: 600 }} label="Hoy" />}
    </BarChart>
  );
};

// --- Filtros extraídos como componente interno ---
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

export default Dashboard;
