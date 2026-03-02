import React, { useEffect, useState } from "react";
import { getSalesDashboard } from "../../../api/sales";
import { getTaskResult } from "../../../api/products";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import { Grid, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { showError } from "../../../utils/alerts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [metricType, setMetricType] = useState("count");
  const [year, setYear] = useState(new Date().getFullYear());
  
  const fetchData = async () => {
    const response = await getSalesDashboard({ year });
    const taskId = response.data.task;
    
    // Poll para obtener el resultado
    const pollTask = async () => {
      try {
        const { data: taskData } = await getTaskResult(taskId);
        const { result, status } = taskData;

        if (status === "SUCCESS") {
          setDashboardData(result);
          clearInterval(intervalId);
        } else if (status === "FAILURE") {
          showError("Error al cargar los datos del dashboard", taskData.error.message || "Error desconocido");
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error fetching task result:", error);
        showError("Error al obtener los datos del dashboard", error.response?.data?.message || error.message || "Error de conexión");
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
    <div>
      <Grid className="custom-section">
        <h1>Tablero</h1>

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
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

          <FormControl sx={{ minWidth: 200 }}>
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

        <Grid container>
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={6}>
            <LineChart
              title={"Ventas por dia"}
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
              xText={"Dias"}
              dataType="daily"
            />
          </Grid>

          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={3}>

          </Grid>
          <Grid item xs={12} md={3}>
            <DoughnutChart
              title={"% Ventas por tienda"}
              data={dashboardData}
              metricType={metricType}
              dataType="store"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
