import { useMutation } from "@tanstack/react-query";
import { createTenant } from "../api/registration";
import { showSuccess, showWarning, showRequestError, SUPPORT_HINT } from "../utils/alerts";
import { parsePhoneError } from "../utils/apiErrors";

const registrationErrorParser = (error) => {
  if (error.response?.status === 400) {
    const data = error.response.data;
    if (data.short_name) {
      return "Este identificador ya está en uso o no es válido.";
    }
    if (data.name) {
      return "El nombre del negocio es requerido.";
    }
    const phoneError = parsePhoneError(data.phone_number);
    if (phoneError) return phoneError;
    if (data.email) {
      return "El correo electrónico no es válido o ya está registrado.";
    }
    if (data.first_name) {
      return "El nombre es requerido.";
    }
  }
  return null;
};

export const useCreateTenant = (options = {}) => {
  return useMutation({
    mutationFn: createTenant,
    onSuccess: (data, variables, context) => {
      showSuccess("Negocio registrado", "Tu negocio ha sido creado.");
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const reason = registrationErrorParser(error);
      if (reason) {
        showWarning("No se pudo registrar el negocio", reason);
      } else {
        showRequestError("registrar el negocio", error);
      }
      options?.onError?.(error, variables, context, reason || SUPPORT_HINT);
    },
  });
};
