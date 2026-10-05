import React, { memo } from "react";
import { Autocomplete, TextField } from "@mui/material";

/**
 * Autocomplete de marca o departamento con el conteo de productos en cada opción.
 * `value` y `onChange` trabajan con el id; sin selección `onChange` recibe "".
 * `leadingOption` (opcional) se muestra primero y sin conteo (p. ej. "Sin departamento").
 * Se deshabilita cuando las opciones ya cargaron (`loaded`) y no hay ninguna.
 */
const CatalogAutocomplete = ({ label, options, value, onChange, loaded, leadingOption }) => {
  const allOptions = leadingOption ? [leadingOption, ...options] : options;

  return (
    <Autocomplete
      size="small"
      options={allOptions}
      getOptionLabel={(option) =>
        option.id === leadingOption?.id ? option.name : `${option.name} (${option.product_count})`
      }
      value={allOptions.find((option) => option.id === value) || null}
      onChange={(_, newValue) => onChange(newValue?.id || "")}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      disabled={loaded && options.length === 0}
      renderInput={(inputProps) => <TextField {...inputProps} label={label} />}
    />
  );
};

export default memo(CatalogAutocomplete);
