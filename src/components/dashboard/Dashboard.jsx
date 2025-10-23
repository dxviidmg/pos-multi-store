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
            <LineChart title={"Test"} taskId={tasks?.task2} labels={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]}/>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
