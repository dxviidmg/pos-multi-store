import React, { useState, useEffect, useRef } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { updateSale } from "../../../api/sales";
import { showSuccess, showError } from "../../../utils/alerts";
import { handlePrintTicket } from "../../../utils/utils";
import { useUser } from "../../../context/UserContext";
import { usePrinterStatus } from "../../../hooks/usePrinterStatus";
import { Grid, TextField, Radio, RadioGroup, FormControlLabel, FormLabel, Chip, Box } from "@mui/material";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import { CustomSpinner } from "../../ui/Spinner/Spinner";

const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };

const PaymentEditModal = ({ isOpen, sale, onClose, onUpdate }) => {
  const inputPaymentRef = useRef(null);
  const { user } = useUser();
  const reservation = sale || {};

  const [action, setAction] = useState("Liquidar");
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("EF");
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);
  const remaining = reservation.total - reservation.paid;

  const printer = user?.store_printer;
  const { connected: printerConnected, error: printerError } = usePrinterStatus(printer, { triggerDep: isOpen });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputPaymentRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setAction("Liquidar");
      setPayment(INITIAL_PAYMENT_STATE);
      setReferencePayment("");
      setPaymentMethod("EF");
    }
  }, [isOpen]);

  const handleCreatePayment = async (printTicket = false) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
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
        } else {
          showSuccess("Liquidación exitosa");
          onUpdate({ ...response.data, delete: true });
        }

        if (printer && printTicket) {
          handlePrintTicket("ticket", response.data);
        }
      } else {
        showError("Error al añadir un pago de apartado", "Por favor llame a soporte técnico");
      }
    } catch (error) {
      showError("Error al añadir un pago de apartado", "Por favor llame a soporte técnico");
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && event.key === "g") {
        event.preventDefault();
        if (isOpen && !handleDisableButton()) {
          handleCreatePayment(!!printer);
        }
      }
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
        if (isOpen && !handleDisableButton()) {
          handleCreatePayment(false);
        }
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [isOpen, printer, payment, action, paymentMethod, remaining]);

  const handlePaidWithChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value)) {
      setPayment({ paidWith: 0, change: 0 });
      return;
    }
    // En abono, máximo remaining - 1
    if (action === "Abonar") {
      const maxAbono = Math.floor(remaining) - 1;
      value = Math.min(value, maxAbono);
    }
    setPayment({
      paidWith: value,
      change: Math.max(0, value - remaining),
    });
  };

  const handleDisableButton = () => {
    if (action === "Abonar") {
      return payment.paidWith < 1 || payment.paidWith >= remaining;
    }
    // Liquidar
    if (paymentMethod !== "EF") {
      return payment.paidWith < remaining || referencePayment === "";
    }
    return payment.paidWith < remaining;
  };

  return (
    <>
      <CustomSpinner isLoading={isLoading} />
      <CustomModal
        showOut={isOpen}
        onClose={onClose}
        title="Cobrar apartado"
      >
        <Grid container sx={{ padding: '1rem', backgroundColor: 'modalBody.main' }}>
          {/* Información del apartado */}
          <Grid item xs={12} className="card" sx={{ marginBottom: '1rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Información</h2>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="Folio" type="number" value={reservation.id || ""} disabled InputProps={{ startAdornment: '#' }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="Total de la compra" type="number" value={reservation.total || ""} disabled InputProps={{ startAdornment: '$' }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="Pagado" type="number" value={reservation.paid || ""} disabled InputProps={{ startAdornment: '$' }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="Deuda" type="number" value={remaining || ""} disabled InputProps={{ startAdornment: '$' }} />
              </Grid>
            </Grid>
          </Grid>

          {/* Totales y pago */}
          <Grid item xs={12} className="card" sx={{ marginBottom: '1rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Totales</h2>
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
                  InputProps={{ startAdornment: '$' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                {paymentMethod !== "EF" ? (
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
                  <TextField fullWidth size="small" label="Cambio" type="number" value={payment.change} disabled InputProps={{ startAdornment: '$' }} />
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Método de pago y acción */}
          <Grid item xs={12} className="card">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormLabel>Acción:</FormLabel>
                <RadioGroup
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  name="action"
                >
                  <FormControlLabel value="Liquidar" control={<Radio size="small" />} label="Liquidar" />
                  <FormControlLabel value="Abonar" control={<Radio size="small" />} label="Abonar" />
                </RadioGroup>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormLabel>Medio de pago:</FormLabel>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  name="paymentMethod"
                >
                  <FormControlLabel value="EF" control={<Radio size="small" />} label="Efectivo" />
                  <FormControlLabel value="TA" control={<Radio size="small" />} label="Tarjeta" />
                  <FormControlLabel value="TR" control={<Radio size="small" />} label="Transferencia" />
                </RadioGroup>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormLabel sx={{ display: 'block', textAlign: 'center' }}>{printer ? 'Con impresión de ticket' : 'Sin impresión de ticket'}</FormLabel>
                <CustomButton
                  disabled={handleDisableButton()}
                  fullWidth
                  onClick={() => handleCreatePayment(!!printer)}
                  startIcon={<MoneyOffIcon />}
                  sx={{ mt: 1 }}
                >
                  Cobrar (Ctrl + G)
                </CustomButton>
                {printer && (
                  <Chip
                    label={printerError || (printerConnected ? "Impresora conectada" : "Impresora desconectada")}
                    color={printerConnected ? "success" : "error"}
                    variant="filled"
                    size="small"
                    sx={{ mt: 1, width: '100%' }}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default PaymentEditModal;
