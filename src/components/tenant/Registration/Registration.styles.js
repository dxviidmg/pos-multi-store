import { alpha } from "@mui/material/styles";
import { colors } from "../../../theme/colors";

const FOCUS_RING = (color) => `0 0 0 3px ${alpha(color, 0.15)}`;

export const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "0.9rem",
    backgroundColor: "background.paper",
    "&.Mui-focused fieldset": {
      borderColor: colors.primaryLight,
      borderWidth: "1px",
      boxShadow: FOCUS_RING(colors.primaryLight),
    },
  },
  "& label.Mui-focused": { color: colors.primaryLight },
};

// Paleta del tema según la disponibilidad de la clave del negocio
const SHORT_NAME_PALETTE = { available: "success", taken: "error" };

/** Borde, foco y etiqueta del campo "Clave de tu negocio" según su disponibilidad. */
export const getShortNameInputSx = (status) => (theme) => {
  const paletteKey = SHORT_NAME_PALETTE[status];
  const main = paletteKey ? theme.palette[paletteKey].main : null;
  const focusColor = main || theme.palette.primary.light;
  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontSize: "0.9rem",
      backgroundColor: "background.paper",
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: main ? alpha(main, 0.6) : undefined,
        transition: "border-color 0.2s ease",
      },
      "&:hover fieldset": {
        borderColor: main ? alpha(main, 0.8) : undefined,
      },
      "&.Mui-focused fieldset": {
        borderColor: focusColor,
        boxShadow: FOCUS_RING(focusColor),
      },
    },
    "& label.Mui-focused": { color: focusColor },
  };
};

export const pageContainerSx = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  position: "relative",
  overflowY: "auto",
  py: 4,
};

export const overlayGradientSx = {
  position: "fixed", inset: 0,
  bgcolor: "background.default",
  zIndex: 0,
};

export const formPaperSx = {
  position: "relative", zIndex: 1,
  width: "100%", maxWidth: 600, mx: 2,
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "16px", overflow: "hidden auto",
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  boxShadow: colors.shadow.dialog,
  // Ocultar la barra de scroll (el contenido sigue siendo desplazable)
  scrollbarWidth: "none",        // Firefox
  msOverflowStyle: "none",       // IE / Edge legacy
  "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
};

// Header superior de la card con azul fuerte
export const headerBannerSx = {
  background: colors.gradient.brand,
  px: 4, pt: 3.5, pb: 3,
  textAlign: "center",
};

export const successIconSx = {
  width: 48, height: 48, borderRadius: "50%",
  bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
  display: "flex", alignItems: "center", justifyContent: "center",
  mx: "auto", mb: 2,
};

export const stepIndicatorSx = {
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "text.primary",
};

export const stepCountSx = {
  fontSize: "0.75rem",
  color: "text.secondary",
};

export const progressBarSx = {
  height: 4,
  borderRadius: 2,
  backgroundColor: alpha(colors.primary, 0.1),
  "& .MuiLinearProgress-bar": {
    borderRadius: 2,
    background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
  },
};

// Botón primario con el gradiente azul de marca
export const primaryButtonSx = {
  py: 1.3,
  borderRadius: "10px",
  fontSize: "0.9rem",
  fontWeight: 700,
  background: colors.gradient.brand,
  color: colors.white,
  boxShadow: colors.shadow.brand,
  "&:hover": {
    background: colors.gradient.brandHover,
    boxShadow: colors.shadow.brandHover,
  },
  "&.Mui-disabled": {
    background: alpha(colors.primary, 0.12),
    color: alpha(colors.primary, 0.35),
    boxShadow: "none",
  },
};

// Botón secundario (Atrás)
export const secondaryButtonSx = {
  py: 1.3, px: 2.5,
  borderRadius: "10px",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "text.secondary",
  bgcolor: "action.hover",
  border: "1px solid",
  borderColor: "divider",
  "&:hover": { bgcolor: "action.selected" },
};

export const headerTitleSx = { fontWeight: 700, color: colors.white, mb: 0.5 };

export const headerSubtitleSx = { fontSize: "0.85rem", color: alpha(colors.white, 0.75) };

/** Tarjeta de plan; resaltada cuando está seleccionada. */
export const getPlanCardSx = (selected) => ({
  cursor: "pointer",
  borderRadius: "12px",
  bgcolor: selected ? alpha(colors.primary, 0.06) : "background.paper",
  border: "2px solid",
  borderColor: selected ? "primary.light" : "divider",
  boxShadow: selected ? FOCUS_RING(colors.primaryLight) : "none",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "primary.main",
    bgcolor: alpha(colors.primary, 0.04),
  },
});
