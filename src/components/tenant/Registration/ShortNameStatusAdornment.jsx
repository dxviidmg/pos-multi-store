import React from "react";
import { Box, Typography, InputAdornment, CircularProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

/** Texto, color e ícono de cada estado de la verificación de la clave del negocio. */
const STATUS_TONE = {
  checking: {
    label: "Verificando...",
    color: "text.secondary",
    fontWeight: 500,
    icon: <CircularProgress size={14} sx={{ color: "text.secondary" }} />,
  },
  available: {
    label: "Disponible",
    color: "success.main",
    fontWeight: 600,
    background: (theme) => alpha(theme.palette.success.main, 0.1),
    icon: <CheckCircleIcon sx={{ color: "success.main", fontSize: 16 }} />,
  },
  taken: {
    label: "En uso",
    color: "error.main",
    fontWeight: 600,
    background: (theme) => alpha(theme.palette.error.main, 0.08),
    icon: <CancelIcon sx={{ color: "error.main", fontSize: 16 }} />,
  },
};

/** Indicador al final del campo "Clave de tu negocio": Verificando / Disponible / En uso. */
const ShortNameStatusAdornment = ({ status }) => {
  const tone = STATUS_TONE[status];
  return (
    <InputAdornment position="end" sx={{ mr: 0.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {tone && (
          <Typography sx={{ fontSize: "0.72rem", color: tone.color, fontWeight: tone.fontWeight }}>
            {tone.label}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 22, height: 22, borderRadius: "50%",
            transition: "all 0.2s ease",
            bgcolor: tone?.background || "transparent",
          }}
        >
          {tone?.icon}
        </Box>
      </Box>
    </InputAdornment>
  );
};

export default ShortNameStatusAdornment;
