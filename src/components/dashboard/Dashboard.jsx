import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getSalesDashboard } from "../apis/sales";
import LineChart from "./LineChart";

const Dashboard = () => {
  const [task, setTask] = useState();
  const fetchData = async () => {
    const response = await getSalesDashboard();

    setTask(response.data.task);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="custom-section">
        <h1>Tablero</h1>

        <Row>
          <Col>
            <LineChart title={"Test"} taskId={task}/>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
