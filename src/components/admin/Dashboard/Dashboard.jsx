import React, { useEffect, useState } from "react";
import { getSalesDashboard } from "../../../api/sales";
import { getTaskResult } from "../../../api/products";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import { Grid } from "@mui/material";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  
  const fetchData = async () => {
    const response = await getSalesDashboard();
    const taskId = response.data.task;
    
    // Poll para obtener el resultado
    const pollTask = async () => {
      try {
        const { data: taskData } = await getTaskResult(taskId);
        const { result, status } = taskData;

        if (status === "SUCCESS") {
          setDashboardData(result);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error fetching task result:", error);
        clearInterval(intervalId);
      }
    };

    let intervalId;
    pollTask();
    intervalId = setInterval(pollTask, 3000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Grid className="custom-section">
        <h1>Tablero</h1>

        <Grid container>
          <Grid item xs={12} md={6}>
            <LineChart
              title={"Ventas por mes"}
              data={dashboardData}
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
              dataType="store"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
