import Swal from "sweetalert2";

export const showAlert = (icon, title, text = "", timer = 5000) => {
  Swal.fire({ icon, title, text, timer });
};

export const showSuccess = (title, text = "") => {
  showAlert("success", title, text);
};

export const showError = (title, text = "") => {
  showAlert("error", title, text);
};

export const showWarning = (title, text = "") => {
  showAlert("warning", title, text);
};

export const SUPPORT_HINT = "Intenta de nuevo. Si continúa, contacta a soporte.";

const getErrorDetail = (source) => {
  const data = source?.response?.data ?? source?.data;
  return [data?.message, data?.error, data?.detail].find((v) => typeof v === "string" && v.trim());
};

/**
 * Alerta para una petición fallida. `action` es el verbo + objeto: "eliminar la marca".
 * - 4xx con motivo del servidor → advertencia "No se pudo …" (el usuario puede corregirlo).
 * - Cualquier otro caso → error "Error al …" con indicación de contactar a soporte.
 */
export const showRequestError = (action, source) => {
  const status = source?.response?.status ?? source?.status;
  const detail = getErrorDetail(source);
  if (status >= 400 && status < 500 && detail) {
    showWarning(`No se pudo ${action}`, detail);
  } else {
    showError(`Error al ${action}`, SUPPORT_HINT);
  }
};

export const showConfirm = async (title, text = "") => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
  });
  return result.isConfirmed;
};
