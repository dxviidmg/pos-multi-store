import React, { useMemo, useState, useEffect, useRef } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { cleanCart, removeClientfromCart } from "../redux/cart/cartActions";
import { createSale, getSale } from "../apis/sales";
import { hidePaymentModal } from "../redux/paymentModal/PaymentModalActions";
import Swal from "sweetalert2";
import { getUserData } from "../apis/utils";
import { handlePrintTicket } from "../utils/utils";
import SearchClient from "../searchClient/SearchClient";
import ClientSelected from "../clientSelected/ClientSelected";
import { SearchIcon } from "../commons/icons/Icons";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";

function roundUpCustom(value) {
  const intPart = Math.floor(value); // Parte entera
  const decimalPart = value - intPart; // Parte decimal

  if (decimalPart === 0) return value; // Si es entero, se queda igual
  if (decimalPart <= 0.5) return intPart + 0.5; // Si es hasta 0.5, sube a 0.5
  return Math.ceil(value); // Si es mayor a 0.5, sube al siguiente entero
}

const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };
const INITIAL_SALE_EXCHANGE_STATE = { refunded: 0, payment: 0 };

const PaymentModal = () => {
  const inputPaymentRef = useRef(null);
  const { showPaymentModal } = useSelector(
    (state) => state.PaymentModalReducer
  );
  const cart = useSelector((state) => state.cartReducer.cart);
  const movementType = useSelector((state) => state.cartReducer.movementType);

  const client = useSelector((state) => state.cartReducer.client);
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [hideClient, setHideClient] = useState(true);

  const [hideExchange, setHideExchange] = useState(true);
  const [saleExchange, setSaleExchange] = useState(INITIAL_SALE_EXCHANGE_STATE);

  const [paymentMethods, setPaymentMethods] = useState({
    type: "radio", // Tipo de pago inicial.
    methods: { EF: 0, TA: 0, TR: 0 }, // Valores iniciales de los métodos de pago.
  });
  const printer = getUserData().store_printer;
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false)

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
  }, [totalDiscount, paymentMethods, cart, client, payment]);

  useEffect(() => {
    if (movementType === "apartado") {
      setPaymentMethods({
        type: "radio", // Por defecto, "Único".
        methods: { EF: 0, TA: 0, TR: 0 }, // Efectivo seleccionado.
      });
    } else {
      setPaymentMethods({
        type: "radio", // Por defecto, "Único".
        methods: { EF: totalDiscount, TA: 0, TR: 0 }, // Efectivo seleccionado.
      });
    }
  }, [totalDiscount, movementType]);

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
      setPayment({
        paidWith: totalDiscount - saleExchange.refunded,
        change: 0,
      });
    } else {
      const updatedMethods =
        paymentMethods.type === "radio"
          ? { [value]: totalDiscount }
          : {
              ...paymentMethods.methods,
              [value]: paymentMethods.methods[value] ? 0 : totalDiscount,
            };

      if (!("EF" in updatedMethods)) {
        const value = updatedMethods.TA || updatedMethods.TR;
        setPayment({ paidWith: value - saleExchange.refunded, change: 0 });
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

  const handleCreateSale = async (printTicket = false) => {
    if (isLoading) return; // Previene reenvío
    setIsLoading(true)
    if (
      movementType === "venta" &&
      (payment.paidWith === 0 || payment.change < 0)
    ) {
      setIsLoading(false)
      Swal.fire({
        icon: "error",
        title: "Error al finalizar la venta",
        text: "Pago con debe igual o mayor a la cantidad a cobrar",
        timer: 5000,
      });
      return;
    }
    const paymentList = convertPaymentMethodsToList();

    const data = {
      client: client.id,
      total: totalDiscount,
      store_products: cart.map((store_product) => ({
        id: store_product.id,
        quantity: store_product.quantity,
        name: store_product.product.name,
        code: store_product.product.code,
        price:
          store_product.product_price *
          ((client?.discount_percentage_complement ?? 100) * 0.01),
      })),
      payments: paymentList,
      reference_payment: referencePayment,
      sale_exchange: saleExchange,
      reservation_in_progress: movementType === "apartado",
    };

    const response = await createSale(data);

    if (response.status === 201) {
      if (printer && printTicket) {
        data.id = response.data.id
        data.payment = payment
        handlePrintTicket("ticket", data);
      }
      setPaymentMethods({
        type: "radio",
        methods: { EF: 0, TA: 0, TR: 0 },
      });
      setReferencePayment("");
      dispatch(removeClientfromCart());
      dispatch(cleanCart());
      dispatch(hidePaymentModal());
      setPayment(INITIAL_PAYMENT_STATE);
      setHideClient(true);
      setSaleExchange(INITIAL_SALE_EXCHANGE_STATE);
      setTimeout(() => {
        setIsLoading(false)
      }, 164);
      Swal.fire({
        icon: "success",
        title: "Venta exitosa",
        timer: 5000,
      });
    } else {
      setTimeout(() => {
        setIsLoading(false)
      }, 164);
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
    setPayment({
      paidWith: value,
      change: value + saleExchange.refunded - totalDiscount,
    });
    if (movementType === "apartado") {
      setPaymentMethods({
        type: "radio",
        methods: { EF: value, TA: 0, TR: 0 },
      });
    }
  };

  const handleSearchSaleForChange = async () => {
    const response = await getSale(saleExchange.id);
    setSaleExchange({
      ...response.data,
      payment: totalDiscount - response.data.refunded,
    });
  };

  const handleDisableButton = () => {
    if (movementType === "apartado") {
      return false;
    }
    return (
      (paymentMethods.type === "checkbox" &&
        totalPaymentInput !== totalDiscount) ||
      Object.values(paymentMethods.methods).every((amount) => amount === 0) ||
      (paymentMethods.type === "radio" &&
        paymentMethods.methods.EF > payment.paidWith + saleExchange.refunded) ||
      (paymentMethods.methods.TA > 0 && referencePayment === "") ||
      (paymentMethods.methods.TR > 0 && referencePayment === "")
    );
  };

  return (
    <>
    <CustomSpinner2 isLoading={isLoading}></CustomSpinner2>
    <CustomModal showOut={showPaymentModal} title="Finalizar venta">
      <div className="custom-section-buttons">
        <Row>
          <Col md={6}>
            {" "}
            <CustomButton
              fullWidth
              onClick={(e) => setHideClient((prevState) => !prevState)}
            >
              Añadir cliente
            </CustomButton>
          </Col>

          <Col md={6}>
            {" "}
            <CustomButton
              fullWidth
              onClick={(e) => setHideExchange((prevState) => !prevState)}
            >
              Intercambio de mercancia
            </CustomButton>
          </Col>
        </Row>
      </div>
      <div className="custom-section" hidden={hideClient}>
        <SearchClient />
        <ClientSelected />
      </div>

      <div className="custom-section" hidden={hideExchange}>
        <h2>Cambio de mercancia</h2>
        <Row>
          <Col md={3}>
            <Form.Label># Venta</Form.Label>
            <Form.Control
              type="number"
              value={saleExchange.id}
              onChange={(e) =>
                setSaleExchange({ ...saleExchange, id: Number(e.target.value) })
              }
            />
          </Col>

          <Col md={3} className="d-flex flex-column justify-content-end">
            <CustomButton fullWidth onClick={handleSearchSaleForChange}>
              <SearchIcon /> Buscar
            </CustomButton>
          </Col>

          <Col md={3}>
            <Form.Label>$ de devolución</Form.Label>
            <Form.Control
              type="number"
              value={saleExchange.refunded}
              disabled
            />
          </Col>

          <Col md={3}>
            <Form.Label>Cobrar</Form.Label>
            <Form.Control type="number" value={saleExchange.payment} disabled />
          </Col>
        </Row>
      </div>

      <div className="custom-section">
        <h2>Totales</h2>
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
            {paymentMethods.methods.TA > 0 || paymentMethods.methods.TR > 0 ? (
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
                        ? "Tarjeta"
                        : "Transferencia"
                    }
                    type={paymentMethods.type}
                    onChange={handleChangePayments}
                    value={method}
                    name="paymentMethod"
                    checked={
                      (movementType === "apartado" && method === "EF") ||
                      (paymentMethods.type === "radio"
                        ? paymentMethods.methods[method] === totalDiscount
                        : paymentMethods.methods[method] > 0)
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
              onClick={(e) => handleCreateSale()}
            >
              Cobrar sin ticket
              <br />
              (Ctrl + F)
            </CustomButton>

            <CustomButton
              disabled={handleDisableButton()}
              fullWidth={true}
              onClick={(e) => handleCreateSale(true)}
            >
              Cobrar con ticket
              <br /> (Ctrl + G)
            </CustomButton>
          </Col>
        </Row>
      </div>
    </CustomModal>
    </>
  );
};

export default PaymentModal;
