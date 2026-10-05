import React from "react";
import { Step, StepLabel, Stepper } from "@mui/material";

const STEPPER_SX = {
  mb: 3,
  "& .MuiStepIcon-root.Mui-completed": { color: "success.main" },
  "& .MuiStepLabel-label.Mui-completed": { color: "success.main" },
};

/**
 * Pasos de una importación: Subir archivo → (Configurar) → Validar → Importar.
 * "Configurar" solo aparece con `withConfig`; `configured` indica que ya se llenaron las opciones.
 */
const ImportStepper = ({ hasFile, withConfig = false, configured = true, validated }) => {
  const steps = [
    "Subir archivo",
    ...(withConfig ? ["Configurar"] : []),
    validated ? "Validado" : "Validar",
    "Importar",
  ];
  const validateIndex = steps.length - 2;
  const activeStep = !hasFile ? 0 : withConfig && !configured ? 1 : !validated ? validateIndex : validateIndex + 1;

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={STEPPER_SX}>
      {steps.map((label, index) => (
        <Step key={label} completed={index < activeStep || (index === validateIndex && validated)}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default ImportStepper;
