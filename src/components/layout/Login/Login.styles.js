import { alpha } from "@mui/material/styles";
import { colors } from "../../../theme/colors";

// Label más oscuro y con peso para mejorar el contraste (WCAG) en la tarjeta clara de escritorio.
export const desktopLabelSx = {
  "& label": { color: "text.primary", fontWeight: 500 },
};

// Fondo blanco y texto oscuro para los inputs sobre el fondo navy del móvil (solo modo claro).
export const mobileInputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: colors.white,
    "& input": { color: (theme) => theme.palette.text.primary },
  },
};

// Botón principal de escritorio: navy sobre tarjeta clara.
export const desktopPrimaryButtonSx = {
  py: 1.25, mt: 1, borderRadius: "10px", fontWeight: 700, fontSize: "0.95rem",
  background: colors.sidebar,
  color: colors.white,
  boxShadow: colors.shadow.brand,
  "&:hover": {
    background: colors.sidebarDark,
    boxShadow: colors.shadow.brandHover,
  },
  "&.Mui-disabled": {
    background: alpha(colors.sidebar, 0.4),
    color: alpha(colors.white, 0.7),
    boxShadow: "none",
  },
};

// Botón principal de móvil: blanco sobre el fondo navy, para que destaque.
export const mobilePrimaryButtonSx = {
  py: 1.25, mt: 1, borderRadius: "10px", fontWeight: 700, fontSize: "0.95rem",
  background: colors.white,
  color: colors.sidebar,
  boxShadow: colors.shadow.brand,
  "&:hover": {
    background: alpha(colors.white, 0.9),
    boxShadow: colors.shadow.brandHover,
  },
  "&.Mui-disabled": {
    background: alpha(colors.white, 0.7),
    color: alpha(colors.sidebar, 0.5),
  },
};

// Botón secundario ("Crear mi negocio") de escritorio: outline azul con fill ligero.
export const desktopSecondaryButtonSx = {
  py: 1, borderRadius: "10px", fontWeight: 600, fontSize: "0.85rem",
  borderColor: "primary.main", color: "primary.main",
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
  "&:hover": {
    borderColor: "primary.dark", color: "primary.dark",
    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
  },
};

// Botón secundario ("Crear mi negocio") de móvil: outline blanco con fill ligero.
export const mobileSecondaryButtonSx = {
  py: 1, borderRadius: "10px", fontWeight: 600, fontSize: "0.85rem",
  borderColor: alpha(colors.white, 0.5), color: colors.white,
  bgcolor: alpha(colors.white, 0.08),
  "&:hover": {
    borderColor: colors.white, color: colors.white,
    bgcolor: alpha(colors.white, 0.16),
  },
};
