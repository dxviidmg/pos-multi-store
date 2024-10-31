import React, { useMemo, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ClientSelected from "../clientSelected/ClientSelected";
import SearchClient from "../searchClient/SearchClient";
import CustomButton from "../commons/customButton/CustomButton";
import { removeClient } from "../redux/clientSelected/clientSelectedActions";
import { cleanCart } from "../redux/cart/cartActions";
import { createSale } from "../apis/sales";
import { hidePaymentModal } from "../redux/paymentModal/PaymentModalActions";

const PaymentModal = () => {
  const { showPaymentModal } = useSelector(
    (state) => state.PaymentModalReducer
  );
  const cart = useSelector((state) => state.cartReducer.cart);
  const client = useSelector((state) => state.clientSelectedReducer.client);

  const [paymentMethods, setPaymentMethods] = useState({
    type: "radio", // 'radio' para pago único, 'checkbox' para pago mixto
    methods: { E: 0, P: 0, T: 0 }, // Valores de cada método de pago
  });

  const dispatch = useDispatch();

  // Calcular los totales con descuento y sin descuento
  const { total, totalDiscount } = useMemo(() => {
    const total = (cart.reduce(
      (acc, item) => acc + item.product_price * item.quantity,
      0 
    )) * 100 / 100;
    const totalDiscount = client?.discount?.discount_percentage_complement
      ? Math.round(
          total * (client.discount.discount_percentage_complement / 100) * 100
        ) / 100
      : total;

    return { total, totalDiscount };
  }, [cart, client]);

  // Manejar cambio en el tipo y método de pago
  const handleChangePayments = (e) => {
    const { name, value } = e.target;

    if (name === "paymentType") {
      const newMethods =
        value === "radio"
          ? { E: totalDiscount, P: 0, T: 0 }
          : { E: 0, P: 0, T: 0 }; // Efectivo por default si es único
      setPaymentMethods({
        type: value,
        methods: newMethods,
      });
    } else {
      const updatedMethods =
        paymentMethods.type === "radio"
          ? { [value]: totalDiscount } // Selección única
          : {
              ...paymentMethods.methods,
              [value]: paymentMethods.methods[value] ? 0 : totalDiscount, // Alternar selección para mixto
            };

      setPaymentMethods((prev) => ({
        ...prev,
        methods: updatedMethods,
      }));
    }
  };

  // Cambiar valor de cada método de pago en mixto
  const handlePaymentValueChange = (method, value) => {
    setPaymentMethods((prev) => ({
      ...prev,
      methods: {
        ...prev.methods,
        [method]: parseFloat(value) || 0,
      },
    }));
  };

  // Sumar todos los métodos de pago seleccionados
  const totalPaymentInput = Object.values(paymentMethods.methods).reduce(
    (acc, curr) => acc + curr,
    0
  ) * 100 / 100;

  const convertPaymentMethodsToList = () => {
    return Object.entries(paymentMethods.methods)
      .filter(([method, amount]) => amount > 0) // Filtrar solo los métodos de pago activos
      .map(([method, amount]) => ({
        payment_method: method,
        amount: amount,
      }));
  };


  // Crear venta al hacer clic en el botón de pago
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
        type: "radio", // 'radio' para pago único, 'checkbox' para pago mixto
        methods: { E: 0, P: 0, T: 0 }, // Valores de cada método de pago
      })
      dispatch(removeClient());
      dispatch(cleanCart());
      dispatch(hidePaymentModal());

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
          {["E", "P", "T"].map((method) => (
            <div key={method} className="d-flex align-items-center mb-1">
              <div className="me-3" style={{ flex: "1" }}>
                <Form.Check
                  id={method}
                  label={
                    method === "E"
                      ? "Efectivo"
                      : method === "P"
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
              ) // Verifica que todos los métodos tengan un monto de 0
            }
            fullWidth={true}
            onClick={handleCreateSale}
          >
            Pagar
          </CustomButton>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default PaymentModal;
