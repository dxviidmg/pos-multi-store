import React, { memo } from "react";
import { IconButton, MenuItem, Select } from "@mui/material";
import CustomTooltip from "../Tooltip";

/**
 * Selector de modo de visualización (tabla, galería, tarjetas…).
 *
 * `options`: `[{ value, label, Icon? }]`. `onChange` recibe el `value` elegido.
 * - `variant="select"`: `Select` de ancho completo con el `label` de cada opción.
 * - `variant="buttons"`: un `IconButton` por opción con `Icon` y `label` como tooltip; el activo va relleno.
 */
const ViewModeToggle = ({ value, onChange, options, variant = "select" }) => {
  if (variant === "buttons") {
    return options.map(({ value: option, label, Icon }) => {
      const active = value === option;
      return (
        <CustomTooltip key={option} text={label} position="bottom">
          <IconButton
            onClick={() => onChange(option)}
            size="small"
            aria-label={label}
            aria-pressed={active}
            sx={{
              bgcolor: active ? "primary.main" : "transparent",
              color: active ? "primary.contrastText" : "text.primary",
              border: "1px solid",
              borderColor: active ? "primary.main" : "divider",
              "&:hover": { bgcolor: active ? "primary.dark" : "action.hover" },
            }}
          >
            <Icon fontSize="small" />
          </IconButton>
        </CustomTooltip>
      );
    });
  }

  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      aria-label="Modo de visualización"
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
      ))}
    </Select>
  );
};

export default memo(ViewModeToggle);
