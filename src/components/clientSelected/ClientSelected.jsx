import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { removeClient } from "../redux/clientSelected/clientSelectedActions";


const ClientSelected = () => {
  const client = useSelector((state) => state.clientSelectedReducer.client);
  const dispatch = useDispatch()
  return (
    <Row>
      <Col md={3}>
      <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          value={client.full_name ? client.full_name: ""}
          placeholder="Nombre"
          disabled
        />
      </Col>

      <Col md={3}>
      <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="text"
          value={client.phone_number ? client.phone_number: ""}
          placeholder="Teléfono"
          disabled
/>
      </Col>

      <Col md={3}>
      <Form.Label>Descuento</Form.Label>
        <Form.Control
          type="text"
          value={client.discount_percentage ? client.discount_percentage + '%': ""}
          placeholder="Descuento"
          disabled
/>
      </Col>

      <Col md={3}>
      <Form.Label>Borrar cliente</Form.Label>
      <CustomButton fullWidth={true} onClick={e => dispatch(removeClient())}>Borrar cliente</CustomButton>
      </Col>
    </Row>
  );
};

export default ClientSelected;
