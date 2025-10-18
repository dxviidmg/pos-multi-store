import React, { useEffect, useState } from "react";
import customTable from "../commons/customTable/customTable";
import { Row, Col, Form, ProgressBar } from "react-bootstrap";
import { getFormattedDate } from "../utils/utils";
import { getSales, getSalesAsync } from "../apis/sales";
import { getTaskResult } from "../apis/products";


const AuditDashboard = () => {

    const today = getFormattedDate();
    const [taskId, setTaskId] = useState()
    const [params, setParams] = useState({
      end_date: today,
      start_date: today,
    });
    const [progress, setProgress] = useState(0)


    useEffect(() => {
        const fetchSalesData = async () => {    
          const salesResponse = await getSalesAsync(params);
    
          setTaskId(salesResponse.data.task_id);
    
        };
    
        fetchSalesData();
      }, [params]);



      useEffect(() => {
        if (!taskId) return;
        const interval = setInterval(async () => {
          const response = await getTaskResult(taskId);
          console.log(response.data)
          if (response.data.result !== null) {

            clearInterval(interval);
          }
          else{
            setProgress(response.data.info.percent)
          }
        }, 3000); // cada 2 segundos
      
        return () => clearInterval(interval);
      }, [taskId]);

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

        <Col  md={6}>
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

        <Col>Ventas duplicadas <ProgressBar animated now={progress} /></Col>
        <Col>Logs duplicados</Col>
        <Col>Logs inconsistentes</Col>
        <Col>Almacen inconsistente</Col>
      </Row>
    </div>
  );
};

export default AuditDashboard;
