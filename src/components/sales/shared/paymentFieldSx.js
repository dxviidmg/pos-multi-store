import { alpha } from "@mui/material/styles";

/**
 * Resalta un monto deshabilitado (texto, borde y fondo) con un color de la paleta.
 * `getColor(palette)` devuelve el color; `bgOpacity` es la opacidad del fondo.
 */
const highlightSx = (getColor, bgOpacity) => (theme) => {
  const color = getColor(theme.palette);
  return {
    "& .MuiInputBase-input.Mui-disabled": { fontWeight: 700, WebkitTextFillColor: color },
    "& .MuiInputAdornment-root p": { fontWeight: 700, color, WebkitTextFillColor: color },
    "& .MuiOutlinedInput-root.Mui-disabled": {
      backgroundColor: alpha(color, bgOpacity),
      "& fieldset": { borderColor: color, borderWidth: 2 },
    },
    "& .MuiInputLabel-root.Mui-disabled": { color, fontWeight: 600 },
  };
};

export const TOTAL_SX = highlightSx((palette) => palette.primary.main, 0.06);
export const DISCOUNT_SX = highlightSx((palette) => palette.primary.light, 0.08);
export const CHANGE_SX = highlightSx((palette) => palette.success.main, 0.08);
