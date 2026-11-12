const PHONE_ERRORS = {
  "Ensure this field has at least 10 characters.": "El teléfono debe tener al menos 10 dígitos.",
  "client with this phone number already exists.": "El teléfono ya está registrado.",
};

/**
 * Traduce el primer error de `phone_number` que devuelve el backend (DRF).
 * @param {string[]|undefined} phoneErrors - error.response.data.phone_number
 * @returns {string|null} Motivo en español, o null si no es un error conocido
 */
export const parsePhoneError = (phoneErrors) => PHONE_ERRORS[phoneErrors?.[0]] ?? null;
