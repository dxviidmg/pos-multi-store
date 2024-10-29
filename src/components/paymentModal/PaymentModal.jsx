import React, { useMemo, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ClientSelected from "../clientSelected/ClientSelected";
import SearchClient from "../searchClient/SearchClient";

const PaymentModal = () => {
  const { showPaymentModal } = useSelector((state) => state.PaymentModalReducer);
  const cart = useSelector((state) => state.cartReducer.cart);
  const client = useSelector((state) => state.clientSelectedReducer.client);

  const [paymentType, setPaymentType] = useState("radio");
  const [paymentMethod, setPaymentMethod] = useState("E");
  const [paymentMethods, setPaymentMethods] = useState([]);

  const dispatch = useDispatch();

  // Memorizar los totales para evitar recálculo innecesario
  const { total, totalDiscount } = useMemo(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.product_price * item.quantity,
      0
    );
    const totalDiscount = client?.discount?.discount_percentage_complement
      ? total * (client.discount.discount_percentage_complement / 100)
      : total;

    return { total, totalDiscount };
  }, [cart, client]);

  const handleChangePayments = (e) => {
    const { name, value } = e.target;

    if (name === "paymentType") {
      // Si cambia a pago único, reinicia y selecciona el primer método
      if (value === "radio") {
        setPaymentMethod("E");
        setPaymentMethods([]);
      } else {
        // Si cambia a pago mixto, limpia la selección de métodos únicos
        setPaymentMethod("");
      }
      setPaymentType(value);
    } else {
      if (paymentType === "radio") {
        setPaymentMethod(value);
      } else {
        // Si es mixto, añade o quita métodos de pago seleccionados
        setPaymentMethods((prev) =>
          prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value]
        );
      }
    }
  };

  return (
    <CustomModal showOut={showPaymentModal} title="Finalizar pago">
      <Row className="section">
        <Col md={12}>
          <SearchClient />
        </Col>
        <Col md={12}>
          <ClientSelected />
        </Col>
      </Row>

      <Row className="section">
        <Col md={6}>
          <Form.Label>Total</Form.Label>
          <Form.Control type="text" value={total.toFixed(2)} disabled />
        </Col>

        <Col md={6}>
          <Form.Label>Total con descuento</Form.Label>
          <Form.Control type="text" value={totalDiscount.toFixed(2)} disabled />
        </Col>
      </Row>

      <Row className="section">
        <Col md={3}>
          <Form.Label className="me-3">Tipo de pago:</Form.Label>
          <Form.Check
            id="single"
            label="Unico"
            type="radio"
            onChange={handleChangePayments}
            value="radio"
            name="paymentType"
            checked={paymentType === "radio"}
          />
          <Form.Check
            id="mixed"
            label="Mixto"
            type="radio"
            onChange={handleChangePayments}
            value="checkbox"
            name="paymentType"
            checked={paymentType === "checkbox"}
          />
        </Col>

        <Col md={6}>
          <Form.Label className="me-3">Medios de pago:</Form.Label>

          {["E", "P", "T"].map((method) => (
            <Form.Group key={method} className="d-flex align-items-center mb-2">
              <Form.Check
                id={method}
                label={
                  method === "E" ? "Efectivo" :
                  method === "P" ? "Pago con tarjeta" :
                  "Transferencia"
                }
                type={paymentType}
                onChange={handleChangePayments}
                value={method}
                name="paymentMethod"
                checked={
                  paymentType === "radio"
                    ? paymentMethod === method
                    : paymentMethods.includes(method)
                }
              />
              {paymentType === "checkbox" && paymentMethods.includes(method) && (
                <Form.Control
                  type="number"
                  placeholder="Cantidad"
                  className="ms-2"
                />
              )}
            </Form.Group>
          ))}
        </Col>
      </Row>
    </CustomModal>
  );
};

export default PaymentModal;
