import React from "react";
import { Typography, Alert } from "@mui/material";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import { formatCurrency } from "../../../utils/utils";

export const SUBSCRIBE_CONTAINER_ID = "mp-bricks-container";

/** Modal para domiciliar el pago; `cardForm` viene de `useCardFormModal`. */
const SubscribeModal = ({ cardForm, equivalent }) => (
  <CustomModal showOut={cardForm.isOpen} onClose={cardForm.close} title="Domiciliar pago recurrente">
    <ModalBody>
      {cardForm.error && (
        <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
          {cardForm.error}
        </Alert>
      )}
      {equivalent && (
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Se activará cobro recurrente de <strong>{formatCurrency(equivalent.price)} MXN/mes</strong>
        </Typography>
      )}
      <div id={SUBSCRIBE_CONTAINER_ID} />
    </ModalBody>
  </CustomModal>
);

export default SubscribeModal;
