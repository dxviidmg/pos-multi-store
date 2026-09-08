export const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontSize: "0.9rem",
    backgroundColor: "rgba(255,255,255,0.95)",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
    "&.Mui-focused fieldset": {
      borderColor: "#a78bfa",
      boxShadow: "0 0 0 3px rgba(167,139,250,0.15)",
    },
  },
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
  background: "linear-gradient(135deg, rgba(4,52,107,0.85) 0%, rgba(6,90,158,0.75) 100%)",
  backdropFilter: "blur(2px)",
  zIndex: 0,
};

export const formPaperSx = {
  position: "relative", zIndex: 1,
  width: "100%", maxWidth: 600, mx: 2,
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "16px", overflow: "hidden auto",
  background: "rgba(4,52,107,0.95)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
  // Ocultar la barra de scroll (el contenido sigue siendo desplazable)
  scrollbarWidth: "none",        // Firefox
  msOverflowStyle: "none",       // IE / Edge legacy
  "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
};

export const successIconSx = {
  width: 48, height: 48, borderRadius: "50%",
  background: "rgba(52, 211, 153, 0.15)",
  display: "flex", alignItems: "center", justifyContent: "center",
  mx: "auto", mb: 2,
};

export const labelSx = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "rgba(255,255,255,0.85)",
  mb: 0.5,
};

export const stepIndicatorSx = {
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "rgba(255,255,255,0.85)",
};

export const stepCountSx = {
  fontSize: "0.75rem",
  color: "rgba(255,255,255,0.5)",
};

export const progressBarSx = {
  height: 3,
  borderRadius: 2,
  backgroundColor: "rgba(255,255,255,0.1)",
  "& .MuiLinearProgress-bar": {
    borderRadius: 2,
    background: "linear-gradient(90deg, #a78bfa 0%, #7c5cbf 100%)",
  },
};
