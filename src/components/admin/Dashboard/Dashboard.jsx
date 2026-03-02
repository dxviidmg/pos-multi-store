import React, { useEffect, useState } from "react";
import { getSalesDashboard } from "../../../api/sales";
import { getTaskResult } from "../../../api/products";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import { Grid, FormControl, InputLabel, Select, MenuItem, Box, Typography, CircularProgress, LinearProgress } from "@mui/material";
import { showError } from "../../../utils/alerts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [metricType, setMetricType] = useState("count");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const fetchData = async () => {
    setLoading(true);
    setProgress(0);
    const response = await getSalesDashboard({ year });
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
        console.error("Error fetching task result:", error);
        showError("Error al obtener los datos del dashboard", error.response?.data?.message || error.message || "Error de conexión");
        setLoading(false);
        setProgress(0);
        clearInterval(intervalId);
      }
    };

    let intervalId;
    pollTask();
    intervalId = setInterval(pollTask, 3000);
  };

  useEffect(() => {
    fetchData();
  }, [year]);

  return (
    <Box>
      <Box className="custom-section">
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-primary)' }}>
          Dashboard de Ventas
        </Typography>

        {loading && (
          <Box sx={{ width: '100%', mb: 3 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
              Cargando datos... {Math.round(progress)}%
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Año</InputLabel>
            <Select
              value={year}
              label="Año"
              onChange={(e) => setYear(e.target.value)}
            >
              {Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => 2025 + i).map(y => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Métrica</InputLabel>
            <Select
              value={metricType}
              label="Métrica"
              onChange={(e) => setMetricType(e.target.value)}
            >
              <MenuItem value="count">Cantidad de ventas</MenuItem>
              <MenuItem value="total">Monto total</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box className="custom-section" sx={{ height: '100%' }}>
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
          <Grid item xs={12} md={6}>
            <Box className="custom-section" sx={{ height: '100%' }}>
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
            <Box className="custom-section" sx={{ height: '100%' }}>
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
            <Box className="custom-section" sx={{ height: '100%' }}>
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
