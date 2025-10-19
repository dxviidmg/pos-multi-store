import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { getFormattedDate } from "../utils/utils";
import { getSalesAsync } from "../apis/sales";
import AuditDashboardData from "./AuditDashboardData";

const AuditDashboard = () => {
  const today = getFormattedDate();
  const [taskId, setTaskId] = useState();
  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      const salesResponse = await getSalesAsync(params);

      setTaskId(salesResponse.data.task_id);
    };

    fetchSalesData();
  }, [params]);

  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="custom-section">
      <h1>Tablero de auditoria</h1>

      <Row>
        {" "}
        <Col md={6}>
          {" "}
          <Form>
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              name="start_date"
              type="date"
              value={params.start_date}
              onChange={(e) => handleParams(e)}
              max={today}
            />
          </Form>
        </Col>
        <Col md={6}>
          {" "}
          <Form>
            <Form.Label>Fecha de fin</Form.Label>
            <Form.Control
              name="end_date"
              type="date"
              value={params.end_date}
              onChange={(e) => handleParams(e)}
              max={today}
            />
          </Form>
        </Col>
        <Col>
          <AuditDashboardData
            title={"Ventas duplicadas"}
            taskId={taskId}
          ></AuditDashboardData>
        </Col>
        <Col>
          {" "}
          <AuditDashboardData
            title={"Logs duplicados ejemplo"}
            taskId={taskId}
          ></AuditDashboardData>
        </Col>
        <Col>Logs inconsistentes</Col>
        <Col>Almacen inconsistente</Col>
      </Row>
    </div>
  );
};

export default AuditDashboard;
