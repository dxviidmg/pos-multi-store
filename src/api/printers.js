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

  const response = await httpClient.post(printerUrl, printData);
  return response;
};

/**
 * Test printer connection
 * @returns {Promise<{connected: boolean, error?: string}>} Connection status
 */
export const testPrinterConnection = async () => {
  try {
    const response = await httpClient.get(getPrinterUrl("status"), { timeout: 3000 });
    if (response.status === 200) {
      return { connected: true };
    }
    return { connected: false, error: response.data?.error || "Error de impresora" };
  } catch (error) {
    if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK" || !error.response) {
      return { connected: false, error: "Servidor de impresora no iniciado" };
    }
    if (error.response?.status === 503) {
      return { connected: false, error: error.response.data?.error || "Impresora no disponible" };
    }
    return { connected: false, error: "Error de conexión" };
  }
};


