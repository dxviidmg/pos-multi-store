import React from "react";
import SearchClient from "../searchClient/SearchClient";
import SearchProduct from "../searchProduct/SearchProduct";
import Cart from "../cart/Cart";
import ClientSelected from "../clientSelected/ClientSelected";
import { Col, Container, Row } from "react-bootstrap";
const NewSale = () => {
  return (
    <Container >
      <Row className="section">
        <Col md={6}>
          {" "}
          <SearchClient></SearchClient>
        </Col>
        <Col md={6}>
          {" "}
          <ClientSelected></ClientSelected>
        </Col>
      </Row>

      <Row className="section">
        <Col md={12}>
          {" "}
          <SearchProduct></SearchProduct>
        </Col>
      </Row>


      <Row className="section">


        <Col md={12}>
          {" "}
          <Cart></Cart>
        </Col>
      </Row>
      

    </Container>
  );
};

export default NewSale;
