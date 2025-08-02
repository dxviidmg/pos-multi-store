import React, { useState, useEffect, useRef } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { updateSale } from "../apis/sales";
import { hidePaymentReservationModal } from "../redux/paymentReservationModal/PaymentReservationModalActions";
import Swal from "sweetalert2";
import { handlePrintTicket } from "../utils/utils";
import { getUserData } from "../apis/utils";

const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };

const PaymentModal2 = ({ onUpdateSaleList }) => {
  const inputPaymentRef = useRef(null);
  const { showPaymentReservationModal, reservation } = useSelector(
    (state) => state.PaymentModal2Reducer
  );

  const [action, setAction] = useState("Liquidar");
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("EF");
  const remaining = reservation.total - reservation.paid;
  const dispatch = useDispatch();

  const printer = getUserData().store_printer;

  useEffect(() => {
    if (showPaymentReservationModal) {
      setTimeout(() => inputPaymentRef.current?.focus(), 100);
    }
  }, [showPaymentReservationModal]);

  const handleCreatePayment = async (printTicket = false) => {
    const reservation_in_progress = action === "Abonar";
    const data = {
      id: reservation.id,
      payment: {
        payment_method: paymentMethod,
        sale_id: reservation.id,
        amount: payment.paidWith - payment.change,
      },
      reservation_in_progress,
    };

    const response = await updateSale(data);

    if (response.status === 200) {
      setPaymentMethod("EF");
      setReferencePayment("");
      dispatch(hidePaymentReservationModal());
      setPayment(INITIAL_PAYMENT_STATE);

            if (reservation_in_progress) {
              onUpdateSaleList(response.data);

              Swal.fire({
                icon: "success",
                title: "Abono exitoso exitoso",
                timer: 5000,
              });

            } 

            
            else {

              Swal.fire({
                icon: "success",
                title: "Liquidación exitosa",
                timer: 5000,
              });
              onUpdateSaleList({ ...response.data, delete: true });
            }

            if (printer && printTicket) {
              handlePrintTicket("ticket", response.data);
            }

    } else {
      Swal.fire({
        icon: "error",
        title: "Error al añadir un pago de apartado",
        text: "Por favor llame a soporte técnico",
        timer: 5000,
      });
    }
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
