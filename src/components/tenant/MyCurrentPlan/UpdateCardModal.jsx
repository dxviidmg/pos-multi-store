import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import CustomModal from "../../ui/Modal/Modal";

export const UPDATE_CARD_CONTAINER_ID = "mp-bricks-container-update";

/** Modal para cambiar la tarjeta domiciliada; `cardForm` viene de `useCardFormModal`. */
const UpdateCardModal = ({ cardForm }) => {
  const handleClose = () => {
    if (cardForm.submitting) return;
    cardForm.close();
  };

  return (
    <CustomModal showOut={cardForm.isOpen} onClose={handleClose} title="Actualizar tarjeta">
      <Box sx={{ p: 3 }}>
        {cardForm.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {cardForm.error}
          </Alert>
        )}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Registra tu nueva tarjeta. No se genera ningún cobro ahora: los datos se
          aplicarán en tu próximo pago recurrente.
        </Typography>
        <div id={UPDATE_CARD_CONTAINER_ID} />
      </Box>
    </CustomModal>
  );
};

export default UpdateCardModal;
