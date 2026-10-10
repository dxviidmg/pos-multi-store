import React, { memo } from "react";
import { Box, Typography } from "@mui/material";

/**
 * Línea "Etiqueta: valor" de tarjetas (etiqueta en negrita, texto 0.8rem).
 * `label` va sin dos puntos; `children` es el valor; `sx` se mezcla con el estilo
 * base (p. ej. `{ mb: 0.25 }` entre líneas).
 */
const LabelValue = ({ label, children, sx }) => (
  <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.4, ...sx }}>
    <Box component="span" sx={{ fontWeight: 600 }}>{label}:</Box> {children}
  </Typography>
);

export default memo(LabelValue);
