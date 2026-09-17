import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getSalesDashboard } from "../../../api/sales";
import useTaskPolling from "../../../hooks/useTaskPolling";
import CountdownTimer from "../../ui/CountdownTimer";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import SalesHeatmap from "./SalesHeatmap";
import AvgTicketChart from "./AvgTicketChart";
import KPICard from "./KPICard";
import { BarChart } from "@mui/x-charts/BarChart";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import {
  Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography,
  LinearProgress, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from "@mui/material";
import {
  MONTH_NAMES,
  MONTH_NAMES_SHORT,
  CHART_COLORS,
  formatCurrency,
} from "../../../utils/utils";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InboxIcon from "@mui/icons-material/Inbox";
import PercentIcon from "@mui/icons-material/Percent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Dashboard = () => {
  const [metricType, setMetricType] = useState("total"); // "total" o "count"
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [mainChartType, setMainChartType] = useState("line");

  const startTask = useCallback(async () => {
    const response = await getSalesDashboard({ year, month });
    return response.data.task;
  }, [year, month]);

  const { data: dashboardData, loading, progress, countdown, fetchData } = useTaskPolling(startTask);

  useEffect(() => { fetchData(); }, [year, month, fetchData]);

  const kpis = useMemo(() => {
    if (!dashboardData?.sales?.length) return null;
    const salesData = dashboardData.sales;
    const totalSales = salesData.length;
    const totalAmount = metricType === "total" 
      ? salesData.reduce((sum, s) => sum + (s.total || 0), 0)
      : totalSales;
    const totalProfit = metricType === "total"
      ? salesData.reduce((sum, s) => sum + (s.profit || 0), 0)
      : 0;
    const marginPercentage = metricType === "total" && totalAmount > 0 
      ? ((totalProfit / totalAmount) * 100).toFixed(2) 
      : 0;
    
    const now = new Date();
    const totalDaysInPeriod = month === 0 ? 365 : new Date(year, month, 0).getDate();
    const isCurrentPeriod = month === 0 ? year === now.getFullYear() : (year === now.getFullYear() && month === now.getMonth() + 1);
    const daysInPeriod = isCurrentPeriod ? (month === 0 ? Math.floor((now - new Date(year, 0, 1)) / 86400000) + 1 : now.getDate()) : totalDaysInPeriod;
    const avgDaily = totalAmount / daysInPeriod;
    const avgDailyProfit = totalProfit / daysInPeriod;

    const storeCount = dashboardData.stores?.length || 1;
    const avgPerStore = totalAmount / storeCount;

    return { totalSales, totalAmount, totalProfit, marginPercentage, avgDaily, avgDailyProfit, avgPerStore, daysInPeriod };
  }, [dashboardData, month, year, metricType]);

  // Preparar datos por tienda para tabla comparativa
  const storeComparison = useMemo(() => {
    if (!dashboardData?.sales?.length) return [];
    const byStore = {};
    
    dashboardData.stores?.forEach(store => {
      byStore[store.id] = {
        id: store.id,
        name: store.name,
        ventas: 0,
        ganancias: 0,
        transacciones: 0,
      };
    });

    dashboardData.sales.forEach(sale => {
      if (byStore[sale.store_id]) {
        if (metricType === "total") {
          byStore[sale.store_id].ventas += sale.total || 0;
          byStore[sale.store_id].ganancias += sale.profit || 0;
        } else {
          byStore[sale.store_id].ventas += 1;
          byStore[sale.store_id].ganancias = 0;
        }
        byStore[sale.store_id].transacciones += 1;
      }
    });

    return Object.values(byStore).map(store => ({
      ...store,
      margen: metricType === "total" && store.ventas > 0 ? ((store.ganancias / store.ventas) * 100).toFixed(2) : 0,
      ticketPromedio: store.transacciones > 0 ? (store.ventas / store.transacciones).toFixed(2) : 0,
    }));
  }, [dashboardData, metricType]);

  // Calcular mejor/peor tienda, día, hora
  const insights = useMemo(() => {
    if (!dashboardData?.sales?.length) return null;

    const metricVal = (s) => metricType === "total" ? (s.total || 0) : 1;

    // Mejor/peor tienda
    const byStore = {};
    dashboardData.stores?.forEach(s => { byStore[s.name] = 0; });
    dashboardData.sales.forEach(s => { 
      const store = s.store_name || "Sin tienda"; 
      byStore[store] = (byStore[store] || 0) + metricVal(s); 
    });
    const storeEntries = Object.entries(byStore).sort((a, b) => b[1] - a[1]);
    const bestStore = storeEntries.length > 0 ? storeEntries[0][0] : "N/A";
    const worstStore = storeEntries.length > 0 ? storeEntries[storeEntries.length - 1][0] : "N/A";

    // Mejor/peor día del mes y por día de la semana
    let bestDay = "N/A", worstDay = "N/A", bestDayOfWeek = "N/A", worstDayOfWeek = "N/A";
    if (month !== 0) {
      const dayOfWeekNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      
      // Mejor/peor día específico del mes
      const byDay = {};
      dashboardData.sales.forEach(s => { 
        const d = new Date(s.created_at);
        const dayNum = d.getDate();
        byDay[dayNum] = (byDay[dayNum] || 0) + metricVal(s); 
      });
      const dayEntries = Object.entries(byDay).sort((a, b) => b[1] - a[1]);
      bestDay = dayEntries.length > 0 ? dayEntries[0][0] : "N/A";
      worstDay = dayEntries.length > 0 ? dayEntries[dayEntries.length - 1][0] : "N/A";

      // Promedio por día de la semana
      const byDayOfWeek = {};
      const countByDayOfWeek = {};
      dayOfWeekNames.forEach(day => {
        byDayOfWeek[day] = 0;
        countByDayOfWeek[day] = 0;
      });
      dashboardData.sales.forEach(s => { 
        const d = new Date(s.created_at);
        const dayOfWeek = dayOfWeekNames[d.getDay()];
        byDayOfWeek[dayOfWeek] += metricVal(s);
        countByDayOfWeek[dayOfWeek] += 1;
      });
      
      // Calcular promedio
      Object.keys(byDayOfWeek).forEach(day => {
        if (countByDayOfWeek[day] > 0) {
          byDayOfWeek[day] = byDayOfWeek[day] / countByDayOfWeek[day];
        }
      });
      
      const dayOfWeekEntries = Object.entries(byDayOfWeek).sort((a, b) => b[1] - a[1]);
      bestDayOfWeek = dayOfWeekEntries.length > 0 ? dayOfWeekEntries[0][0] : "N/A";
      worstDayOfWeek = dayOfWeekEntries.length > 0 ? dayOfWeekEntries[dayOfWeekEntries.length - 1][0] : "N/A";
    }

    // Mejor/peor hora
    const byHour = {};
    dashboardData.sales.forEach(s => { 
      const h = new Date(s.created_at).getHours(); 
      byHour[h] = (byHour[h] || 0) + metricVal(s); 
    });
    const hourEntries = Object.entries(byHour).sort((a, b) => b[1] - a[1]);
    const bestHour = hourEntries.length > 0 ? `${hourEntries[0][0]}:00` : "N/A";
    const worstHour = hourEntries.length > 0 ? `${hourEntries[hourEntries.length - 1][0]}:00` : "N/A";

    return { bestStore, worstStore, bestDay, worstDay, bestDayOfWeek, worstDayOfWeek, bestHour, worstHour };
  }, [dashboardData, month, metricType]);

  const periodLabel = month === 0 ? MONTH_NAMES[month] : `${MONTH_NAMES[month - 1]} ${year}`;

  // --- LOADING STATE ---
  if (loading) {
    return (
      <Box>
        <Box className="card" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Tablero de Ventas</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Procesando datos...</Typography>
          <LinearProgress
            variant={progress > 0 ? "determinate" : "indeterminate"}
            value={progress}
            sx={{ height: 6, borderRadius: 3, mb: 1 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {progress > 0 && <Typography variant="caption" color="text.secondary">{Math.round(progress)}% completado</Typography>}
            <CountdownTimer seconds={countdown} />
          </Box>
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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Tablero de Ventas</Typography>
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

  const daysLabels = month !== 0
    ? Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => (i + 1).toString())
    : [];

  const now = new Date();
  const todayLabel = month !== 0 && year === now.getFullYear() && month === now.getMonth() + 1
    ? now.getDate().toString() : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box className="card" sx={{ mb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Tablero de Ventas</Typography>
            <Typography variant="body2" color="text.secondary">{periodLabel}</Typography>
          </Box>
        </Box>
        <Filters {...{ metricType, setMetricType, year, setYear, month, setMonth }} />
      </Box>

      {metricType === "total" && (
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box className="card" sx={{ height: "100%", mb: 0 }}>
              <KPICard 
                title="Ventas"
                value={formatCurrency(kpis.totalAmount)}
                subtitle={`${kpis.totalSales} transacciones`}
                icon={AttachMoneyIcon}
                index={0}
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box className="card" sx={{ height: "100%", mb: 0 }}>
              <KPICard 
                title="Ganancias"
                value={formatCurrency(kpis.totalProfit)}
                subtitle={periodLabel}
                icon={TrendingUpIcon}
                index={1}
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box className="card" sx={{ height: "100%", mb: 0 }}>
              <KPICard 
                title="Margen"
                value={`${kpis.marginPercentage}%`}
                subtitle={`De ${formatCurrency(kpis.totalAmount)}`}
                icon={PercentIcon}
                index={2}
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box className="card" sx={{ height: "100%", mb: 0 }}>
              <KPICard 
                title="Ticket Promedio"
                value={formatCurrency(kpis.totalAmount / kpis.totalSales)}
                subtitle={`${kpis.totalSales} ventas`}
                icon={ShoppingCartIcon}
                index={3}
              />
            </Box>
          </Grid>
        </Grid>
      )}

      {metricType === "count" && (
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box className="card" sx={{ height: "100%", mb: 0 }}>
              <KPICard 
                title="Transacciones"
                value={kpis.totalSales.toLocaleString()}
                subtitle={periodLabel}
                icon={ShoppingCartIcon}
                index={0}
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box className="card" sx={{ height: "100%", mb: 0 }}>
              <KPICard 
                title={month === 0 ? "Promedio por Mes" : "Promedio por Día"}
                value={month === 0 
                  ? (kpis.totalSales / 12).toFixed(0)
                  : (kpis.totalSales / kpis.daysInPeriod).toFixed(0)
                }
                subtitle={month === 0 ? "12 meses" : `${kpis.daysInPeriod} días`}
                icon={StorefrontIcon}
                index={1}
              />
            </Box>
          </Grid>
        </Grid>
      )}

      {insights && storeComparison.length > 1 && (
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box className="card" sx={{ height: "100%", mb: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <StorefrontIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>Tiendas</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowUpwardIcon sx={{ fontSize: 14, color: "#11998e" }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{insights.bestStore}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowDownwardIcon sx={{ fontSize: 14, color: "#e94560" }} />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>{insights.worstStore}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {month !== 0 && (
            <Grid item xs={6} md={3}>
              <Box className="card" sx={{ height: "100%", mb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <CalendarMonthIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>Día del Mes</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: "#11998e" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Día {insights.bestDay}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <ArrowDownwardIcon sx={{ fontSize: 14, color: "#e94560" }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Día {insights.worstDay}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          )}

          {month !== 0 && (
            <Grid item xs={6} md={3}>
              <Box className="card" sx={{ height: "100%", mb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <CalendarMonthIcon sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>Día de Semana</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <ArrowUpwardIcon sx={{ fontSize: 14, color: "#11998e" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{insights.bestDayOfWeek}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <ArrowDownwardIcon sx={{ fontSize: 14, color: "#e94560" }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>{insights.worstDayOfWeek}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid item xs={6} md={3}>
            <Box className="card" sx={{ height: "100%", mb: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>Horas</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowUpwardIcon sx={{ fontSize: 14, color: "#11998e" }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{insights.bestHour}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ArrowDownwardIcon sx={{ fontSize: 14, color: "#e94560" }} />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>{insights.worstHour}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {storeComparison.length > 1 && (
        <Box className="card">
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Comparación por Tienda</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "action.hover" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Tienda</TableCell>
                  {metricType === "total" ? (
                    <>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Ventas</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Ganancias</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Margen %</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Ticket Promedio</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Transacciones</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Transacciones</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {month === 0 ? "Promedio por Mes" : "Promedio por Día"}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {storeComparison.map((store) => (
                  <TableRow key={store.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{store.name}</TableCell>
                    {metricType === "total" ? (
                      <>
                        <TableCell align="right">{formatCurrency(store.ventas)}</TableCell>
                        <TableCell align="right">{formatCurrency(store.ganancias)}</TableCell>
                        <TableCell 
                          align="right"
                          sx={{
                            color: store.margen > 20 ? "success.main" : store.margen > 10 ? "warning.main" : "error.main",
                            fontWeight: 600,
                          }}
                        >
                          {store.margen}%
                        </TableCell>
                        <TableCell align="right">{formatCurrency(store.ticketPromedio)}</TableCell>
                        <TableCell align="right">{store.transacciones}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell align="right">{store.transacciones}</TableCell>
                        <TableCell align="right">{(month === 0 ? (store.transacciones / 12) : (store.transacciones / kpis.daysInPeriod)).toFixed(0)}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

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
            yText={metricType === "total" ? "Ventas" : "Cantidad"}
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box className="card" sx={{ height: "100%" }}>
            <AvgTicketChart data={dashboardData} metricType={metricType} />
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
          <MenuItem value="total">Monto</MenuItem>
          <MenuItem value="count">Cantidad de Transacciones</MenuItem>
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
