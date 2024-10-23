import React from "react";
import SearchClient from "../searchClient/SearchClient";
import SearchProduct from "../searchProduct/SearchProduct";
import Cart from "../cart/Cart";
import ClientSelected from "../clientSelected/ClientSelected";
import { Col, Container, Row } from "react-bootstrap";
const NewSale = () => {
  return (
    <Container>
      <Row>
        <h1>Clientes xxx</h1>
        <Col md={6}>
          {" "}
          <SearchClient></SearchClient>
        </Col>
        <Col md={6}>
          {" "}
          <ClientSelected></ClientSelected>
        </Col>
      </Row>

      <Row>
        <h1>Productos</h1>

        <Col md={12}>
          {" "}
          <SearchProduct></SearchProduct>
        </Col>

        <h1>Compra actual</h1>
        <Col md={12}>
          {" "}
          <Cart></Cart>
        </Col>
      </Row>
      

    </Container>
  );
};

export default NewSale;
