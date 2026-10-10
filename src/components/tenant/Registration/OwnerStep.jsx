import React from "react";
import { Grid, TextField, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomButton from "../../ui/Button/Button";
import { inputSx, primaryButtonSx, secondaryButtonSx } from "./Registration.styles";

/** Paso 2: datos del propietario. */
const OwnerStep = ({ formData, onChange, isValid, onBack, onNext }) => (
  <Box>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          fullWidth size="small"
          label="Nombre"
          name="first_name"
          value={formData.first_name}
          onChange={onChange}
          required
          autoFocus
          placeholder="Tu nombre"
          sx={inputSx}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth size="small"
          label="Apellidos"
          name="last_name"
          value={formData.last_name}
          onChange={onChange}
          placeholder="Tus apellidos"
          sx={inputSx}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth size="small"
          label="Correo electrónico"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          type="email"
          placeholder="correo@ejemplo.com"
          sx={inputSx}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth size="small"
          label="Teléfono"
          name="phone_number"
          value={formData.phone_number}
          onChange={onChange}
          required
          type="tel"
          placeholder="10 dígitos"
          sx={inputSx}
        />
      </Grid>
    </Grid>

    <Box sx={{ display: "flex", gap: 1.5, mt: 2.5 }}>
      <CustomButton
        onClick={onBack}
        startIcon={<ArrowBackIcon sx={{ fontSize: "16px !important" }} />}
        sx={secondaryButtonSx}
      >
        Atrás
      </CustomButton>
      <CustomButton
        onClick={onNext}
        disabled={!isValid}
        fullWidth
        endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
        sx={primaryButtonSx}
      >
        Continuar
      </CustomButton>
    </Box>
  </Box>
);

export default OwnerStep;
