import { getPrint } from "../api/printers";
import { showAlert } from "./alerts";

export const handlePrintTicket = async (endpoint, data) => {
  try {
    await getPrint(endpoint, data);
    showAlert("success", "Imprimiendo");
  } catch (error) {
    showAlert("warning", "No se pudo conectar a la impresora", "Verifique que la impresora esté encendida, conectada y que el servidor de impresión esté funcionando.");
  }
};

export const PRINT_STATUS = { OK: "ok", ERROR: "error", PENDING: "pending" };

const PRINT_WAIT_MS = 1500;
const PRINT_ERROR_TITLE = "No se pudo imprimir el ticket";
const PRINT_ERROR_HINT = "Verifique que la impresora esté encendida, conectada y que el servidor de impresión esté funcionando.";

/**
 * Envía el ticket sin mostrar alertas y espera hasta PRINT_WAIT_MS el resultado
 * (`ok`, `error` o `pending` si la impresora aún no responde). Si responde con error
 * después de ese plazo, lo avisa con una advertencia.
 */
export const printTicketQuietly = (endpoint, data) => {
  let settled = false;
  const request = getPrint(endpoint, data).then(
    () => PRINT_STATUS.OK,
    () => PRINT_STATUS.ERROR,
  );
  const wait = new Promise((resolve) => setTimeout(() => resolve(PRINT_STATUS.PENDING), PRINT_WAIT_MS));

  request.then((status) => {
    if (status === PRINT_STATUS.ERROR && settled) showAlert("warning", PRINT_ERROR_TITLE, PRINT_ERROR_HINT);
  });

  return Promise.race([request, wait]).then((status) => {
    settled = status === PRINT_STATUS.PENDING;
    return status;
  });
};

/** Texto del aviso de venta según el resultado de la impresión: imprimiendo, error o nada. */
export const getPrintStatusText = (status) => {
  if (status === PRINT_STATUS.ERROR) return `${PRINT_ERROR_TITLE}. ${PRINT_ERROR_HINT}`;
  return status ? "Imprimiendo ticket" : "";
};
