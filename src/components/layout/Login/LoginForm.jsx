import React from "react";
import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import { TextField } from "../../ui/Field/Field";
import CustomButton from "../../ui/Button/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { colors } from "../../../theme/colors";
import {
  desktopLabelSx, mobileInputSx,
  desktopPrimaryButtonSx, mobilePrimaryButtonSx,
  desktopSecondaryButtonSx, mobileSecondaryButtonSx,
} from "./Login.styles";

const VARIANTS = {
  desktop: {
    input: desktopLabelSx,
    primaryButton: desktopPrimaryButtonSx,
    secondaryButton: desktopSecondaryButtonSx,
    spinnerColor: colors.white,
  },
  mobile: {
    input: mobileInputSx,
    primaryButton: mobilePrimaryButtonSx,
    secondaryButton: mobileSecondaryButtonSx,
    spinnerColor: colors.sidebar,
  },
};

/**
 * Formulario de inicio de sesión. `variant` ("desktop" sobre una tarjeta, "mobile" sobre el
 * fondo de marca) solo cambia los estilos; los dos comparten campos, textos y comportamiento.
 */
const LoginForm = ({
  variant, formData, error, showPassword, passwordAdornment,
  isLoading, isFormEmpty, onChange, onSubmit, onRegister,
}) => {
  const styles = VARIANTS[variant];

  return (
    <>
      {error && (
        <Alert severity="error" icon={<ErrorOutlineIcon fontSize="small" />} sx={{ mb: 3, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      <Stack component="form" onSubmit={onSubmit} spacing={2.5}>
        <TextField fullWidth name="username" label="Usuario" placeholder="Ingresa tu usuario"
          value={formData.username} onChange={onChange}
          required autoFocus autoComplete="username" size="small"
          sx={styles.input}
        />

        <TextField fullWidth name="password" label="Contraseña" placeholder="Ingresa tu contraseña"
          type={showPassword ? "text" : "password"}
          value={formData.password} onChange={onChange}
          required autoComplete="current-password" size="small"
          sx={styles.input}
          InputProps={{ endAdornment: passwordAdornment }}
        />

        <CustomButton type="submit" fullWidth
          disabled={isLoading || isFormEmpty}
          startIcon={isLoading ? <CircularProgress size={18} sx={{ color: styles.spinnerColor }} /> : <LoginIcon />}
          sx={styles.primaryButton}
        >
          {isLoading ? "Iniciando sesión…" : "Iniciar sesión"}
        </CustomButton>

        <Button onClick={onRegister} fullWidth
          variant="outlined" startIcon={<PersonAddIcon />}
          sx={styles.secondaryButton}
        >
          Crear mi negocio
        </Button>
      </Stack>
    </>
  );
};

export default LoginForm;
