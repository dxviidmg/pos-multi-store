import React from "react";
import { Grid, TextField } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ReferencePaymentField from "../ReferencePaymentField/ReferencePaymentField";
import { formatCurrency } from "../../../utils/currency";
import PaymentCard from "./PaymentCard";

/**
 * Resalta un monto deshabilitado (texto, borde y fondo) con un color de la paleta.
 * `getColor(palette)` devuelve el color; `bgOpacity` es la opacidad del fondo.
 */
const highlightSx = (getColor, bgOpacity) => (theme) => {
  const color = getColor(theme.palette);
  return {
    "& .MuiInputBase-input.Mui-disabled": { fontWeight: 700, WebkitTextFillColor: color },
    "& .MuiInputAdornment-root p": { fontWeight: 700, color, WebkitTextFillColor: color },
    "& .MuiOutlinedInput-root.Mui-disabled": {
      backgroundColor: alpha(color, bgOpacity),
      "& fieldset": { borderColor: color, borderWidth: 2 },
    },
    "& .MuiInputLabel-root.Mui-disabled": { color, fontWeight: 600 },
  };
};

const TOTAL_SX = highlightSx((palette) => palette.primary.main, 0.06);
const DISCOUNT_SX = highlightSx((palette) => palette.primary.light, 0.08);
const CHANGE_SX = highlightSx((palette) => palette.success.main, 0.08);
const PAID_WITH_SX = {
  "& .MuiInputBase-input": { fontWeight: 700 },
  "& .MuiInputAdornment-root p": { fontWeight: 700 },
};

/**
 * Totales del cobro: total, total con descuento (si hay cliente), "Pago con" y cambio o referencia.
 */
const PaymentTotals = ({
  total,
  totalDiscount,
  hasClient,
  payment,
  onPaidWithChange,
  paidWithRef,
  needsReference,
  referencePayment,
  onReferenceChange,
  isMobile,
}) => {
  const itemWidth = isMobile ? 6 : hasClient ? 3 : 4;

  return (
    <PaymentCard title="Totales">
      <Grid container spacing={isMobile ? 1.5 : 2}>
        <Grid item xs={itemWidth}>
          <TextField fullWidth size="small" label="Total" value={formatCurrency(total)} disabled sx={TOTAL_SX} />
        </Grid>

        {hasClient && (
          <Grid item xs={itemWidth}>
            <TextField
              fullWidth
              size="small"
              label="Total con descuento"
              value={formatCurrency(totalDiscount)}
              disabled
              sx={DISCOUNT_SX}
            />
          </Grid>
        )}

        <Grid item xs={itemWidth}>
          <TextField
            fullWidth
            size="small"
            label="Pago con"
            type="text"
            value={payment.paidWith}
            onChange={onPaidWithChange}
            inputRef={paidWithRef}
            InputProps={{ startAdornment: "$" }}
            sx={PAID_WITH_SX}
          />
        </Grid>

        <Grid item xs={itemWidth}>
          {needsReference ? (
            <ReferencePaymentField value={referencePayment} onChange={onReferenceChange} />
          ) : (
            <TextField
              fullWidth
              size="small"
              label="Cambio"
              value={formatCurrency(payment.change)}
              disabled
              sx={payment.change > 0 ? CHANGE_SX : TOTAL_SX}
            />
          )}
        </Grid>
      </Grid>
    </PaymentCard>
  );
};

export default PaymentTotals;
