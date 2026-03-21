import React, { useEffect, useState } from "react";
import { getSalesDashboard } from "../../../api/sales";
import { getTaskResult } from "../../../api/products";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import KPICard from "./KPICard";
import { Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography, CircularProgress } from "@mui/material";
import { showError } from "../../../utils/alerts";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [metricType, setMetricType] = useState("count");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const fetchData = async () => {
    setLoading(true);
    setProgress(0);
    
    try {
      const response = await getSalesDashboard({ year, month });
      const taskId = response.data.task;
      
      // Poll para obtener el resultado
      const pollTask = async () => {
        try {
          const { data: taskData } = await getTaskResult(taskId);
          const { result, status, meta } = taskData;

          // Actualizar progreso si está disponible
          if (meta?.current && meta?.total) {
            setProgress((meta.current / meta.total) * 100);
          }

          if (status === "SUCCESS") {
            setDashboardData(result);
            setLoading(false);
            setProgress(100);
            clearInterval(intervalId);
          } else if (status === "FAILURE") {
            showError("Error al cargar los datos del dashboard", taskData.error.message || "Error desconocido");
            setLoading(false);
            setProgress(0);
            clearInterval(intervalId);
          }
        } catch (error) {
          showError("Error al obtener los datos del dashboard", error.response?.data?.message || error.message || "Error de conexión");
          setLoading(false);
          setProgress(0);
          clearInterval(intervalId);
        }
      };

      let intervalId;
      pollTask();
      intervalId = setInterval(pollTask, 10000);
    } catch (error) {
      // Detectar error de Redis
      if (error.response?.data?.message?.includes('max requests limit exceeded')) {
        showError("Límite de Redis Excedido", "Se ha alcanzado el límite de solicitudes de Redis. Por favor, contacta al administrador del sistema");
      } else {
        showError("Error al cargar el dashboard", error.response?.data?.message || error.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year, month]);

  const calculateKPIs = () => {
    if (!dashboardData || typeof dashboardData !== 'object') return null;

    const salesData = dashboardData.sales || [];
    if (!salesData.length) return null;

    const totalSales = salesData.length;
    const totalAmount = salesData.reduce((sum, item) => sum + (item.total || 0), 0);
    
    const daysInPeriod = month === 0 ? 365 : new Date(year, month, 0).getDate();
    const avgDaily = totalAmount / daysInPeriod;

    // Mejor/peor tienda por monto
    const salesByStore = {};
    salesData.forEach(sale => {
      const store = sale.store_name || "Sin tienda";
      salesByStore[store] = (salesByStore[store] || 0) + (sale.total || 0);
    });
    const allStores = dashboardData.stores || [];
    const bestStore = Object.entries(salesByStore).reduce((max, [name, total]) =>
      total > (max.total || 0) ? { name, total } : max, { name: "N/A", total: 0 }
    ).name;
    const worstStore = Object.entries(salesByStore).reduce((min, [name, total]) =>
      total < min.total ? { name, total } : min, { name: "N/A", total: Infinity }
    ).name;

    let bestPeriod = "N/A";
    let worstPeriod = "N/A";

    if (month === 0) {
      // Agrupar por mes
      const salesByMonth = {};
      salesData.forEach(sale => {
        const date = new Date(sale.created_at);
        const monthIndex = date.getMonth();
        if (!salesByMonth[monthIndex]) {
          salesByMonth[monthIndex] = { count: 0, total: 0 };
        }
        salesByMonth[monthIndex].count++;
        salesByMonth[monthIndex].total += sale.total;
      });

      const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      const entries = Object.keys(salesByMonth);
      const bestMonthIndex = entries.reduce((max, m) => 
        salesByMonth[m].count > (salesByMonth[max]?.count || 0) ? m : max, entries[0]
      );
      const worstMonthIndex = entries.reduce((min, m) => 
        salesByMonth[m].count < (salesByMonth[min]?.count || Infinity) ? m : min, entries[0]
      );
      bestPeriod = monthNames[bestMonthIndex] || "N/A";
      worstPeriod = monthNames[worstMonthIndex] || "N/A";
    } else {
      // Agrupar por día del mes
      const salesByDate = {};
      salesData.forEach(sale => {
        const d = new Date(sale.created_at).getDate();
        salesByDate[d] = (salesByDate[d] || 0) + 1;
      });
      const dateEntries = Object.entries(salesByDate);
      const bestDate = dateEntries.reduce((max, [d, c]) => c > max[1] ? [d, c] : max, [0, 0]);
      const worstDate = dateEntries.reduce((min, [d, c]) => c < min[1] ? [d, c] : min, [0, Infinity]);
      bestPeriod = `Día ${bestDate[0]}`;
      worstPeriod = `Día ${worstDate[0]}`;
    }

    // Mejor/peor día de la semana (siempre)
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const salesByWeekday = {};
    salesData.forEach(sale => {
      const d = new Date(sale.created_at).getDay();
      salesByWeekday[d] = (salesByWeekday[d] || 0) + 1;
    });
    const wdEntries = Object.entries(salesByWeekday);
    const bestWeekday = wdEntries.length ? dayNames[wdEntries.reduce((max, [d, c]) => c > max[1] ? [d, c] : max, [0, 0])[0]] : "N/A";
    const worstWeekday = wdEntries.length ? dayNames[wdEntries.reduce((min, [d, c]) => c < min[1] ? [d, c] : min, [0, Infinity])[0]] : "N/A";

    return {
      totalSales,
      totalAmount,
      avgDaily,
      bestStore,
      worstStore,
      bestDay: bestPeriod,
      worstDay: worstPeriod,
      bestWeekday,
      worstWeekday,
      bestHour: (() => {
        const salesByHour = {};
        salesData.forEach(sale => {
          const h = new Date(sale.created_at).getHours();
          salesByHour[h] = (salesByHour[h] || 0) + 1;
        });
        const best = Object.entries(salesByHour).reduce((max, [h, count]) =>
          count > max.count ? { h, count } : max, { h: 0, count: 0 }
        );
        const worst = Object.entries(salesByHour).reduce((min, [h, count]) =>
          count < min.count ? { h, count } : min, { h: 0, count: Infinity }
        );
        return { best: `${best.h}:00`, worst: `${worst.h}:00` };
      })(),
    };
  };

  const kpis = calculateKPIs();

  return (
    <Box>
      <Box className="card">
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-primary)' }}>
          Dashboard de Ventas
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Métrica</InputLabel>
              <Select value={metricType} label="Métrica" onChange={(e) => setMetricType(e.target.value)}>
                <MenuItem value="count">Cantidad</MenuItem>
                <MenuItem value="total">Monto</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Año</InputLabel>
              <Select value={year} label="Año" onChange={(e) => setYear(e.target.value)}>
                {Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => 2025 + i).map(y => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Mes</InputLabel>
              <Select value={month} label="Mes" onChange={(e) => setMonth(e.target.value)}>
                <MenuItem value={0}>Todo el año</MenuItem>
                {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((m, i) => (
                  <MenuItem key={i + 1} value={i + 1}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {!loading && kpis && (
            <>
            <Grid item xs={12} sm={3}>
              <Box sx={{ bgcolor: '#04346b', p: 1, borderRadius: 1, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                  {metricType === 'count' ? 'Total Ventas' : 'Monto Total'}: {metricType === 'count' ? kpis.totalSales.toLocaleString() : `$${kpis.totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 0 })}`}
                </Typography>
              </Box>
            </Grid>
            </> 
          )}
        </Grid>

        {!loading && kpis && (
          <Grid container spacing={1} sx={{ mt: 1 }}>
              {[
                  ...(dashboardData.stores?.length > 1 ? [
                    { label: 'Mejor Tienda', value: kpis.bestStore, color: '#0d7c3e' },
                    { label: 'Peor Tienda', value: kpis.worstStore, color: '#b91c1c' },
                  ] : []),
                  { label: month === 0 ? 'Mejor Mes' : 'Mejor Día', value: kpis.bestDay, color: '#0d7c3e' },
                  { label: month === 0 ? 'Peor Mes' : 'Peor Día', value: kpis.worstDay, color: '#b91c1c' },
                  { label: 'Mejor Día Semana', value: kpis.bestWeekday, color: '#0d7c3e' },
                  { label: 'Peor Día Semana', value: kpis.worstWeekday, color: '#b91c1c' },
                  { label: 'Mejor Hora', value: kpis.bestHour.best, color: '#0d7c3e' },
                  { label: 'Peor Hora', value: kpis.bestHour.worst, color: '#b91c1c' },
                ].map((kpi, i) => (
                  <Grid item xs={12} sm={3} key={i}>
                    <Box sx={{ bgcolor: kpi.color, p: 1, borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>{kpi.label}: {kpi.value}</Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {month === 0 && (
            <Grid item xs={12} md={6}>
              <Box className="card" sx={{ height: '100%' }}>
                <LineChart
                  title={"Ventas por mes"}
                  data={dashboardData}
                  metricType={metricType}
                  labels={[
                    "Ene",
                    "Feb",
                    "Mar",
                    "Abr",
                    "May",
                    "Jun",
                    "Jul",
                    "Ago",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dic",
                  ]}
                  yText={"Ventas"}
                  xText={"Meses"}
                  dataType="monthly"
                />
              </Box>
            </Grid>
          )}
          {month !== 0 && (
            <Grid item xs={12} md={6}>
              <Box className="card" sx={{ height: '100%' }}>
                <LineChart
                  title={"Ventas por día del mes"}
                  data={dashboardData}
                  metricType={metricType}
                  labels={Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => (i + 1).toString())}
                  yText={"Ventas"}
                  xText={"Días"}
                  dataType="day_of_month"
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Box className="card" sx={{ height: '100%' }}>
              <LineChart
                title={"Ventas por día"}
                data={dashboardData}
                metricType={metricType}
                labels={[
                  "Domingo",
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                ]}
                yText={"Ventas"}
                xText={"Días"}
                dataType="daily"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="card" sx={{ height: '100%' }}>
              <LineChart
                title={"Ventas por hora"}
                data={dashboardData}
                metricType={metricType}
                labels={[
                  "0:00",
                  "1:00",
                  "2:00",
                  "3:00",
                  "4:00",
                  "5:00",
                  "6:00",
                  "7:00",
                  "8:00",
                  "9:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                  "21:00",
                  "22:00",
                  "23:00",
                ]}
                yText={"Ventas"}
                xText={"Horas"}
                dataType="hourly"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="card" sx={{ height: '100%' }}>
              <DoughnutChart
                title={"Ventas por tienda"}
                data={dashboardData}
                metricType={metricType}
                dataType="store"
              />
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
