import React, { useState, useEffect, useRef } from "react";
import CustomModal from "../commons/customModal/customModal";

import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { updateSale } from "../apis/sales";
import { hidePaymentReservationModal } from "../redux/paymentReservationModal/PaymentReservationModalActions";
import { showSuccess, showError } from "../utils/alerts";
import { handlePrintTicket } from "../utils/utils";
import { getUserData } from "../apis/utils";
import { Grid, TextField, Checkbox, FormLabel } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";

const INITIAL_PAYMENT_STATE = { paidWith: 0, change: 0 };

const PaymentModal2 = ({ onUpdateSaleList }) => {
  const inputPaymentRef = useRef(null);
  const { showPaymentReservationModal, reservation } = useSelector(
    (state) => state.PaymentModal2Reducer
  );

  const [action, setAction] = useState("Liquidar");
  const [payment, setPayment] = useState(INITIAL_PAYMENT_STATE);
  const [referencePayment, setReferencePayment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("EF");
  const remaining = reservation.total - reservation.paid;
  const dispatch = useDispatch();

  const printer = getUserData().store_printer;

  useEffect(() => {
    if (showPaymentReservationModal) {
      setTimeout(() => inputPaymentRef.current?.focus(), 100);
    }
  }, [showPaymentReservationModal]);

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
      dispatch(hidePaymentReservationModal());
      setPayment(INITIAL_PAYMENT_STATE);

            if (reservation_in_progress) {
              onUpdateSaleList(response.data);

              showSuccess("Abono exitoso exitoso");

            } 

            
            else {

              showSuccess("Liquidación exitosa");
              onUpdateSaleList({ ...response.data, delete: true });
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
      showOut={showPaymentReservationModal} 
      onClose={() => dispatch(hidePaymentReservationModal())}
      title="Cobrar apartado"
    >
      <Grid className="custom-section">
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
            <FormLabel className="me-3">Medios de pago:</FormLabel>
            {["EF", "TA", "TR"].map((method) => (
              <div key={method} className="d-flex align-items-center mb-1">
                <div className="me-3" style={{ flex: 1 }}>
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
                </div>
              </div>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Grid className="custom-section">
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

      <Grid className="custom-section">
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
    </CustomModal>
  );
};

export default PaymentModal2;
