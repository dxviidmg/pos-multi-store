import React, { memo } from "react";
import { Box, Grid, MenuItem } from "@mui/material";
import { Select } from "../../ui/Field/Field";
import DateRangeFilter from "../../ui/DateRangeFilter/DateRangeFilter";
import { UI_TEXT } from "../../../constants";
import { PERIODS } from "./storeInsights";

const SELECT_SX = { flex: "1 1 190px", height: 38, fontSize: "0.875rem", bgcolor: "background.paper", borderRadius: "10px" };
const DATE_ITEM_PROPS = { xs: 6 };

/** Select compacto: la etiqueta va en gris dentro y el valor en el color del texto. */
const LabeledSelect = ({ label, value, onChange, name, options, disabled }) => (
  <Select
    size="small"
    displayEmpty
    disabled={disabled}
    value={value}
    name={name}
    onChange={onChange}
    sx={SELECT_SX}
    inputProps={{ "aria-label": label }}
    renderValue={(selected) => (
      <>
        <Box component="span" sx={{ color: "text.secondary" }}>{label}: </Box>
        {options.find((option) => option.value === selected)?.label}
      </>
    )}
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
    ))}
  </Select>
);

const PERIOD_OPTIONS = Object.entries(PERIODS).map(([value, { label }]) => ({ value, label }));

/** Periodo y departamento. Las fechas solo aparecen con "Otro rango". */
const StorePeriodFilters = ({ period, onPeriodChange, params, departments, onChange, disabled }) => {
  const departmentOptions = [
    { value: "", label: UI_TEXT.ALL },
    { value: "0", label: "Sin departamento" },
    ...departments.map((department) => ({ value: department.id, label: `${department.name} (${department.product_count})` })),
  ];

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 3 }}>
      <LabeledSelect
        label="Periodo"
        value={period}
        onChange={(event) => onPeriodChange(event.target.value)}
        options={PERIOD_OPTIONS}
        disabled={disabled}
      />

      {period === "custom" && (
        <Grid container className="fill-row" spacing={1} sx={{ flex: "2 1 320px", width: "auto", m: 0 }}>
          <DateRangeFilter
            startDate={params.start_date}
            endDate={params.end_date}
            onChange={onChange}
            disabled={disabled}
            shrinkLabels
            itemProps={DATE_ITEM_PROPS}
          />
        </Grid>
      )}

      {departments.length > 0 && (
        <LabeledSelect
          label="Departamento"
          name="department_id"
          value={params.department_id || ""}
          onChange={onChange}
          options={departmentOptions}
          disabled={disabled}
        />
      )}
    </Box>
  );
};

export default memo(StorePeriodFilters);
