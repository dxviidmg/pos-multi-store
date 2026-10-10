import Swal from "sweetalert2";
import { colors } from "../theme/colors";

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

/**
 * Confirmación con botones Confirmar/Cancelar. Por defecto es de eliminación.
 * `options` permite personalizar los textos de los botones, el color de confirmar y el ícono.
 */
export const showConfirm = async (
  title,
  text = "",
  { confirmText = "Eliminar", cancelText = "Cancelar", confirmColor = colors.error, icon = "warning" } = {}
) => {
  const result = await Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: confirmColor,
  });
  return result.isConfirmed;
};
