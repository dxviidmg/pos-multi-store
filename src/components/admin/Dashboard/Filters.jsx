import React, { memo } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { MONTH_NAMES, getYearOptions } from "../../../utils/date";

const LabeledSelect = ({ label, value, onChange, children }) => (
  <Grid item xs={12} sm={4}>
    <FormControl size="small" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={(e) => onChange(e.target.value)}>
        {children}
      </Select>
    </FormControl>
  </Grid>
);

/**
 * Filtros de periodo de los tableros: métrica (opcional), año y mes ("Todo el año" = 0).
 * `leading` se muestra como primer filtro (p. ej. el selector de tienda).
 */
const Filters = ({ leading, metricOptions, metricType, onMetricChange, year, onYearChange, month, onMonthChange }) => (
  <Grid container spacing={2} alignItems="center">
    {leading && <Grid item xs={12} sm={4}>{leading}</Grid>}
    {metricOptions && (
      <LabeledSelect label="Métrica" value={metricType} onChange={onMetricChange}>
        {metricOptions.map(({ value, label }) => (
          <MenuItem key={value} value={value}>{label}</MenuItem>
        ))}
      </LabeledSelect>
    )}
    <LabeledSelect label="Año" value={year} onChange={onYearChange}>
      {getYearOptions().map((y) => (
        <MenuItem key={y} value={y}>{y}</MenuItem>
      ))}
    </LabeledSelect>
    <LabeledSelect label="Mes" value={month} onChange={onMonthChange}>
      <MenuItem value={0}>Todo el año</MenuItem>
      {MONTH_NAMES.map((m, i) => (
        <MenuItem key={i + 1} value={i + 1}>{m}</MenuItem>
      ))}
    </LabeledSelect>
  </Grid>
);

export default memo(Filters);
