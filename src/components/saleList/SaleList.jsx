import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Col, Form, Row } from "react-bootstrap";
import { getDailyEarnings, getSales } from "../apis/sales";

const SaleList = () => {
  const [salesList, setSalesList] = useState([]);
  const [dailyEarningsSummary, setDailyEarningsSummary] = useState({});

  useEffect(() => {
    const fetchSalesData = async () => {
      const salesResponse = await getSales();
      setSalesList(salesResponse.data);

      const earningsResponse = await getDailyEarnings();
      setDailyEarningsSummary(earningsResponse.data);
    };

    fetchSalesData();
  }, []);

  const formatTimeFromDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <Row className="section">
        <Col md={2}>
          <Form.Label className="fw-bold">Corte del día</Form.Label>
        </Col>

        <Col md={2}>
          <Form.Label className="fw-bold">Total:</Form.Label> $
          {dailyEarningsSummary.total_sales_sum}
        </Col>

        {dailyEarningsSummary.payments_by_method &&
          dailyEarningsSummary.payments_by_method.map((payment, index) => (
            <Col md={2}>
              <Form.Label className="fw-bold">
                {payment.payment_method}:
              </Form.Label>{" "}
              ${payment.total_amount}
            </Col>
          ))}

        <Col md={2}>
          <Form.Label className="fw-bold">
            {dailyEarningsSummary.is_balance_matched
              ? "Las cuentas cuadran"
              : "Las cuentas NO cuadran"}
          </Form.Label>
        </Col>
      </Row>

      <Row className="section">
        <Form.Label className="fw-bold">Lista de ventas</Form.Label>

        <CustomTable
          data={salesList}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Cliente",
              selector: (row) => row.client?.full_name,
            },
            {
              name: "Hora",
              selector: (row) => formatTimeFromDate(row.created_at),
            },
            {
              name: "Total",
              selector: (row) => `$${row.total}`,
            },
          ]}
        />
      </Row>
    </>
  );
};

export default SaleList;
