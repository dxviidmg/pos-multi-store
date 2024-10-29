import React, { useMemo, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ClientSelected from "../clientSelected/ClientSelected";
import SearchClient from "../searchClient/SearchClient";

const PaymentModal = () => {
  const { showPaymentModal } = useSelector(
    (state) => state.PaymentModalReducer
  );
  const cart = useSelector((state) => state.cartReducer.cart);

  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [paymentType, setPaymentType] = useState("radio");
  const [paymentMethod, setPaymentMethod] = useState("E");

  const client = useSelector((state) => state.clientSelectedReducer.client);

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

  console.log("showPaymentModal", showPaymentModal);

  const handleChangePayments = (e) => {

    const {name, value} = e.target
    console.log('name and value', name, value)
    if (name === "paymentType"){
      console.log('cambiando paymenttype')
      setPaymentType(value)
    }
    else{
      console.log('no se que hago aqui', paymentType)


      if(paymentType==="radio"){
        setPaymentMethod(value)
      }
      else{
        console.log('else checkbox')
        if (value in paymentMethod){
          console.log('jalo')
        }
        else{
          console.log('jalo 2')
        }
      }
    }

  };

  return (
    <CustomModal showOut={showPaymentModal} title="Finalizar pago">
      <Row className="section">
        <Col md={12}>
          {" "}
          <SearchClient></SearchClient>
        </Col>
        <Col md={12}>
          {" "}
          <ClientSelected></ClientSelected>
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
            onChange={(e) => handleChangePayments(e)}
            value="radio"
            name="paymentType"
            checked={paymentType === "radio"}
          />
          <Form.Check
            id="mixed"
            label="Mixto"
            type="radio"
            onChange={(e) => handleChangePayments(e)}
            value="checkbox"
            name="paymentType"
            checked={paymentType === "checkbox"}
          />
        </Col>

        <Col md={6}>
          <Form.Label className="me-3">Medios de pago:</Form.Label>

          <Form.Group className="d-flex align-items-center mb-2">
            <Form.Check
              id="E"
              label="Efectivo"
              type={paymentType}
              onChange={(e) => handleChangePayments(e)}
              value="E"
              name="paymentMethod"
              checked={
                paymentType === "radio" ? paymentMethod === "E" : undefined
              }
            />
            {paymentType === "checkbox" && paymentMethod === "E" && (
              <Form.Control
                type="number"
                placeholder="Cantidad"
                //      onChange={(e) => setCashAmount(e.target.value)}
                className="ms-2"
              />
            )}
          </Form.Group>



          <Form.Group className="d-flex align-items-center mb-2">
            <Form.Check
              id="P"
              label="Pago con tarjeta"
              type={paymentType}
              onChange={(e) => handleChangePayments(e)}
              value="P"
              checked={
                paymentType === "radio" ? paymentMethod === "P" : undefined
              }
                            name="paymentMethod"
            />
            {paymentType === "checkbox" && paymentMethod === "P" && (
              <Form.Control
                type="number"
                placeholder="Cantidad"
                //      onChange={(e) => setCashAmount(e.target.value)}
                className="ms-2"
              />
            )}
          </Form.Group>



          <Form.Group className="d-flex align-items-center mb-2">
            <Form.Check
              id="T"
              label="Transferencia"
              type={paymentType}
              onChange={(e) => handleChangePayments(e)}
              value="T"
              checked={
                paymentType === "radio" ? paymentMethod === "T" : undefined
              }
                            name="paymentMethod"
            />
            {paymentType === "checkbox" && paymentMethod === "T" && (
              <Form.Control
                type="number"
                placeholder="Cantidad"
                //      onChange={(e) => setCashAmount(e.target.value)}
                className="ms-2"
              />
            )}
          </Form.Group>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default PaymentModal;
