export const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
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
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
};

export const overlayGradientSx = {
  position: "absolute", inset: 0,
  background: "linear-gradient(135deg, rgba(4,52,107,0.85) 0%, rgba(6,90,158,0.75) 100%)",
  backdropFilter: "blur(2px)",
};

export const formPaperSx = {
  position: "relative", zIndex: 1,
  width: "100%", maxWidth: 600, mx: 2,
  borderRadius: 1, overflow: "hidden",
  background: "rgba(4,52,107,0.95)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
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

export const primaryButtonSx = {
  py: 1.3, borderRadius: 1, fontWeight: 700, fontSize: "0.9rem",
  background: "linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)",
  "&:hover": {
    background: "linear-gradient(135deg, #7c5cbf 0%, #6344a3 100%)",
    boxShadow: "0 6px 20px rgba(167,139,250,0.4)",
  },
};

export const secondaryButtonSx = {
  py: 1, borderRadius: 1, fontWeight: 600, fontSize: "0.85rem",
  color: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(255,255,255,0.15)",
  "&:hover": {
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.05)",
  },
};

export const planCardSx = (isSelected) => ({
  p: 2.5,
  borderRadius: 2,
  cursor: "pointer",
  border: isSelected
    ? "2px solid #a78bfa"
    : "1px solid rgba(255,255,255,0.1)",
  background: isSelected
    ? "rgba(167,139,250,0.1)"
    : "rgba(255,255,255,0.03)",
  transition: "all 0.2s ease",
  "&:hover": {
    border: "2px solid rgba(167,139,250,0.5)",
    background: "rgba(167,139,250,0.05)",
  },
});
