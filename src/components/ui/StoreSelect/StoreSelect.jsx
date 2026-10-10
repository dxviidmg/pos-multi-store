import React, { memo } from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useStoreOptions } from "../../../hooks/useStores";

const defaultOptionLabel = (store) => store.full_name;

/**
 * Select de sucursales con datos de `useStoreOptions` (cacheados por React Query).
 *
 * - `params`: filtros para la API (p. ej. `{ store_type: "T" }`).
 * - `allLabel`: agrega una opción `""` seleccionable al inicio ("Todas", "Selecciona una tienda"…).
 * - `placeholder`: sin `label`, muestra un texto gris cuando `value` es `""` (opción vacía deshabilitada).
 * - `getOptionLabel(store)`: texto o nodo de cada opción; por defecto `store.full_name`.
 * `onChange` recibe el evento del `Select` (`event.target.name` = `name`).
 */
const StoreSelect = ({
  value,
  onChange,
  name,
  label,
  params,
  allLabel,
  placeholder,
  getOptionLabel = defaultOptionLabel,
  disabled,
}) => {
  const { data: stores } = useStoreOptions(params);

  const renderValue = placeholder
    ? (selected) => {
        if (!selected) return <Box component="span" sx={{ color: "text.disabled" }}>{placeholder}</Box>;
        const store = stores.find((s) => s.id === selected);
        return store ? getOptionLabel(store) : selected;
      }
    : undefined;

  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        onChange={onChange}
        name={name}
        label={label}
        displayEmpty={Boolean(placeholder)}
        renderValue={renderValue}
      >
        {placeholder && <MenuItem value="" disabled>{placeholder}</MenuItem>}
        {allLabel && <MenuItem value="">{allLabel}</MenuItem>}
        {stores.map((store) => (
          <MenuItem key={store.id} value={store.id}>{getOptionLabel(store)}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(StoreSelect);
