import React from "react";
import SearchProduct from "../searchProduct/SearchProduct";
import { Col, Container, Row } from "react-bootstrap";
import TabCart from "../cart/TabCart";


const SaleCreate = () => {
  return (
    <Container fluid>

      <Row className="section">
        <Col md={12}>
          {" "}
          <SearchProduct></SearchProduct>
        </Col>
      </Row>

      <Row className="section">
        <TabCart/>
      </Row>
    </Container>
  );
};

export default SaleCreate;
