import React from "react";
import { Checkbox, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { PAYMENT_METHODS, PAYMENT_METHOD_OPTIONS } from "../../../constants";
import { PAYMENT_TYPES } from "./usePaymentMethods";
import PaymentCard from "./PaymentCard";

const AMOUNT_INPUT_SX = {
  mt: 1,
  "& .MuiInputBase-root": { height: 28 },
  "& .MuiInputBase-input": { padding: "4px 8px", textAlign: "center" },
};

/**
 * Tipo de pago (único/mixto), medios de pago, montos del pago mixto y el botón de cobro (`children`).
 */
const PaymentMethodsSection = ({
  paymentMethods,
  selectedMethod,
  isReservation,
  isMobile,
  onPaymentsChange,
  onAmountChange,
  children,
}) => {
  const { type, methods } = paymentMethods;
  const isMixed = type === PAYMENT_TYPES.MIXED;
  const columnWidth = isMixed ? 3 : 4;

  return (
    <PaymentCard last>
      <Grid container spacing={isMobile ? 1.5 : 2}>
        <Grid item xs={isMobile ? 12 : columnWidth}>
          <FormLabel>Tipo de pago:</FormLabel>
          <RadioGroup value={type} onChange={onPaymentsChange} name="paymentType">
            <FormControlLabel value={PAYMENT_TYPES.SINGLE} control={<Radio size="small" />} label="Único" />
            {!isReservation && (
              <FormControlLabel value={PAYMENT_TYPES.MIXED} control={<Radio size="small" />} label="Mixto" />
            )}
          </RadioGroup>
        </Grid>

        <Grid item xs={isMobile ? 6 : columnWidth}>
          <FormLabel>Medios de pago:</FormLabel>
          <RadioGroup value={selectedMethod} onChange={onPaymentsChange} name="paymentMethod">
            {PAYMENT_METHOD_OPTIONS.map(({ value: method, label }) => (
              <FormControlLabel
                key={method}
                value={method}
                control={
                  isMixed ? (
                    <Checkbox
                      size="small"
                      checked={(isReservation && method === PAYMENT_METHODS.CASH) || methods[method] > 0}
                      disabled={
                        (method === PAYMENT_METHODS.TRANSFER && methods[PAYMENT_METHODS.CARD] > 0) ||
                        (method === PAYMENT_METHODS.CARD && methods[PAYMENT_METHODS.TRANSFER] > 0)
                      }
                      onChange={onPaymentsChange}
                      value={method}
                      name="paymentMethod"
                    />
                  ) : (
                    <Radio size="small" />
                  )
                }
                label={label}
              />
            ))}
          </RadioGroup>
        </Grid>

        {isMixed && (
          <Grid item xs={isMobile ? 6 : 3}>
            <FormLabel>Cantidades:</FormLabel>
            <RadioGroup>
              {PAYMENT_METHOD_OPTIONS.map(({ value: method, label }) => (
                <TextField
                  key={method}
                  size="small"
                  type="number"
                  label={label}
                  fullWidth
                  disabled={!methods[method]}
                  onChange={(e) => onAmountChange(method, e.target.value)}
                  sx={{ ...AMOUNT_INPUT_SX, visibility: methods[method] > 0 ? "visible" : "hidden" }}
                />
              ))}
            </RadioGroup>
          </Grid>
        )}

        <Grid item xs={isMobile ? 12 : columnWidth}>
          {children}
        </Grid>
      </Grid>
    </PaymentCard>
  );
};

export default PaymentMethodsSection;
