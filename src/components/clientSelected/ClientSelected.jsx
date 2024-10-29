import React from "react";
import { useSelector } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";

const ClientSelected = () => {
  const client = useSelector((state) => state.clientSelectedReducer.client);

  return (
    <Row>
      <Col md={4}>
      <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          value={client.full_name ? client.full_name: ""}
          placeholder="Nombre"
          disabled
        />
      </Col>

      <Col md={4}>
      <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="text"
          value={client.phone_number ? client.phone_number: ""}
          placeholder="Teléfono"
          disabled
/>
      </Col>

      <Col md={4}>
      <Form.Label>Descuento</Form.Label>
        <Form.Control
          type="text"
          value={client.discount?.discount_percentage ? client.discount.discount_percentage + '%': ""}
          placeholder="Descuento"
          disabled
/>
      </Col>
    </Row>
  );
};

export default ClientSelected;
