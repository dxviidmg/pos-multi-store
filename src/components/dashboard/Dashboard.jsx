import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getSalesDashboard } from "../apis/sales";
import LineChart from "./LineChart";

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
            <LineChart title={"Test"} taskId={tasks?.task1} labels={["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]}/>
          </Col>
          <Col md={6}>
            <LineChart title={"Test"} taskId={tasks?.task2} labels={["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]}/>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
