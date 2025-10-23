import React from "react";
import { Col, Row } from "react-bootstrap";

const Dashboard = () => {
  return (
    <div>
      <div className="custom-section">
        <h1>Tablero</h1>

        <Row>
          <Col>
            {" "}
            <div className="custom-section2 bg-primary"><h2>Dias</h2></div>
          </Col>
          <Col className="">
            {" "}
            <div className="custom-section2 bg-primary"><h2>Total vendido</h2></div>
          </Col>

          <Col>
            {" "}
            <div className="custom-section2 bg-primary"><h2>Numero de Ventas</h2></div>
          </Col>
          <Col className="">
            {" "}
            <div className="custom-section2 bg-primary"><h2>Promedio de Venta</h2></div>
          </Col>
          <Col className="">
            {" "}
            <div className="custom-section2 bg-primary"><h2>Proyeccion al final del mes</h2></div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
