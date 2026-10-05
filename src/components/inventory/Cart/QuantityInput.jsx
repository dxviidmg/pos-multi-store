import React from "react";
import { TextField } from "@mui/material";
import { QUANTITY_MODES, QUANTITY_RULES, getInputValue, getSteppedValue, isValidQuantityText } from "./quantityRules";

/**
 * Input de cantidad del carrito (tabla y tarjetas) con las reglas de `quantityRules`:
 * decimales por modo, mínimo, flechas ↑/↓ con tope `maxQuantity` y, en modo pesos, captura en $.
 *
 * `onChange(item, text, mode)` recibe el texto capturado; `onEnter` (opcional) se llama con Enter.
 */
const QuantityInput = ({ item, mode, onChange, maxQuantity = Infinity, onEnter, inputRef, sx, fullWidth }) => {
  const { min, step } = QUANTITY_RULES[mode];

  const handleChange = (e) => {
    if (!isValidQuantityText(e.target.value, mode)) return;
    onChange(item, e.target.value, mode);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
      return;
    }
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const next = getSteppedValue(item, mode, e.key === "ArrowUp" ? 1 : -1, maxQuantity);
    if (next !== null) onChange(item, String(next), mode);
  };

  return (
    <TextField
      size="small"
      type="number"
      value={getInputValue(item, mode)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      inputRef={inputRef}
      inputProps={{ min, step }}
      InputProps={mode === QUANTITY_MODES.AMOUNT ? { startAdornment: "$" } : undefined}
      fullWidth={fullWidth}
      sx={sx}
    />
  );
};

export default QuantityInput;
