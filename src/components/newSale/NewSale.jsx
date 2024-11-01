import React from "react";
import SearchClient from "../searchClient/SearchClient";
import SearchProduct from "../searchProduct/SearchProduct";
import Cart from "../cart/Cart";
import ClientSelected from "../clientSelected/ClientSelected";
import { Col, Container, Row } from "react-bootstrap";
import JustifiedExample from "../cart/Cart2";
const NewSale = () => {
  return (
    <div>
      <Row className="section">
        <Col md={12}>
          {" "}
          <SearchProduct></SearchProduct>
        </Col>
      </Row>


      <Row className="section">

      <JustifiedExample></JustifiedExample>      

      </Row>
      

    </div>
  );
};

export default NewSale;
