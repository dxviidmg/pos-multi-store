import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { getFormattedDate } from "../utils/utils";
import AuditDashboardData from "./AuditDashboardData";
import CustomButton from "../commons/customButton/CustomButton";
import { getAudit } from "../apis/audit";

const AuditDashboard = () => {
  const today = getFormattedDate();
  const [tasks, setTasks] = useState({});
  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });


  const fetchSalesData = async () => {
    const salesResponse = await getAudit(params);

    setTasks(salesResponse.data);
  };

//  useEffect(() => {


//    fetchSalesData();
//  }, []);

  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    fetchSalesData()
  }
  return (
    <div className="custom-section">
      <h1>Tablero de auditoria</h1>

      <Row>
        {" "}
        <Col md={4}>
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
        <Col md={4}>
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
        <Col md={4} className="d-flex flex-column justify-content-end"><CustomButton fullWidth onClick={()=>(handleSubmit())}>Buscar</CustomButton></Col>
        <Col>
          <AuditDashboardData
            title={"Ventas duplicadas"}
            taskId={tasks?.task1}
          ></AuditDashboardData>
        </Col>
        <Col>
          {" "}
          <AuditDashboardData
            title={"Logs duplicados"}
            taskId={tasks?.task2}
          ></AuditDashboardData>
        </Col>
        <Col>
          {" "}
        </Col>
        <Col>Logs inconsistentes</Col>
        <Col>Almacen inconsistente</Col>
      </Row>
    </div>
  );
};

export default AuditDashboard;
