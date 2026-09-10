export const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "0.9rem",
    backgroundColor: "background.paper",
    "&.Mui-focused fieldset": {
      borderColor: "#065a9e",
      borderWidth: "1px",
      boxShadow: "0 0 0 3px rgba(6,90,158,0.15)",
    },
  },
  "& label.Mui-focused": { color: "#065a9e" },
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
  boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
  // Ocultar la barra de scroll (el contenido sigue siendo desplazable)
  scrollbarWidth: "none",        // Firefox
  msOverflowStyle: "none",       // IE / Edge legacy
  "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
};

// Header superior de la card con azul fuerte
export const headerBannerSx = {
  background: "linear-gradient(135deg, #04346b 0%, #065a9e 100%)",
  px: 4, pt: 3.5, pb: 3,
  textAlign: "center",
};

export const successIconSx = {
  width: 48, height: 48, borderRadius: "50%",
  background: "rgba(17, 153, 142, 0.12)",
  display: "flex", alignItems: "center", justifyContent: "center",
  mx: "auto", mb: 2,
};

export const labelSx = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "text.primary",
  mb: 0.5,
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
  backgroundColor: "rgba(4,53,107,0.1)",
  "& .MuiLinearProgress-bar": {
    borderRadius: 2,
    background: "linear-gradient(90deg, #04346b 0%, #065a9e 100%)",
  },
};

// Botón primario con el gradiente azul de marca
export const primaryButtonSx = {
  py: 1.3,
  borderRadius: "10px",
  fontSize: "0.9rem",
  fontWeight: 700,
  background: "linear-gradient(135deg, #04346b 0%, #065a9e 100%)",
  color: "#fff",
  boxShadow: "0 4px 20px rgba(4,53,107,0.25)",
  "&:hover": {
    background: "linear-gradient(135deg, #022347 0%, #04346b 100%)",
    boxShadow: "0 8px 30px rgba(4,53,107,0.35)",
  },
  "&.Mui-disabled": {
    background: "rgba(4,53,107,0.12)",
    color: "rgba(4,53,107,0.35)",
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
