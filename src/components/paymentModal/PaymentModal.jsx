import React, { useMemo, useState, useEffect, useRef } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { cleanCart, removeClientfromCart } from "../redux/cart/cartActions";
import { createSale } from "../apis/sales";
import { hidePaymentModal } from "../redux/paymentModal/PaymentModalActions";
import Swal from "sweetalert2";

function roundUpCustom(value) {
  const intPart = Math.floor(value); // Parte entera
  const decimalPart = value - intPart; // Parte decimal

  if (decimalPart === 0) return value; // Si es entero, se queda igual
  if (decimalPart <= 0.5) return intPart + 0.5; // Si es hasta 0.5, sube a 0.5
  return Math.ceil(value); // Si es mayor a 0.5, sube al siguiente entero
}

const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };
const PaymentModal = () => {
  const inputPaymentRef = useRef(null);
  const { showPaymentModal } = useSelector(
    (state) => state.PaymentModalReducer
  );
  const cart = useSelector((state) => state.cartReducer.cart);
  const client = useSelector((state) => state.cartReducer.client);
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);

  const [paymentMethods, setPaymentMethods] = useState({
    type: "radio", // Tipo de pago inicial.
    methods: { EF: 0, TA: 0, TR: 0 }, // Valores iniciales de los métodos de pago.
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (showPaymentModal) {
      setTimeout(() => {
        inputPaymentRef.current?.focus();
      }, 100); // Pequeño retraso para permitir el renderizado
    }
  }, [showPaymentModal]);

  const { total, totalDiscount } = useMemo(() => {
    const total = roundUpCustom(
      cart.reduce((acc, item) => acc + item.product_price * item.quantity, 0)
    );

    const totalDiscount = client?.discount_percentage_complement
      ? roundUpCustom(total * (client.discount_percentage_complement / 100))
      : total;

    return { total, totalDiscount };
  }, [cart, client]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        handleCreateSale();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [totalDiscount, paymentMethods, cart, client, payment]);

  useEffect(() => {
    setPaymentMethods({
      type: "radio", // Por defecto, "Único".
      methods: { EF: totalDiscount, TA: 0, TR: 0 }, // Efectivo seleccionado.
    });
  }, [totalDiscount]);

  const handleChangePayments = (e) => {
    const { name, value } = e.target;

    if (name === "paymentType") {
      const newMethods =
        value === "radio"
          ? { EF: totalDiscount, TA: 0, TR: 0 }
          : { EF: 0, TA: 0, TR: 0 };
      setPaymentMethods({
        type: value,
        methods: newMethods,
      });
    setPayment({ paidWith: totalDiscount, change: 0 })
    } else {
      const updatedMethods =
        paymentMethods.type === "radio"
          ? { [value]: totalDiscount }
          : {
              ...paymentMethods.methods,
              [value]: paymentMethods.methods[value] ? 0 : totalDiscount,
            };
      
        if (!("EF" in updatedMethods)) {
          const value = updatedMethods.TA || updatedMethods.TR
          setPayment({ paidWith: value, change: 0 });
        }
      setPaymentMethods((prev) => ({
        ...prev,
        methods: updatedMethods,
      }));
    }
  };

  const handlePaymentValueChange = (method, value) => {
    setPaymentMethods((prev) => ({
      ...prev,
      methods: {
        ...prev.methods,
        [method]: parseFloat(value) || 0,
      },
    }));
  };

  const totalPaymentInput =
    (Object.values(paymentMethods.methods).reduce(
      (acc, curr) => acc + curr,
      0
    ) *
      100) /
    100;

  const convertPaymentMethodsToList = () => {
    return Object.entries(paymentMethods.methods)
      .filter(([method, amount]) => amount > 0)
      .map(([method, amount]) => ({
        payment_method: method,
        amount: amount,
      }));
  };

  const handleCreateSale = async () => {
    if (payment.paidWith === 0 || payment.change < 0) {
      Swal.fire({
        icon: "error",
        title: "Error al finalizar la venta",
        text: "Pago con debe igual o mayor a la cantidad a pagar",
        timer: 5000,
      });
      return;
    }
    const paymentList = convertPaymentMethodsToList();

    const data = {
      client: client.id,
      total: totalDiscount,
      store_products: cart.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        price:
          product.product_price *
          ((client?.discount_percentage_complement ?? 100) * 0.01),
      })),
      payments: paymentList,
    };

    const response = await createSale(data);

    if (response.status === 201) {
      setPaymentMethods({
        type: "radio",
        methods: { EF: 0, TA: 0, TR: 0 },
      });
      dispatch(removeClientfromCart());
      dispatch(cleanCart());
      dispatch(hidePaymentModal());
      setPayment(INITIAL_PAYMENT_STATE);

      Swal.fire({
        icon: "success",
        title: "Venta exitosa",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al finalizar la venta",
        text: "Por favor llame a soporte técnico",
        timer: 5000,
      });
    }
  };

  const handlePaidWithChange = async (e) => {
    let value = Number(e.target.value);
    setPayment({ paidWith: value, change: value - totalDiscount });
  };

  const handleDisableButton = () => {
    return (
      (paymentMethods.type === "checkbox" &&
        totalPaymentInput !== totalDiscount) ||
      Object.values(paymentMethods.methods).every((amount) => amount === 0)
    ) || (
      (paymentMethods.type === "radio" &&
        paymentMethods.methods.EF >  payment.paidWith) 

    )
  };

  return (
    <CustomModal showOut={showPaymentModal} title="Finalizar pago">
      <div className="custom-section">
        <Row>
          <Col md={3}>
            <Form.Label>Total</Form.Label>
            <Form.Control type="number" value={total.toFixed(2)} disabled />
          </Col>

          <Col md={3}>
            <Form.Label>Total con descuento</Form.Label>
            <Form.Control
              type="number"
              value={totalDiscount.toFixed(2)}
              disabled
            />
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
            <Form.Label>Cambio</Form.Label>
            <Form.Control type="number" value={payment.change} disabled />
          </Col>
        </Row>
      </div>

      <div className="custom-section">
        <Row>
          <Col md={3}>
            <Form.Label className="me-1">Tipo de pago:</Form.Label>
            <Form.Check
              id="single"
              label="Único"
              type="radio"
              onChange={handleChangePayments}
              value="radio"
              name="paymentType"
              checked={paymentMethods.type === "radio"}
            />
            <Form.Check
              id="mixed"
              label="Mixto"
              type="radio"
              onChange={handleChangePayments}
              value="checkbox"
              name="paymentType"
              checked={paymentMethods.type === "checkbox"}
            />
          </Col>

          <Col md={6}>
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
                        ? "Pago con tarjeta"
                        : "Transferencia"
                    }
                    type={paymentMethods.type}
                    onChange={handleChangePayments}
                    value={method}
                    name="paymentMethod"
                    checked={
                      paymentMethods.type === "radio"
                        ? paymentMethods.methods[method] === totalDiscount
                        : paymentMethods.methods[method] > 0
                    }
                  />
                </div>
                {paymentMethods.type === "checkbox" &&
                  paymentMethods.methods[method] > 0 && (
                    <Form.Control
                      type="number"
                      placeholder="$"
                      style={{ width: "120px", height: "calc(1.5rem + 2px)" }}
                      className="align-self-center"
                      onChange={(e) =>
                        handlePaymentValueChange(method, e.target.value)
                      }
                    />
                  )}
              </div>
            ))}
          </Col>
          <Col md={3}>
            <CustomButton
              disabled={handleDisableButton()}
              fullWidth={true}
              onClick={handleCreateSale}
            >
              Pagar (Ctrl + D)
            </CustomButton>
          </Col>
        </Row>
      </div>
    </CustomModal>
  );
};

export default PaymentModal;
