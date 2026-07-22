import { useMutation } from "@tanstack/react-query";
import { createTenant } from "../api/registration";
import { showSuccess, showError } from "../utils/alerts";

const registrationErrorParser = (error) => {
  if (error.response?.status === 400) {
    const data = error.response.data;
    if (data.short_name) {
      return "Este identificador ya está en uso o no es válido.";
    }
    if (data.name) {
      return "El nombre del negocio es requerido.";
    }
    if (data.phone_number) {
      const phoneError = data.phone_number[0];
      if (phoneError === "Ensure this field has at least 10 characters.") {
        return "El teléfono debe tener al menos 10 dígitos.";
      }
      if (phoneError === "client with this phone number already exists.") {
        return "El teléfono ya está registrado.";
      }
    }
    if (data.email) {
      return "El correo electrónico no es válido o ya está registrado.";
    }
    if (data.first_name) {
      return "El nombre es requerido.";
    }
  }
  return "Error desconocido. Por favor, intente nuevamente.";
};

export const useCreateTenant = (options = {}) => {
  return useMutation({
    mutationFn: createTenant,
    onSuccess: (data, variables, context) => {
      showSuccess("¡Registro exitoso!", "Tu negocio ha sido creado correctamente.");
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const message = registrationErrorParser(error);
      showError("Error", message);
      options?.onError?.(error, variables, context, message);
    },
  });
};
