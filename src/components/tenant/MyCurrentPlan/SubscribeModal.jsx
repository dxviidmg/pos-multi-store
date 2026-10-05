import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import CustomModal from "../../ui/Modal/Modal";
import { formatCurrency } from "../../../utils/utils";

export const SUBSCRIBE_CONTAINER_ID = "mp-bricks-container";

/** Modal para domiciliar el pago; `cardForm` viene de `useCardFormModal`. */
const SubscribeModal = ({ cardForm, equivalent }) => (
  <CustomModal showOut={cardForm.isOpen} onClose={cardForm.close} title="Domiciliar pago recurrente">
    <Box sx={{ p: 3 }}>
      {cardForm.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {cardForm.error}
        </Alert>
      )}
      {equivalent && (
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Se activará cobro recurrente de <strong>{formatCurrency(equivalent.price)} MXN/mes</strong>
        </Typography>
      )}
      <div id={SUBSCRIBE_CONTAINER_ID} />
    </Box>
  </CustomModal>
);

export default SubscribeModal;
