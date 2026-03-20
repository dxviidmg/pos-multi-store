import React, { useState, useEffect, useRef } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { updateSale } from "../../../api/sales";
import { showSuccess, showError } from "../../../utils/alerts";
import { handlePrintTicket } from "../../../utils/utils";
import { getUserData } from "../../../api/utils";
import { Grid, TextField, Checkbox, FormLabel, Box } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";

const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };

const PaymentEditModal = ({ isOpen, sale, onClose, onUpdate }) => {
  const inputPaymentRef = useRef(null);
  const reservation = sale || {};

  const [action, setAction] = useState("Liquidar");
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("EF");
  const remaining = reservation.total - reservation.paid;

  const printer = getUserData().store_printer;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputPaymentRef.current?.focus(), 100);
    }
  }, [isOpen]);

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
      onClose();
      setPayment(INITIAL_PAYMENT_STATE);

            if (reservation_in_progress) {
              onUpdate(response.data);

              showSuccess("Abono exitoso");

            } 

            
            else {

              showSuccess("Liquidación exitosa");
              onUpdate({ ...response.data, delete: true });
            }

            if (printer && printTicket) {
              handlePrintTicket("ticket", response.data);
            }

    } else {
      showError("Error al añadir un pago de apartado", "Por favor llame a soporte técnico");
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
    <CustomModal 
      showOut={isOpen} 
      onClose={onClose}
      title="Cobrar apartado"
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="card" sx={{ marginBottom: '1.5rem' }}>
          <Grid container spacing={2}>
            <h2>Información</h2>
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Folio" type="number" value={reservation.id} disabled />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Total de la compra" type="number" value={reservation.total} disabled />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormLabel className="me-1">Acción:</FormLabel>
              {["Liquidar", "Abonar"].map((option) => (
                <Checkbox size="small"
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
            </Grid>

            <Grid item xs={12} md={3}>
              <FormLabel sx={{ mb: 1 }}>Medios de pago:</FormLabel>
              {["EF", "TA", "TR"].map((method) => (
                <Box key={method} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <Checkbox size="small"
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
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="card" sx={{ marginBottom: '1.5rem' }}>
          <h2>Totales</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Pagado" type="number" value={reservation.paid} disabled />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Deuda" type="number" value={remaining} disabled />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Pago con" type="text"
                value={payment.paidWith}
                onChange={handlePaidWithChange}
                ref={inputPaymentRef}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              {paymentMethod !== "EF" ? (
                <>
                  <TextField size="small" fullWidth label="Referencia" type="text"
                    value={referencePayment}
                    onChange={(e) => setReferencePayment(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <TextField size="small" fullWidth label="Cambio" type="number" value={payment.change} disabled />
                </>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="card">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <CustomButton
                disabled={handleDisableButton()}
                fullWidth
                onClick={() => handleCreatePayment(true)}
                startIcon={<PaymentIcon />}
              >
                Cobrar con ticket (Ctrl + G)
              </CustomButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomButton
                disabled={handleDisableButton()}
                fullWidth
                onClick={() => handleCreatePayment()}
                startIcon={<PaymentIcon />}
              >
                Cobrar sin ticket (Ctrl + F)
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default PaymentEditModal;
