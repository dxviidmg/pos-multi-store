import React, { useMemo, useState, useEffect } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ClientSelected from "../clientSelected/ClientSelected";
import SearchClient from "../searchClient/SearchClient";
import CustomButton from "../commons/customButton/CustomButton";
import { cleanCart, removeClientfromCart } from "../redux/cart/cartActions";
import { createSale } from "../apis/sales";
import { hidePaymentModal } from "../redux/paymentModal/PaymentModalActions";
import Swal from "sweetalert2";

function roundToClosestHalfOrWhole(number) {
  return Math.round(number * 2) / 2;
}

const PaymentModal = () => {
  const { showPaymentModal } = useSelector(
    (state) => state.PaymentModalReducer
  );
  const cart = useSelector((state) => state.cartReducer.cart);
  const client = useSelector((state) => state.cartReducer.client);

  const [paymentMethods, setPaymentMethods] = useState({
    type: "radio", // Tipo de pago inicial.
    methods: { EF: 0, TA: 0, TR: 0 }, // Valores iniciales de los métodos de pago.
  });

  const dispatch = useDispatch();

  const { total, totalDiscount } = useMemo(() => {
    const total = roundToClosestHalfOrWhole(
      cart.reduce((acc, item) => acc + item.product_price * item.quantity, 0)
    );

    const totalDiscount = client?.discount_percentage_complement
      ? roundToClosestHalfOrWhole(
          total * (client.discount_percentage_complement / 100)
        )
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
  }, [totalDiscount, paymentMethods, cart, client]);

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
    } else {
      const updatedMethods =
        paymentMethods.type === "radio"
          ? { [value]: totalDiscount }
          : {
              ...paymentMethods.methods,
              [value]: paymentMethods.methods[value] ? 0 : totalDiscount,
            };

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
    const paymentList = convertPaymentMethodsToList();

    const data = {
      client: client.id,
      total: totalDiscount,
      store_products: cart.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        price: product.product_price,
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

  return (
    <CustomModal showOut={showPaymentModal} title="Finalizar pago">
      <div className="section2">
          <SearchClient />
          <ClientSelected />
      </div>

      <div className="section2">
      <Row>
        <Col md={6}>
          <Form.Label>Total</Form.Label>
          <Form.Control type="text" value={total.toFixed(2)} disabled />
        </Col>

        <Col md={6}>
          <Form.Label>Total con descuento</Form.Label>
          <Form.Control type="text" value={totalDiscount.toFixed(2)} disabled />
        </Col>
      </Row>
      </div>


      <div className="section2">
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
            disabled={
              (paymentMethods.type === "checkbox" &&
                totalPaymentInput !== totalDiscount) ||
              Object.values(paymentMethods.methods).every(
                (amount) => amount === 0
              )
            }
            fullWidth={true}
            onClick={handleCreateSale}
          >
            Pagar Ctrl + D
          </CustomButton>
        </Col>
      </Row>
      </div>



    </CustomModal>
  );
};

export default PaymentModal;
