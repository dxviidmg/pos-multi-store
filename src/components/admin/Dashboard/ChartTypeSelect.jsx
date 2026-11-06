import React from "react";
import { FormControl, MenuItem, Select } from "@mui/material";

// Select crudo de MUI a propósito (no ui/Field/Field): es un control de presentación
// de la gráfica (líneas/barras), no un campo de formulario, y sin label el wrapper
// Field no aportaría ícono ni estilo. Mismo criterio que ViewModeToggle.
/** Selector Líneas / Barras de las gráficas de los tableros. */
const ChartTypeSelect = ({ value, onChange }) => (
  <FormControl size="small" sx={{ minWidth: 120 }}>
    <Select value={value} onChange={(e) => onChange(e.target.value)} inputProps={{ "aria-label": "Tipo de gráfica" }}>
      <MenuItem value="line">Líneas</MenuItem>
      <MenuItem value="bar">Barras</MenuItem>
    </Select>
  </FormControl>
);

export default ChartTypeSelect;
