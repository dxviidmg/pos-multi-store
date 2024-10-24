import React from "react";
import { useSelector } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";

const ClientSelected = () => {
  const s = useSelector((state) => state.clientSelectedReducer.client);

  return (
    <Row>
      <Col md={4}>
      <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          value={s.full_name ? s.full_name: ""}
          placeholder="Nombre"
          disabled
        />
      </Col>

      <Col md={4}>
      <Form.Label>Telefono</Form.Label>
        <Form.Control
          type="text"
          value={s.phone_number ? s.phone_number: ""}
          placeholder="Telefono"
          disabled
/>
      </Col>

      <Col md={4}>
      <Form.Label>Descuento</Form.Label>
        <Form.Control
          type="text"
          value={s.discount?.discount_percentage ? s.discount.discount_percentage + '%': ""}
          placeholder="Descuento"
          disabled
/>
      </Col>
    </Row>
  );
};

export default ClientSelected;
