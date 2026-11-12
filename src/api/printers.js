import httpClient from "./httpClient";
import { getPrinterUrl, getUserData, getApiUrl } from "./utils";

/**
 * Send print job to printer service
 * @param {string} endpoint - Printer endpoint
 * @param {Object} data - Print data
 * @returns {Promise<Object>} Print response
 */
export const getPrint = async (endpoint, data) => {
  const printerUrl = getPrinterUrl(endpoint);
  const user = getUserData();
  
  const printData = {
    ...data,
    token: user.token,
    api_url: getApiUrl('store-printer'),
    store_printer: user.store_printer,
  };

  return httpClient.post(printerUrl, printData);
};

/**
 * Test printer connection
 * @returns {Promise<{connected: boolean, error?: string}>} Connection status
 */
export const testPrinterConnection = async () => {
  try {
    await httpClient.get(getPrinterUrl("status"), { timeout: 3000 });
    return { connected: true };
  } catch (error) {
    if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK" || !error.response) {
      return { connected: false, error: "Iniciar servidor de impresora" };
    }
    if (error.response?.status === 503) {
      return { connected: false, error: error.response.data?.error || "Impresora no disponible" };
    }
    return { connected: false, error: "Error de conexión" };
  }
};
