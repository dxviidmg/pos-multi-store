import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomButton from "../../ui/Button/Button";
import { successIconSx, primaryButtonSx } from "./Registration.styles";

const credentialsBoxSx = {
  mb: 2.5, px: 2, py: 1.5,
  borderRadius: "10px",
  bgcolor: "action.hover",
  border: "1px solid",
  borderColor: "divider",
};

/** Pantalla final con el usuario predeterminado del dueño. */
const RegistrationSuccess = ({ ownerUsername, onLogin, onRegisterAnother }) => (
  <Box sx={{ px: 4, py: 4, textAlign: "center" }}>
    <Box sx={successIconSx}>
      <CheckCircleIcon sx={{ fontSize: 24, color: "success.main" }} />
    </Box>
    <Typography sx={{ fontSize: "1.25rem", fontWeight: 700, color: "text.primary", mb: 0.5 }}>
      ¡Listo!
    </Typography>
    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1, lineHeight: 1.6 }}>
      Tu negocio ha sido registrado.<br />
      Tu pago se procesa en un máximo de 24 horas.<br />
      Por el momento, ya puedes iniciar sesión.
    </Typography>
    {ownerUsername && (
      <Box sx={credentialsBoxSx}>
        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mb: 0.75 }}>
          Usuario y contraseña predeterminados:
        </Typography>
        <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "primary.main", fontFamily: "monospace", letterSpacing: "0.5px" }}>
          {ownerUsername}
        </Typography>
        <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", mt: 0.75, lineHeight: 1.5 }}>
          Usa este mismo valor como usuario y contraseña para tu primer inicio de sesión.
        </Typography>
      </Box>
    )}
    <CustomButton onClick={onLogin} fullWidth sx={primaryButtonSx}>
      Iniciar sesión
    </CustomButton>
    <Typography
      sx={{
        mt: 2, fontSize: "0.8rem", color: "text.secondary",
        fontWeight: 500, cursor: "pointer",
        "&:hover": { color: "primary.main" },
      }}
      onClick={onRegisterAnother}
    >
      Registrar otro negocio
    </Typography>
  </Box>
);

export default RegistrationSuccess;
