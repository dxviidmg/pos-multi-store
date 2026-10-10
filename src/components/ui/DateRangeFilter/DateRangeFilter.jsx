import React, { memo } from "react";
import { Grid, TextField } from "@mui/material";
import { getDateDifference, getFormattedDate } from "../../../utils/date";

const DEFAULT_ITEM_PROPS = { xs: 12, md: 4 };

/**
 * Campos "Fecha de inicio" / "Fecha de fin" (y opcionalmente "Rango") como
 * `Grid item`s; colócalo dentro del `Grid container` de filtros de la página.
 *
 * `onChange` recibe el evento del input con `name` = "start_date" | "end_date".
 * `max` limita ambas fechas (hoy por defecto); `null` quita el límite.
 * `itemProps` son los breakpoints de cada `Grid item`.
 */
const DateRangeFilter = ({
  startDate,
  endDate,
  onChange,
  disabled,
  max = getFormattedDate(),
  showRange,
  shrinkLabels,
  itemProps = DEFAULT_ITEM_PROPS,
}) => {
  const inputProps = max ? { max } : undefined;
  const InputLabelProps = shrinkLabels ? { shrink: true } : undefined;

  return (
    <>
      <Grid item {...itemProps}>
        <TextField
          size="small"
          fullWidth
          label="Fecha de inicio"
          name="start_date"
          type="date"
          value={startDate}
          onChange={onChange}
          inputProps={inputProps}
          InputLabelProps={InputLabelProps}
          disabled={disabled}
        />
      </Grid>
      <Grid item {...itemProps}>
        <TextField
          size="small"
          fullWidth
          label="Fecha de fin"
          name="end_date"
          type="date"
          value={endDate}
          onChange={onChange}
          inputProps={inputProps}
          InputLabelProps={InputLabelProps}
          disabled={disabled}
        />
      </Grid>
      {showRange && (
        <Grid item {...itemProps}>
          <TextField
            size="small"
            fullWidth
            label="Rango"
            name="range"
            type="text"
            value={getDateDifference(startDate, endDate)}
            InputLabelProps={InputLabelProps}
            disabled
          />
        </Grid>
      )}
    </>
  );
};

export default memo(DateRangeFilter);
