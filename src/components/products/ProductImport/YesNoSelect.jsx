import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const YES_NO_OPTIONS = [
  { value: "Y", label: "Si" },
  { value: "N", label: "No" },
];

const YesNoSelect = ({ name, label, value, onChange }) => (
  <FormControl fullWidth size="small">
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={onChange} name={name} label={label}>
      <MenuItem value="">Seleccionar</MenuItem>
      {YES_NO_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default YesNoSelect;
