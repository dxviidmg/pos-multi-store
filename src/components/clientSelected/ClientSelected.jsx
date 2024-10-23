import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchClient from "../searchClient/SearchClient";
import Searcher from "../commons/searcher/Searcher";
import { Col, Form, Row } from "react-bootstrap";

const ClientSelected = () => {
  const s = useSelector((state) => state.clientSelectedReducer.client);

  return (
    <Row>
      <Col md={3}>
      <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          value={s.full_name ? s.full_name: ""}
          placeholder="Nombre"
          disabled
        />
      </Col>

      <Col md={3}>
      <Form.Label>Telefono</Form.Label>
        <Form.Control
          type="text"
          value={s.phone_number ? s.phone_number: ""}
          placeholder="Telefono"
          disabled
/>
      </Col>
      <Col md={3}>
      <Form.Label>Tipo de cliente</Form.Label>
        <Form.Control
          type="text"
          value={s.special_client_type?.name ? s.special_client_type.name : ""}
          placeholder="Tipo de cliente"
          disabled
/>
      </Col>

      <Col md={3}>
      <Form.Label>Descuento</Form.Label>
        <Form.Control
          type="text"
          value={s.special_client_type?.discount_percentage ? s.special_client_type.discount_percentage + '%': ""}
          placeholder="Descuento"
          disabled
/>
      </Col>
    </Row>
  );
};

export default ClientSelected;
