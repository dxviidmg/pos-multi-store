import React, { memo } from "react";
import { TextField } from "@mui/material";

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
      sx={isEmpty ? {
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
          '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.87)' },
          '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.23)' },
        },
      } : undefined}
    />
  );
};

export default memo(ReferencePaymentField);
