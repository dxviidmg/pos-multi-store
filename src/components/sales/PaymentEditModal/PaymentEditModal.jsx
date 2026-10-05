import React, { useState, useEffect, useRef } from "react";
import { Grid, TextField, Radio, RadioGroup, FormControlLabel, FormLabel, Typography } from "@mui/material";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { updateSale } from "../../../api/sales";
import { showSuccess, showRequestError } from "../../../utils/alerts";
import { handlePrintTicket } from "../../../utils/print";
import { formatCurrency } from "../../../utils/currency";
import { useUser } from "../../../context/UserContext";
import { useCtrlShortcut } from "../../../hooks/useCtrlShortcut";
import { PAYMENT_METHODS, PAYMENT_METHOD_OPTIONS } from "../../../constants";
import ReferencePaymentField from "../ReferencePaymentField/ReferencePaymentField";
import PaymentSubmitPanel from "../shared/PaymentSubmitPanel";

const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };
const ACTIONS = { SETTLE: "Liquidar", PARTIAL: "Abonar" };
const SECTION_TITLE_SX = { mb: 1 };

const PaymentEditModal = ({ isOpen, sale, onClose, onUpdate }) => {
  const inputPaymentRef = useRef(null);
  const { user } = useUser();
  const printer = user?.store_printer;
  const reservation = sale || {};

  const [action, setAction] = useState(ACTIONS.SETTLE);
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);
  const remaining = reservation.total - reservation.paid;
  const isCash = paymentMethod === PAYMENT_METHODS.CASH;

  useEffect(() => {
    if (!isOpen) return undefined;
    setAction(ACTIONS.SETTLE);
    setPayment(INITIAL_PAYMENT_STATE);
    setReferencePayment("");
    setPaymentMethod(PAYMENT_METHODS.CASH);
    const timer = setTimeout(() => inputPaymentRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleCreatePayment = async (printTicket = false) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      const reservation_in_progress = action === ACTIONS.PARTIAL;
      const data = {
        id: reservation.id,
        payment: {
          payment_method: paymentMethod,
          sale_id: reservation.id,
          amount: payment.paidWith - payment.change,
          // El backend crea el Payment directo con este objeto (campo `reference` del modelo)
          ...(!isCash && { reference: referencePayment }),
        },
        reservation_in_progress,
      };

      const response = await updateSale(data);

      setPaymentMethod(PAYMENT_METHODS.CASH);
      setReferencePayment("");
      onClose();
      setPayment(INITIAL_PAYMENT_STATE);

      if (reservation_in_progress) {
        onUpdate(response.data);
        showSuccess("Abono registrado");
      } else {
        showSuccess("Apartado liquidado");
        onUpdate({ ...response.data, delete: true });
      }

      if (printer && printTicket) {
        handlePrintTicket("ticket", response.data);
      }
    } catch (error) {
      showRequestError("registrar el abono", error);
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  const handlePaidWithChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value)) {
      setPayment(INITIAL_PAYMENT_STATE);
      return;
    }
    // En abono, máximo remaining - 1
    if (action === ACTIONS.PARTIAL) {
      value = Math.min(value, Math.floor(remaining) - 1);
    }
    setPayment({ paidWith: value, change: Math.max(0, value - remaining) });
  };

  const isSubmitDisabled =
    action === ACTIONS.PARTIAL
      ? payment.paidWith < 1 || payment.paidWith >= remaining
      : payment.paidWith < remaining || (!isCash && referencePayment === "");

  // Ctrl+G cobra con ticket y Ctrl+F sin ticket; respetan la misma validación que el botón
  useCtrlShortcut(
    ["g", "f"],
    (_event, key) => {
      if (isSubmitDisabled) return;
      handleCreatePayment(key === "g" ? !!printer : false);
    },
    { enabled: isOpen }
  );

  return (
    <>
      <CustomSpinner isLoading={isLoading} />
      <CustomModal showOut={isOpen} onClose={onClose} title="Cobrar apartado">
        <ModalBody>
          <Grid container>
            <Grid item xs={12} className="card" sx={{ marginBottom: "1rem" }}>
              <Typography variant="h2" sx={SECTION_TITLE_SX}>Información</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField size="small" fullWidth label="Folio" type="number" value={reservation.id || ""} disabled InputProps={{ startAdornment: "#" }} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField size="small" fullWidth label="Total de la compra" value={formatCurrency(reservation.total)} disabled />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField size="small" fullWidth label="Pagado" value={formatCurrency(reservation.paid)} disabled />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField size="small" fullWidth label="Deuda" value={formatCurrency(remaining)} disabled />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} className="card" sx={{ marginBottom: "1rem" }}>
              <Typography variant="h2" sx={SECTION_TITLE_SX}>Totales</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Pago con"
                    type="text"
                    value={payment.paidWith}
                    onChange={handlePaidWithChange}
                    inputRef={inputPaymentRef}
                    InputProps={{ startAdornment: "$" }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  {isCash ? (
                    <TextField fullWidth size="small" label="Cambio" value={formatCurrency(payment.change)} disabled />
                  ) : (
                    <ReferencePaymentField value={referencePayment} onChange={setReferencePayment} />
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} className="card">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormLabel>Acción:</FormLabel>
                  <RadioGroup value={action} onChange={(e) => setAction(e.target.value)} name="action">
                    {Object.values(ACTIONS).map((value) => (
                      <FormControlLabel key={value} value={value} control={<Radio size="small" />} label={value} />
                    ))}
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormLabel>Medio de pago:</FormLabel>
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} name="paymentMethod">
                    {PAYMENT_METHOD_OPTIONS.map(({ value, label }) => (
                      <FormControlLabel key={value} value={value} control={<Radio size="small" />} label={label} />
                    ))}
                  </RadioGroup>
                </Grid>

                <Grid item xs={12} md={4}>
                  <PaymentSubmitPanel printer={printer} disabled={isSubmitDisabled} onSubmit={() => handleCreatePayment(!!printer)}>
                    Cobrar (Ctrl + G)
                  </PaymentSubmitPanel>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ModalBody>
      </CustomModal>
    </>
  );
};

export default PaymentEditModal;
