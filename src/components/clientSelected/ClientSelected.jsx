import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";
import CustomButton from "../commons/customButton/CustomButton";
import { removeClient } from "../redux/clientSelected/clientSelectedActions";

const ClientSelected = () => {
  const client = useSelector((state) => state.clientSelectedReducer.client);
  const dispatch = useDispatch();

  return (
    <Row className="align-items-end">
      <Col md={3}>
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={client.full_name ? client.full_name : ""}
            placeholder="Nombre"
            disabled
          />
        </Form.Group>
      </Col>

      <Col md={3}>
        <Form.Group>
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={client.phone_number ? client.phone_number : ""}
            placeholder="Teléfono"
            disabled
          />
        </Form.Group>
      </Col>

      <Col md={3}>
        <Form.Group>
          <Form.Label>Descuento</Form.Label>
          <Form.Control
            type="text"
            value={client.discount_percentage ? `${client.discount_percentage}%` : ""}
            placeholder="Descuento"
            disabled
          />
        </Form.Group>
      </Col>

      <Col md={3}>
        <Form.Group>
          <CustomButton fullWidth={true} onClick={() => dispatch(removeClient())}>
            Borrar cliente
          </CustomButton>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default ClientSelected;
