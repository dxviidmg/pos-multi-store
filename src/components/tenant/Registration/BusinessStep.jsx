import React from "react";
import { TextField, Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CustomButton from "../../ui/Button/Button";
import ShortNameStatusAdornment from "./ShortNameStatusAdornment";
import { inputSx, primaryButtonSx, getShortNameInputSx } from "./Registration.styles";

const capitalizeWords = (value) => value.toLowerCase().replace(/\b(\w)/g, (m) => m.toUpperCase());

const sanitizeShortName = (value) => value.toLowerCase().replace(/[^a-z0-9.]/g, "");

const getShortNameSuggestions = (shortName) => {
  const base = shortName.trim();
  return [`${base.slice(0, 4)}1`, `${base.slice(0, 3)}mx`, `${base.slice(0, 3)}26`];
};

const suggestionSx = {
  fontSize: "0.7rem",
  px: 1,
  py: 0.25,
  borderRadius: "6px",
  border: "1px solid",
  borderColor: "divider",
  color: "text.primary",
  cursor: "pointer",
  fontFamily: "monospace",
  fontWeight: 500,
  transition: "all 0.15s ease",
  "&:hover": {
    bgcolor: "action.hover",
    borderColor: "primary.main",
  },
};

/** Paso 1: nombre y clave única del negocio (con verificación de disponibilidad). */
const BusinessStep = ({ formData, setField, shortNameStatus, isValid, onNext }) => (
  <Box>
    <Box sx={{ mb: 2.5 }}>
      <TextField
        fullWidth size="small"
        label="Nombre del negocio"
        name="name"
        value={formData.name}
        onChange={(e) => setField("name", capitalizeWords(e.target.value))}
        required
        placeholder="Ej: Mi Tienda"
        inputProps={{ autoCapitalize: "none", autoCorrect: "off" }}
        sx={inputSx}
      />
    </Box>

    <Box sx={{ mb: 1 }}>
      <TextField
        fullWidth size="small"
        label="Clave de tu negocio"
        helperText="Identificador único para tu negocio, verifica disponibilidad"
        name="short_name"
        value={formData.short_name}
        onChange={(e) => setField("short_name", sanitizeShortName(e.target.value))}
        required
        placeholder="Ej: mitienda, mi.tienda, mt, tiendita, tienda, mtnd, abc, wyz"
        inputProps={{
          maxLength: 10,
          autoCapitalize: "none",
          autoCorrect: "off",
          autoComplete: "off",
          spellCheck: false,
          style: { letterSpacing: "0.5px", textTransform: "lowercase" },
        }}
        InputProps={{
          endAdornment: formData.short_name.trim() && <ShortNameStatusAdornment status={shortNameStatus} />,
        }}
        sx={getShortNameInputSx(shortNameStatus)}
      />

      {shortNameStatus === "taken" && (
        <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
          <Typography sx={{ fontSize: "0.68rem", color: "text.secondary" }}>
            Prueba con:
          </Typography>
          {getShortNameSuggestions(formData.short_name).map((suggestion) => (
            <Box key={suggestion} onClick={() => setField("short_name", suggestion)} sx={suggestionSx}>
              {suggestion}
            </Box>
          ))}
        </Box>
      )}
    </Box>

    <CustomButton
      onClick={onNext}
      disabled={!isValid}
      fullWidth
      endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
      sx={{ mt: 0.5, ...primaryButtonSx }}
    >
      Continuar
    </CustomButton>
  </Box>
);

export default BusinessStep;
