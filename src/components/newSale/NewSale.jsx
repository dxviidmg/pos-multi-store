import React from "react";
import SearchClient from "../searchClient/SearchClient";
import SearchProduct from "../searchProduct/SearchProduct";
import Cart from "../cart/Cart";
import ClientSelected from "../clientSelected/ClientSelected";
import { Col, Container, Row } from "react-bootstrap";
import TabCart from "../cart/TabCart";
import { getUserData } from "../apis/utils";


const NewSale = () => {
  const store_type = getUserData().store_type;

  return (
    <Container fluid>
  {store_type === "T" && (

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

  )}
      <Row className="section">
        <Col md={12}>
          {" "}
          <SearchProduct></SearchProduct>
        </Col>
      </Row>

      <Row className="section">
        <TabCart></TabCart>
      </Row>
    </Container>
  );
};

export default NewSale;
