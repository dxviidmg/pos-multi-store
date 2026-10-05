import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { createMercadoPagoPreference } from "../../../api/mercadopago";
import { showRequestError } from "../../../utils/alerts";
import mercadoPagoLogo from "../../../assets/mercadopago-logo.svg";

/** Aviso de suscripción por vencer con enlace de pago de Mercado Pago. */
const StorePaymentModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await createMercadoPagoPreference();
      if (res.data?.init_point) {
        window.open(res.data.init_point, "_blank");
        onClose();
      }
    } catch (error) {
      showRequestError("crear el enlace de pago", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title="Pago de servicio">
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Box component="img" src={mercadoPagoLogo} alt="Mercado Pago" sx={{ height: 40, mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 3 }}>
          Tu suscripción está próxima a vencer o ya venció. Realiza tu pago para continuar usando el sistema.
        </Typography>
        <CustomButton onClick={handlePayment} disabled={loading}>
          {loading ? "Generando enlace..." : "Pagar con Mercado Pago"}
        </CustomButton>
      </Box>
    </CustomModal>
  );
};

export default StorePaymentModal;
