import { forwardRef } from "react";
import { InputAdornment, Select as MuiSelect, TextField as MuiTextField } from "@mui/material";
import { getFieldIcon } from "./fieldIcons";

/** Ícono al inicio del campo, según su etiqueta; solo con etiquetas de texto. */
const iconAdornment = (label) => {
  if (typeof label !== "string") return undefined;
  const Icon = getFieldIcon(label);
  return (
    <InputAdornment position="start">
      <Icon fontSize="small" sx={{ color: "primary.main" }} />
    </InputAdornment>
  );
};

/**
 * `TextField` de MUI con un ícono al inicio según su etiqueta. Un `startAdornment` propio
 * tiene prioridad, y los campos sin etiqueta (celdas de tabla, buscadores) no llevan ícono.
 */
export const TextField = forwardRef(({ label, InputProps, ...props }, ref) => {
  const startAdornment = InputProps?.startAdornment ? undefined : iconAdornment(label);
  return (
    <MuiTextField
      ref={ref}
      label={label}
      InputProps={startAdornment ? { ...InputProps, startAdornment } : InputProps}
      {...props}
    />
  );
});
TextField.displayName = "TextField";

/** `Select` de MUI con ícono al inicio según su `label` (úsalo dentro de un `FormControl`). */
export const Select = forwardRef(({ label, startAdornment, ...props }, ref) => (
  <MuiSelect ref={ref} label={label} startAdornment={startAdornment ?? iconAdornment(label)} {...props} />
));
Select.displayName = "Select";
