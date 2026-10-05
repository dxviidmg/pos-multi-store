import React from "react";
import { FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
import { MOVEMENT_TYPES, QUERY_TYPES } from "../../../constants";

const QUERY_OPTIONS = [
  { value: QUERY_TYPES.CODE, label: "Código de barras", shortcut: "Ctrl+Q" },
  { value: QUERY_TYPES.NAME, label: "Nombre o marca", shortcut: "Ctrl+L" },
  { value: QUERY_TYPES.VISUAL, label: "Visual", shortcut: "Ctrl+K", last: true },
];

// `allowedBy`: permiso del controlador que muestra el tipo de operación (si aplica)
const MOVEMENT_OPTIONS = [
  { value: MOVEMENT_TYPES.SALE, label: "Venta", shortcut: "Ctrl+E", allowedBy: "allowSale" },
  { value: MOVEMENT_TYPES.DISTRIBUTION, label: "Distribución", shortcut: "Ctrl+D", allowedBy: "allowDistribution" },
  { value: MOVEMENT_TYPES.TRANSFER, label: "Confirmar traspaso", shortcut: "Ctrl+R", allowedBy: "allowTransfer" },
  { value: MOVEMENT_TYPES.ADD_STOCK, label: "Agregar a inventario", shortcut: "Ctrl+Y" },
  { value: MOVEMENT_TYPES.CHECK_STOCK, label: "Checar precio", shortcut: "Ctrl+U" },
  { value: MOVEMENT_TYPES.RESERVATION, label: "Apartado", shortcut: "Ctrl+I", allowedBy: "allowSale" },
];

const MOBILE_LABEL_SX = { fontWeight: 600, fontSize: "0.875rem", display: "block", mb: 0.5 };
const DESKTOP_LABEL_SX = { fontWeight: 600, fontSize: "0.875rem" };
const DESKTOP_ROW_SX = { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 };
const OPTION_SX = { mr: 4 };
const RADIO = <Radio size="small" sx={{ py: 0.5 }} />;

/** Select en móvil; radios en fila con su atajo en escritorio. */
const SelectorRow = ({ title, value, onChange, options, isMobile }) => {
  if (isMobile) {
    return (
      <Grid item xs={12}>
        <FormLabel sx={MOBILE_LABEL_SX}>{title}</FormLabel>
        <Select size="small" value={value} onChange={onChange} fullWidth>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} sx={DESKTOP_ROW_SX}>
      <FormLabel sx={DESKTOP_LABEL_SX}>{title}</FormLabel>
      <RadioGroup row value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={RADIO}
            label={`${option.label} (${option.shortcut})`}
            sx={option.last ? undefined : OPTION_SX}
          />
        ))}
      </RadioGroup>
    </Grid>
  );
};

/**
 * "Modo de búsqueda" y "Tipo de operación" de la pantalla de venta.
 * `permissions`: { allowSale, allowDistribution, allowTransfer } definen las operaciones visibles.
 */
const SearchModeSelectors = ({ isMobile, queryType, onQueryTypeChange, movementType, onMovementTypeChange, permissions }) => {
  const movementOptions = MOVEMENT_OPTIONS.filter((option) => !option.allowedBy || permissions[option.allowedBy]);

  return (
    <Grid container spacing={isMobile ? 1.5 : 0} sx={{ mb: 0.5, mt: -1.5 }}>
      <SelectorRow
        title="Modo de búsqueda:"
        value={queryType}
        onChange={(e) => onQueryTypeChange(e.target.value)}
        options={QUERY_OPTIONS}
        isMobile={isMobile}
      />
      <SelectorRow
        title="Tipo de operación:"
        value={movementType}
        onChange={onMovementTypeChange}
        options={movementOptions}
        isMobile={isMobile}
      />
    </Grid>
  );
};

export default SearchModeSelectors;
