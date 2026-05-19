import { logger } from "../../../utils/logger";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCart, selectMovementType, selectClient } from "../../../redux/cart/selectors";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { cleanCart, removeClientfromCart } from "../../../redux/cart/cartActions";
import { createSale, getSale } from "../../../api/sales";
import { showSuccess, showError } from "../../../utils/alerts";
import { getUserData } from "../../../api/utils";
import { handlePrintTicket } from "../../../utils/utils";
import SearchClient from "../../clients/SearchClient/SearchClient";
import ClientSelected from "../../clients/ClientSelected/ClientSelected";
import SearchIcon from "@mui/icons-material/Search";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Grid, TextField, Radio, RadioGroup, FormControlLabel, Checkbox, FormLabel, Alert } from "@mui/material";
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

const PaymentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const inputPaymentRef = useRef(null);
  const cart = useSelector(selectCart);
  const movementType = useSelector(selectMovementType);
  const client = useSelector(selectClient);
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [hideClient, setHideClient] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [hideExchange, setHideExchange] = useState(true);
  const [saleExchange, setSaleExchange] = useState(INITIAL_SALE_EXCHANGE_STATE);

  const [paymentMethods, setPaymentMethods] = useState({
    type: "radio", // Tipo de pago inicial.
    methods: { EF: 0, TA: 0, TR: 0 }, // Valores iniciales de los métodos de pago.
  });
  const printer = getUserData().store_printer;

  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputPaymentRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const { total, totalDiscount } = useMemo(() => {
    const total = roundUpCustom(
      cart.reduce((acc, item) => acc + item.product_price * item.quantity, 0)
    );

    const totalDiscount = client?.discount_percentage_complement
      ? roundUpCustom(total * (client.discount_percentage_complement / 100))
      : total;

    return { total, totalDiscount };
  }, [cart, client]);

  const handleCreateSaleRef = useRef(null);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && event.key === "g") {
        event.preventDefault();
        handleCreateSaleRef.current?.(!!printer);
      }
    };
  
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [printer]);


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
              [value]: paymentMethods.methods[value] ? 0 : 0.01,
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
      logger.log(payment)
      if (
        movementType === "venta" &&
        (payment.paidWith === 0 || payment.change < 0)
      ) {
        setErrorMessage("Pago debe ser igual o mayor a la cantidad a cobrar");
        setIsLoading(false);
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
        onClose();
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

  handleCreateSaleRef.current = handleCreateSale;

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
        showOut={isOpen} 
        onClose={onClose}
        title="Finalizar venta"
      >
        <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
          {errorMessage && (
            <Grid item xs={12} sx={{ marginBottom: '1rem' }}>
              <Alert severity="error" variant="filled" onClose={() => setErrorMessage("")}>
                {errorMessage}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12} className="card" sx={{ marginBottom: '1rem' }}>
            <Grid container spacing={2}>
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
          </Grid>

          <Grid item xs={12} className="card" hidden={hideClient} sx={{ marginBottom: '1.5rem' }}>
            <SearchClient />
            <ClientSelected />
          </Grid>

          <Grid item xs={12} className="card" hidden={hideExchange} sx={{ marginBottom: '1.5rem' }}>
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

              <Grid item xs={12} md={3}>
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

          <Grid item xs={12} className="card" sx={{ marginBottom: '1rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Totales</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Total"
                  type="number"
                  value={total.toFixed(2)}
                  disabled
                  InputProps={{ startAdornment: '$' }}
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
                  InputProps={{ startAdornment: '$' }}
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
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                {paymentMethods.methods.TA > 0 ||
                paymentMethods.methods.TR > 0 ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Referencia de pago"
                    type="text"
                    color={referencePayment === "" ? "error" : "primary"}
                    focused={referencePayment === ""}
                    value={referencePayment}
                    onChange={(e) => setReferencePayment(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      animation: 'fadeIn 0.3s ease',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateX(-8px)' },
                        to: { opacity: 1, transform: 'translateX(0)' },
                      },
                      ...(referencePayment === "" && {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
                          '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.87)' },
                          '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
                        },
                      }),
                    }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    label="Cambio"
                    type="number"
                    value={payment.change}
                    disabled
                    InputProps={{ startAdornment: '$' }}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className="card">
            <Grid container spacing={2}>
              <Grid item xs={12} md={paymentMethods.type === "checkbox" ? 3 : 4}>
                <FormLabel>Tipo de pago:</FormLabel>
                <RadioGroup
                  value={paymentMethods.type}
                  onChange={handleChangePayments}
                  name="paymentType"
                >
                  <FormControlLabel value="radio" control={<Radio size="small" />} label="Único" />
                  <FormControlLabel value="checkbox" control={<Radio size="small" />} label="Mixto" />
                </RadioGroup>
              </Grid>

              <Grid item xs={12} md={paymentMethods.type === "checkbox" ? 3 : 4}>
                <FormLabel>Medios de pago:</FormLabel>
                <RadioGroup
                  value={Object.entries(paymentMethods.methods).find(([, v]) => v === totalDiscount)?.[0] || ""}
                  onChange={handleChangePayments}
                  name="paymentMethod"
                >
                  {["EF", "TA", "TR"].map((method) => (
                    <FormControlLabel
                      key={method}
                      value={method}
                      control={
                        paymentMethods.type === "radio" ? (
                          <Radio size="small" />
                        ) : (
                          <Checkbox
                            size="small"
                            checked={
                              (movementType === "apartado" && method === "EF") ||
                              paymentMethods.methods[method] > 0
                            }
                            disabled={
                              (method === "TR" && paymentMethods.methods.TA > 0) ||
                              (method === "TA" && paymentMethods.methods.TR > 0)
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
                  ))}
                </RadioGroup>
              </Grid>

              {paymentMethods.type === "checkbox" && (
                <Grid item xs={12} md={2}>
                  <FormLabel>Cantidades:</FormLabel>
                  <RadioGroup>
                  {["EF", "TA", "TR"].map((method, index) => (
                      <TextField
                        key={method}
                        size="small"
                        type="number"
                        placeholder={method === "EF" ? "Efectivo" : method === "TA" ? "Tarjeta" : "Transferencia"}
                        fullWidth
                        disabled={!paymentMethods.methods[method]}
                        onChange={(e) => handlePaymentValueChange(method, e.target.value)}
                        sx={{ mt: 1, '& .MuiInputBase-root': { height: 28 }, '& .MuiInputBase-input': { padding: '4px 8px', textAlign: 'center' }, visibility: paymentMethods.methods[method] > 0 ? 'visible' : 'hidden' }}
                      />
                  ))}
                  </RadioGroup>
                </Grid>
              )}

              <Grid item xs={12} md={4}>
                <FormLabel>Con impresión de ticket</FormLabel>
                <CustomButton
                  disabled={handleDisableButton()}
                  fullWidth
                  onClick={() => handleCreateSale(!!printer)}
                  startIcon={<MoneyOffIcon />}
                >
                  Cobrar (Ctrl + G)
                </CustomButton>
                
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default PaymentModal;
