import { getPrint } from "../api/printers";
import { showAlert } from "./alerts";

export const handlePrintTicket = async (endpoint, data) => {
  try {
    const response2 = await getPrint(endpoint, data);
    showAlert(
      response2.status === 200 ? "success" : "error",
      response2.status === 200 ? "Imprimiendo" : "Error de impresión",
    );
  } catch (error) {
    showAlert("warning", "No se pudo conectar a la impresora", "Verifique que la impresora esté encendida, conectada y que el servidor de impresión esté funcionando.");
  }
};
