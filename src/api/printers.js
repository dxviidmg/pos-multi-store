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


