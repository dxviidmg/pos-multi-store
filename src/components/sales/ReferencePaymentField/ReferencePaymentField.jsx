import React, { memo } from "react";
import { TextField } from "@mui/material";

// Vacío: etiqueta en rojo pero borde neutro, como un campo sin foco
const EMPTY_SX = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'action.disabled' },
    '&:hover fieldset': { borderColor: 'text.primary' },
    '&.Mui-focused fieldset': { borderColor: 'action.disabled' },
  },
};

/**
 * Campo de referencia para pagos que no son en efectivo. Se resalta mientras está vacío.
 */
const ReferencePaymentField = ({ value, onChange }) => {
  const isEmpty = value === "";
  return (
    <TextField
      fullWidth
      size="small"
      label="Referencia de pago"
      type="text"
      className="fade-in-left"
      color={isEmpty ? "error" : "primary"}
      focused={isEmpty}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputLabelProps={{ shrink: true }}
      sx={isEmpty ? EMPTY_SX : undefined}
    />
  );
};

export default memo(ReferencePaymentField);
