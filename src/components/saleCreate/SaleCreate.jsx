import React from "react";
import SearchProduct from "../searchProduct/SearchProduct";
import TabCart from "../cart/TabCart";
import SearchClient from "../searchClient/SearchClient";
import ClientSelected from "../clientSelected/ClientSelected";
import { Col, Row } from "react-bootstrap";

const SaleCreate = () => {
  return (
    <div>
      <div className="custom-section">
        <Row>
          <Col>
            <SearchClient />
          </Col>
          <Col>
            <ClientSelected />
          </Col>
        </Row>
      </div>

      <div className="custom-section">
        <SearchProduct />
      </div>

      <div className="custom-section">
        <TabCart />
      </div>
    </div>
  );
};

export default SaleCreate;
