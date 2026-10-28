import React from "react";
import { Grid } from "@mui/material";
import { TextField } from "../../ui/Field/Field";
import ReferencePaymentField from "../ReferencePaymentField/ReferencePaymentField";
import { formatCurrency } from "../../../utils/currency";
import PaymentCard from "./PaymentCard";
import { CHANGE_SX, DISCOUNT_SX, TOTAL_SX } from "../shared/paymentFieldSx";

// Móvil: campos de 48 px con el monto en 20 px
const BIG_FIELD_SX = { "& .MuiInputBase-root": { height: 48 }, "& .MuiInputBase-input": { fontSize: "1.25rem" } };
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
  const totalWidth = isMobile && !hasClient ? 12 : itemWidth;
  const bigSx = (sx) => (isMobile ? [sx, BIG_FIELD_SX] : sx);

  return (
    <PaymentCard title="Totales">
      <Grid container spacing={isMobile ? 1.5 : 2}>
        <Grid item xs={totalWidth}>
          <TextField fullWidth size="small" label="Total" value={formatCurrency(total)} disabled sx={bigSx(TOTAL_SX)} />
        </Grid>

        {hasClient && (
          <Grid item xs={itemWidth}>
            <TextField
              fullWidth
              size="small"
              label="Total con descuento"
              value={formatCurrency(totalDiscount)}
              disabled
              sx={bigSx(DISCOUNT_SX)}
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
            sx={bigSx(PAID_WITH_SX)}
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
              sx={bigSx(payment.change > 0 ? CHANGE_SX : TOTAL_SX)}
            />
          )}
        </Grid>
      </Grid>
    </PaymentCard>
  );
};

export default PaymentTotals;
