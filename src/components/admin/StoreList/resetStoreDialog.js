import Swal from "sweetalert2";
import { colors } from "../../../theme/colors";
import { resetStoreStock } from "../../../api/stores";
import { showRequestError, showSuccess } from "../../../utils/alerts";

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

/**
 * "Vaciar stock": pide escribir el nombre de la sucursal para confirmar y vacía su stock.
 * Usa `Swal.fire` directo (excepción documentada: diálogo con input, validador y `didOpen`).
 */
export const resetStoreWithConfirm = async (storeId, storeName) => {
  const result = await Swal.fire({
    title: "¿Vaciar stock de la tienda?",
    html: `
      <p>¿Estás seguro de vaciar el stock de <strong>${escapeHtml(storeName)}</strong>?</p>
      <p style="color: ${colors.error}; font-weight: 600;">Esta acción no se puede deshacer.</p>
      <p style="margin-top: 16px;">Escribe el nombre de la tienda para confirmar:</p>
    `,
    input: "text",
    inputPlaceholder: storeName,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: colors.primary,
    cancelButtonColor: colors.primaryLight,
    inputValidator: (value) => {
      if (value !== storeName) {
        return "El nombre de la tienda no coincide";
      }
    },
    didOpen: () => {
      const confirmButton = Swal.getConfirmButton();
      const input = Swal.getInput();
      confirmButton.disabled = true;

      input.addEventListener("input", (e) => {
        confirmButton.disabled = e.target.value !== storeName;
      });
    },
  });

  if (!result.isConfirmed) return;

  try {
    await resetStoreStock(storeId);
    showSuccess("Stock vaciado", "Stock de la tienda vaciado");
  } catch (error) {
    showRequestError("vaciar el stock de la tienda", error);
  }
};
