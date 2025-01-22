import React from "react";
import SearchClient from "../searchClient/SearchClient";
import SearchProduct from "../searchProduct/SearchProduct";
import ClientSelected from "../clientSelected/ClientSelected";
import { Col, Container, Row } from "react-bootstrap";
import TabCart from "../cart/TabCart";
import { getUserData } from "../apis/utils";

const SaleCreate = () => {
  const store_type = getUserData().store_type;

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
