import React from "react";
import { Checkbox, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup } from "@mui/material";
import { Select, TextField } from "../../ui/Field/Field";
import { PAYMENT_METHODS, PAYMENT_METHOD_OPTIONS } from "../../../constants";
import { PAYMENT_TYPES } from "./usePaymentMethods";
import PaymentCard from "./PaymentCard";

// Móvil: filas de 44 px para tocar con el pulgar
const MOBILE_OPTION_SX = { minHeight: 44, mr: 0 };

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
  // Móvil con pago único: tipo y medio de pago son dos selects lado a lado
  const methodAsSelect = isMobile && !isMixed;

  return (
    <PaymentCard last>
      <Grid container spacing={isMobile ? 1.5 : 2}>
        <Grid item xs={isMobile ? (methodAsSelect ? 6 : 12) : columnWidth}>
          <FormLabel>Tipo de pago:</FormLabel>
          {isMobile ? (
            <Select size="small" fullWidth name="paymentType" value={type} onChange={onPaymentsChange} sx={{ mt: 0.5 }}>
              <MenuItem value={PAYMENT_TYPES.SINGLE}>Único</MenuItem>
              {!isReservation && <MenuItem value={PAYMENT_TYPES.MIXED}>Mixto</MenuItem>}
            </Select>
          ) : (
            <RadioGroup value={type} onChange={onPaymentsChange} name="paymentType">
              <FormControlLabel value={PAYMENT_TYPES.SINGLE} control={<Radio size="small" />} label="Único" />
              {!isReservation && (
                <FormControlLabel value={PAYMENT_TYPES.MIXED} control={<Radio size="small" />} label="Mixto" />
              )}
            </RadioGroup>
          )}
        </Grid>

        <Grid item xs={isMobile ? 6 : columnWidth}>
          <FormLabel>Medios de pago:</FormLabel>
          {methodAsSelect ? (
            <Select size="small" fullWidth name="paymentMethod" value={selectedMethod} onChange={onPaymentsChange} sx={{ mt: 0.5 }}>
              {PAYMENT_METHOD_OPTIONS.map(({ value: method, label }) => (
                <MenuItem key={method} value={method}>{label}</MenuItem>
              ))}
            </Select>
          ) : (
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
                  sx={isMobile ? MOBILE_OPTION_SX : undefined}
                />
              ))}
            </RadioGroup>
          )}
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

        {children && (
          <Grid item xs={isMobile ? 12 : columnWidth}>
            {children}
          </Grid>
        )}
      </Grid>
    </PaymentCard>
  );
};

export default PaymentMethodsSection;
