import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import Logo from "../../../assets/images/logo-white.svg";
import {
  headerBannerSx, headerTitleSx, headerSubtitleSx,
  stepIndicatorSx, stepCountSx, progressBarSx,
} from "./Registration.styles";

/** Banner con el logo y barra de progreso del paso actual. */
const RegistrationHeader = ({ activeStep, stepLabels }) => (
  <>
    <Box sx={headerBannerSx}>
      <Box
        component="img"
        src={Logo}
        alt="SmartVenta"
        sx={{ width: "100%", height: "auto", display: "block", mx: "auto", mb: 2 }}
      />
      <Typography variant="h5" sx={headerTitleSx}>
        Crea tu cuenta
      </Typography>
      <Typography sx={headerSubtitleSx}>
        Configura tu negocio en un par de minutos
      </Typography>
    </Box>

    <Box sx={{ px: 4, pt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography sx={stepIndicatorSx}>
          Paso {activeStep + 1} de {stepLabels.length}
        </Typography>
        <Typography sx={stepCountSx}>
          {stepLabels[activeStep]}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={((activeStep + 1) / stepLabels.length) * 100}
        sx={progressBarSx}
      />
    </Box>
  </>
);

export default RegistrationHeader;
