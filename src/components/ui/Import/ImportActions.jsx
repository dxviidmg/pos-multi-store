import React from "react";
import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PublishIcon from "@mui/icons-material/Publish";
import CustomButton from "../Button/Button";
import CustomTooltip from "../Tooltip";

/** Botón "Validar" con el resultado de la validación (exitosos / con error). */
export const ImportValidateButton = ({ onClick, disabled, validationResult }) => {
  const hasErrors = validationResult?.errors > 0;
  return (
    <>
      <CustomButton
        onClick={onClick}
        disabled={disabled}
        fullWidth
        color={hasErrors ? "error" : "primary"}
        startIcon={hasErrors
          ? <ErrorIcon sx={{ color: "error.main" }} />
          : <CheckCircleIcon sx={{ color: disabled ? "inherit" : "success.main" }} />
        }
      >
        {validationResult ? (hasErrors ? "Tiene errores" : "Validado") : "Validar"}
      </CustomButton>
      {validationResult && (
        <>
          <Chip icon={<CheckCircleIcon />} label={`${validationResult.successes} exitosos`} color="success" variant="outlined" />
          <Chip icon={<ErrorIcon />} label={`${validationResult.errors} con error`} color="error" variant="outlined" />
        </>
      )}
    </>
  );
};

/** Botón "Importar"; solo se habilita con el archivo validado sin errores. */
export const ImportSubmitButton = ({ onClick, canImport }) => (
  <CustomTooltip text={canImport ? "" : "Primero valida el archivo sin errores"} position="bottom" fullWidth>
    <CustomButton
      onClick={onClick}
      fullWidth
      disabled={!canImport}
      startIcon={<PublishIcon sx={{ color: canImport ? "success.main" : "inherit" }} />}
    >
      Importar
    </CustomButton>
  </CustomTooltip>
);
