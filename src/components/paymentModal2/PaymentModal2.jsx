import React, { useState, useEffect, useRef } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";

const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };

const PaymentModal2 = () => {
  const inputPaymentRef = useRef(null);
  const { showPaymentReservationModal, reservation } = useSelector(
    (state) => state.PaymentModal2Reducer
  );

  const [action, setAction] = useState("Liquidar");
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("EF");

  const remaining = reservation.total - reservation.paid;

  useEffect(() => {
    if (showPaymentReservationModal) {
      setTimeout(() => inputPaymentRef.current?.focus(), 100);
    }
  }, [showPaymentReservationModal]);

  const handleCreatePayment = async (printTicket = false) => {
    const data = {
      sale: reservation.id,
      payment: payment.paidWith - payment.change,
      paymentMethod,
      action,
    };
    console.log(data);
    // Aquí va el dispatch o lógica para enviar el pago
  };

  const handlePaidWithChange = (e) => {
    const value = Number(e.target.value) || 0;
    setPayment({
      paidWith: value,
      change: Math.max(0, value + reservation.paid - reservation.total),
    });
  };

  const handleDisableButton = () => {
    if (action !== "Liquidar") {
      return payment.paidWith === 0 || payment.paidWith >= remaining;
    }
    return payment.paidWith < remaining;
  };

  return (
    <CustomModal showOut={showPaymentReservationModal} title="Pagar apartado">
      <div className="custom-section">
        <Row>
          <h2>Información</h2>
          <Col md={3}>
            <Form.Label>Folio</Form.Label>
            <Form.Control type="number" value={reservation.id} disabled />
          </Col>

          <Col md={3}>
            <Form.Label>Total de la compra</Form.Label>
            <Form.Control type="number" value={reservation.total} disabled />
          </Col>

          <Col md={3}>
            <Form.Label className="me-1">Acción:</Form.Label>
            {["Liquidar", "Abonar"].map((option) => (
              <Form.Check
                key={option}
                id={option}
                label={option}
                type="radio"
                onChange={() => setAction(option)}
                value={option}
                name="action"
                checked={action === option}
              />
            ))}
          </Col>

          <Col md={3}>
            <Form.Label className="me-3">Medios de pago:</Form.Label>
            {["EF", "TA", "TR"].map((method) => (
              <div key={method} className="d-flex align-items-center mb-1">
                <div className="me-3" style={{ flex: 1 }}>
                  <Form.Check
                    id={method}
                    label={
                      method === "EF"
                        ? "Efectivo"
                        : method === "TA"
                        ? "Tarjeta"
                        : "Transferencia"
                    }
                    type="radio"
                    onChange={() => setPaymentMethod(method)}
                    value={method}
                    name="paymentMethod"
                    checked={paymentMethod === method}
                  />
                </div>
              </div>
            ))}
          </Col>
        </Row>
      </div>

      <div className="custom-section">
        <h2>Totales</h2>
        <Row>
          <Col md={3}>
            <Form.Label>Pagado</Form.Label>
            <Form.Control type="number" value={reservation.paid} disabled />
          </Col>

          <Col md={3}>
            <Form.Label>Deuda</Form.Label>
            <Form.Control type="number" value={remaining} disabled />
          </Col>

          <Col md={3}>
            <Form.Label>Pago con</Form.Label>
            <Form.Control
              type="text"
              value={payment.paidWith}
              onChange={handlePaidWithChange}
              ref={inputPaymentRef}
            />
          </Col>

          <Col md={3}>
            {paymentMethod !== "EF" ? (
              <>
                <Form.Label>Referencia</Form.Label>
                <Form.Control
                  type="text"
                  value={referencePayment}
                  onChange={(e) => setReferencePayment(e.target.value)}
                />
              </>
            ) : (
              <>
                <Form.Label>Cambio</Form.Label>
                <Form.Control type="number" value={payment.change} disabled />
              </>
            )}
          </Col>
        </Row>
      </div>

      <div className="custom-section">
        <Row>
          <Col md={6}>
            <CustomButton
              disabled={handleDisableButton()}
              fullWidth
              onClick={() => handleCreatePayment(true)}
            >
              Pagar con ticket (Ctrl + G)
            </CustomButton>
          </Col>
          <Col md={6}>
            <CustomButton
              disabled={handleDisableButton()}
              fullWidth
              onClick={() => handleCreatePayment()}
            >
              Pagar sin ticket (Ctrl + F)
            </CustomButton>
          </Col>
        </Row>
      </div>
    </CustomModal>
  );
};

export default PaymentModal2;
