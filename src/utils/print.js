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
