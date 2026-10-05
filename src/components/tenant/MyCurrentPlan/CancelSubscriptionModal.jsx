import React, { useEffect, useState } from "react";
import { Box, Typography, Alert, Button, Stack, TextField, MenuItem } from "@mui/material";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { cancelSubscription } from "../../../api/subscriptions";
import { useUser } from "../../../context/UserContext";
import { CANCELLATION_REASONS } from "../../../constants";
import { showSuccess } from "../../../utils/alerts";

const getCancelErrorMessage = (err) => {
  if (err.response?.status === 500) {
    return "Ocurrió un problema al procesar la cancelación. Contacta a soporte técnico.";
  }
  return err.response?.data?.detail || "No se pudo cancelar la suscripción. Intenta de nuevo o contacta a soporte.";
};

const CancelSubscriptionModal = ({ isOpen, onClose }) => {
  const { logout } = useUser();
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (cancelling) return;
    setError(null);
    onClose();
  };

  const handleCancelSubscription = async () => {
    if (!reason) return;
    setCancelling(true);
    setError(null);
    try {
      await cancelSubscription({ reason });
      // Al cancelar, el backend invalida los tokens del tenant: el dueño y todos sus
      // usuarios (en cualquier máquina) quedan fuera. Cerramos la sesión de inmediato
      // en esta máquina y redirigimos al login. Los demás saldrán en su siguiente
      // petición al recibir 401.
      onClose();
      showSuccess("Suscripción cancelada. Se cerrará la sesión de todos los usuarios.");
      logout();
      window.location.href = "/login";
    } catch (err) {
      setError(getCancelErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <CustomSpinner isLoading={cancelling} />
      <CustomModal showOut={isOpen} onClose={handleClose} title="Cancelar suscripción">
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Al cancelar, se detendrá el cobro recurrente y se cerrará la sesión de
            inmediato para ti y para todos tus usuarios, en cualquier equipo. Tus datos
            se conservan. No se generan reembolsos y, para reactivar la suscripción más
            adelante, deberás contactar a soporte.
          </Typography>

          <TextField
            select
            fullWidth
            size="small"
            label="Motivo de cancelación"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            sx={{ mb: 3 }}
          >
            {CANCELLATION_REASONS.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <CustomButton onClick={handleClose} disabled={cancelling} variant="outlined">
              No, mantener
            </CustomButton>
            <Button
              onClick={handleCancelSubscription}
              disabled={!reason || cancelling}
              variant="contained"
              color="error"
            >
              {cancelling ? "Cancelando..." : "Sí, cancelar"}
            </Button>
          </Stack>
        </Box>
      </CustomModal>
    </>
  );
};

export default CancelSubscriptionModal;
