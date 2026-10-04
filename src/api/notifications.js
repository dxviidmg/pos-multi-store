import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

export const getPendingMovements = async () => {
  return httpClient.get(getApiUrl("pending-movements"));
};

export const getDuplicateSales = async () => {
  return httpClient.get(getApiUrl("duplicate-sales"));
};

export const getStockUpdateRequests = async () => {
  return httpClient.get(getApiUrl("stock-update-request"));
};

/**
 * Notificaciones recientes (respaldo cuando el WebSocket no logra conectarse).
 * Mismo formato que los mensajes del WebSocket: { event, message, store_id, store_name }.
 */
export const getNotifications = async () => {
  return httpClient.get(getApiUrl("audit/notifications"));
};
