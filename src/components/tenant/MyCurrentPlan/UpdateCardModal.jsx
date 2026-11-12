import React from "react";
import { Typography, Alert } from "@mui/material";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";

export const UPDATE_CARD_CONTAINER_ID = "mp-bricks-container-update";

/** Modal para cambiar la tarjeta domiciliada; `cardForm` viene de `useCardFormModal`. */
const UpdateCardModal = ({ cardForm }) => {
  const handleClose = () => {
    if (cardForm.submitting) return;
    cardForm.close();
  };

  return (
    <CustomModal showOut={cardForm.isOpen} onClose={handleClose} title="Actualizar tarjeta">
      <ModalBody>
        {cardForm.error && (
          <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
            {cardForm.error}
          </Alert>
        )}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Registra tu nueva tarjeta. No se genera ningún cobro ahora: los datos se
          aplicarán en tu próximo pago recurrente.
        </Typography>
        <div id={UPDATE_CARD_CONTAINER_ID} />
      </ModalBody>
    </CustomModal>
  );
};

export default UpdateCardModal;
