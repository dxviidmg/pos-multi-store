import React, { useMemo, useState, useEffect, useRef } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { cleanCart, removeClientfromCart } from "../redux/cart/cartActions";
import { createSale } from "../apis/sales";
import { hidePaymentModal } from "../redux/paymentModal/PaymentModalActions";
import Swal from "sweetalert2";
import { getUserData } from "../apis/utils";
import { handlePrintTicket } from "../utils/utils";

function roundUpCustom(value) {
  const intPart = Math.floor(value); // Parte entera
  const decimalPart = value - intPart; // Parte decimal

  if (decimalPart === 0) return value; // Si es entero, se queda igual
  if (decimalPart <= 0.5) return intPart + 0.5; // Si es hasta 0.5, sube a 0.5
  return Math.ceil(value); // Si es mayor a 0.5, sube al siguiente entero
}

const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };
const INITIAL_SALE_EXCHANGE_STATE = { refunded: 0, payment: 0 };

const PaymentModal2 = () => {
  const inputPaymentRef = useRef(null);
  const { showPaymentReservationModal, reservation } = useSelector(
    (state) => state.PaymentModal2Reducer
  );

  console.log("showPaymentModal22", showPaymentReservationModal, reservation);
  //  const sale = useSelector((state) => state.saleReduce.sale);
  const movementType = useSelector((state) => state.cartReducer.movementType);

  const [action, setAction] = useState("Liquidar");

  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [saleExchange, setSaleExchange] = useState(INITIAL_SALE_EXCHANGE_STATE);

  const [paymentMethod, setPaymentMethod] = useState("EF");
  const urlPrinter = getUserData().store_url_printer;

  const dispatch = useDispatch();

  useEffect(() => {
    if (showPaymentReservationModal) {
      setTimeout(() => {
        inputPaymentRef.current?.focus();
      }, 100); // Pequeño retraso para permitir el renderizado
    }
  }, [showPaymentReservationModal]);

  const { total, totalDiscount } = useMemo(() => {
    const total = 100;

    const totalDiscount = 100;

    return { total, totalDiscount };
  }, [reservation]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
        handleCreateSale();
      } else if (event.ctrlKey && event.key === "g") {
        event.preventDefault();
        handleCreateSale(true);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [totalDiscount, paymentMethod, reservation, payment]);

  const handleChangePayments = (e) => {
    const { name, value } = e.target;
  };

  const totalPaymentInput = (0 * 100) / 100;

  const handleCreateSale = async (printTicket = false) => {};

  const handlePaidWithChange = async (e) => {
    let value = Number(e.target.value);
    console.log("** handlePaidWithChange");
    console.log("***", movementType);
    setPayment({
      paidWith: value,
      change: value + reservation.paid - reservation.total
    });
  };

  const handleDisableButton = () => {
    if (movementType === "apartado") {
      return false;
    }
    return false;
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
                <div className="me-3" style={{ flex: "1" }}>
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
            <Form.Control type="number" value={reservation.total - reservation.paid} disabled />
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
              fullWidth={true}
              onClick={(e) => handleCreateSale(true)}
            >
              Pagar con ticket
               (Ctrl + G)
            </CustomButton>
          </Col>

          <Col md={6}>
            <CustomButton
              disabled={handleDisableButton()}
              fullWidth={true}
              onClick={(e) => handleCreateSale()}
            >
              Pagar sin ticket
              
              (Ctrl + F)
            </CustomButton>

          </Col>
        </Row>
      </div>
    </CustomModal>
  );
};

export default PaymentModal2;
