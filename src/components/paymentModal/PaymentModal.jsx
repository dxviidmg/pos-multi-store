import React, { useMemo, useState, useEffect, useRef } from "react";
import CustomModal from "../commons/customModal/customModal";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { cleanCart, removeClientfromCart } from "../redux/cart/cartActions";
import { createSale, getSale } from "../apis/sales";
import { hidePaymentModal } from "../redux/paymentModal/PaymentModalActions";
import { showSuccess, showError } from "../utils/alerts";
import { getUserData } from "../apis/utils";
import { handlePrintTicket } from "../utils/utils";
import SearchClient from "../searchClient/SearchClient";
import ClientSelected from "../clientSelected/ClientSelected";
import SearchIcon from "@mui/icons-material/Search";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { Grid, TextField, Radio, RadioGroup, FormControlLabel, Checkbox, FormLabel } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ReceiptIcon from "@mui/icons-material/Receipt";

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

  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && event.key === "g") {
        event.preventDefault();
        handleCreateSale();
      }
      if (event.ctrlKey && event.key === "h") {
        event.preventDefault();
        handleCreateSale(true);
      }
    };
  
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [payment]); // 👈 SOLO UNA VEZ


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
    if (isSubmittingRef.current) return; // 🔒 lock inmediato
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      console.log(payment)
      if (
        movementType === "venta" &&
        (payment.paidWith === 0 || payment.change < 0)
      ) {
        showError("Error al finalizar la venta", "Pago debe igual o mayor a la cantidad a cobrar");
        return;
      }

      const paymentList = convertPaymentMethodsToList();

      const data = {
        client: client?.id,
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
          handlePrintTicket("ticket", {
            ...data,
            id: response.data.id,
            payment,
          });
        }

        dispatch(removeClientfromCart());
        dispatch(cleanCart());
        dispatch(hidePaymentModal());
        setPayment(INITIAL_PAYMENT_STATE);
        setHideClient(true);
        setSaleExchange(INITIAL_SALE_EXCHANGE_STATE);

        showSuccess("Venta exitosa. Folio " + response.data.id, "", 3000);
      } else {
        throw new Error("Sale error");
      }
    } catch (error) {
      showError("Error al finalizar la venta", "Por favor llame a soporte técnico");
    } finally {
      isSubmittingRef.current = false; // 🔓 libera lock
      setIsLoading(false);
    }
  };

  const handlePaidWithChange = (e) => {
    let value = Number(e.target.value);

    if (isNaN(value)) {
      setPayment({
        paidWith: 0,
        change: 0,
      });
  } else {
    setPayment({
      paidWith: value,
      change: value + saleExchange.refunded - totalDiscount,
    });
  }
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
      <CustomSpinner isLoading={isLoading}></CustomSpinner>
      <CustomModal 
        showOut={showPaymentModal} 
        onClose={() => dispatch(hidePaymentModal())}
        title="Finalizar venta"
      >
        <div>
          <Grid container className="custom-section">
            <Grid item xs={12} md={6}>
              <CustomButton
                fullWidth
                onClick={(e) => setHideClient((prevState) => !prevState)}
                startIcon={<PersonAddIcon />}
              >
                Añadir cliente
              </CustomButton>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomButton
                fullWidth
                onClick={(e) => setHideExchange((prevState) => !prevState)}
                startIcon={<SwapHorizIcon />}
              >
                Intercambio de mercancia
              </CustomButton>
            </Grid>
          </Grid>
        </div>
        <Grid className="custom-section" hidden={hideClient}>
          <SearchClient />
          <ClientSelected />
        </Grid>

        <Grid className="custom-section" hidden={hideExchange}>
          <h2>Cambio de mercancia</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="# Venta"
                type="number"
                value={saleExchange.id}
                onChange={(e) =>
                  setSaleExchange({
                    ...saleExchange,
                    id: Number(e.target.value),
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={3} className="d-flex flex-column justify-content-end">
              <CustomButton fullWidth onClick={handleSearchSaleForChange}>
                <SearchIcon /> Buscar
              </CustomButton>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="$ de devolución"
                type="number"
                value={saleExchange.refunded}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Cobrar"
                type="number"
                value={saleExchange.payment}
                disabled
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid className="custom-section">
          <h2>Totales</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Total"
                type="number"
                value={total.toFixed(2)}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Total con descuento"
                type="number"
                value={totalDiscount.toFixed(2)}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Pago con"
                type="text"
                value={payment.paidWith}
                onChange={handlePaidWithChange}
                inputRef={inputPaymentRef}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              {paymentMethods.methods.TA > 0 ||
              paymentMethods.methods.TR > 0 ? (
                <TextField
                  fullWidth
                  size="small"
                  label="Referencia"
                  type="text"
                  value={referencePayment}
                  onChange={(e) => setReferencePayment(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  label="Cambio"
                  type="number"
                  value={payment.change}
                  disabled
                />
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid className="custom-section">
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormLabel className="me-1">Tipo de pago:</FormLabel>
              <RadioGroup
                value={paymentMethods.type}
                onChange={handleChangePayments}
                name="paymentType"
                sx={{ gap: 0 }}
              >
                <FormControlLabel value="radio" control={<Radio size="small" />} label="Único" sx={{ mb: -1 }} />
                <FormControlLabel value="checkbox" control={<Radio size="small" />} label="Mixto" sx={{ mb: -1 }} />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormLabel className="me-3">Medios de pago:</FormLabel>
              {["EF", "TA", "TR"].map((method) => (
                <div key={method} className="d-flex align-items-center" style={{ marginBottom: '4px' }}>
                  <div className="me-3" style={{ flex: "1" }}>
                    <FormControlLabel
                      sx={{ mb: 0 }}
                      control={
                        paymentMethods.type === "radio" ? (
                          <Radio
                            size="small"
                            checked={paymentMethods.methods[method] === totalDiscount}
                            onChange={handleChangePayments}
                            value={method}
                            name="paymentMethod"
                          />
                        ) : (
                          <Checkbox
                            size="small"
                            checked={
                              (movementType === "apartado" && method === "EF") ||
                              paymentMethods.methods[method] > 0
                            }
                            onChange={handleChangePayments}
                            value={method}
                            name="paymentMethod"
                          />
                        )
                      }
                      label={
                        method === "EF"
                          ? "Efectivo"
                          : method === "TA"
                          ? "Tarjeta"
                          : "Transferencia"
                      }
                    />
                  </div>
                  {paymentMethods.type === "checkbox" &&
                    paymentMethods.methods[method] > 0 && (
                      <TextField
                        size="small"
                        type="number"
                        placeholder="$"
                        style={{ width: "120px" }}
                        onChange={(e) =>
                          handlePaymentValueChange(method, e.target.value)
                        }
                      />
                    )}
                </div>
              ))}
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton
                disabled={handleDisableButton()}
                fullWidth={true}
                onClick={(e) => handleCreateSale()}
                startIcon={<MoneyOffIcon />}
              >
                Cobrar sin ticket
                <br />
                (Ctrl + G)
              </CustomButton>

              <CustomButton
                disabled={handleDisableButton()}
                fullWidth={true}
                onClick={(e) => handleCreateSale(true)}
                startIcon={<ReceiptIcon />}
              >
                Cobrar con ticket
                <br /> (Ctrl + H)
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default PaymentModal;
