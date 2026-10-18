import React from "react";
import { FormControl, MenuItem, Select } from "@mui/material";

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
