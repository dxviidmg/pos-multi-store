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
            <LineChart title={"Ventas por mes"} taskId={tasks?.task1} labels={["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]} yText={"Ingresos"} xText={"Meses"}/>
          </Col>
          <Col md={6}>
            <LineChart title={"Ventas por dia"} taskId={tasks?.task2} labels={["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]} yText={"Ingresos"} xText={"Dias"}/>
          </Col>

          <Col md={6}>
            <LineChart title={"Ventas por dia"} taskId={tasks?.task3} labels={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]} yText={"Ingresos"} xText={"Dias"}/>
          </Col>

          <Col md={4}>
            <DoughnutChart title={"Metodos de pago"} taskId={tasks?.task4}/>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
