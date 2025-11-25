import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getSalesDashboard } from "../apis/sales";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";

const Dashboard = () => {
  const [tasks, setTasks] = useState();
  const fetchData = async () => {
    const response = await getSalesDashboard();

    setTasks(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="custom-section">
        <h1>Tablero</h1>

        <Row>
          <Col md={6}>
            <LineChart
              title={"Ventas por mes"}
              taskId={tasks?.task1}
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
            />
          </Col>
          <Col md={6}>
            <LineChart
              title={"Promedio ventas por dia (ultimo mes)"}
              taskId={tasks?.task2}
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
            />
          </Col>

          <Col md={6}>
            <LineChart
              title={"Promedio de ventas por hora (ultimo mes)"}
              taskId={tasks?.task3}
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
              xText={"Dias"}
            />
          </Col>
          <Col md={3}>
            <DoughnutChart
              title={"% de metodos de pago"}
              taskId={tasks?.task4}
            />
          </Col>
          <Col md={3}>
            <DoughnutChart
              title={"% Ventas por tienda"}
              taskId={tasks?.task5}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
