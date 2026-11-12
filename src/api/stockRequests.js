import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

/**
 * Get stock update requests
 * @returns {Promise<Object>} Requests list response
 */
export const getStockUpdateRequests = async () => {
  return httpClient.get(getApiUrl("stock-update-request"));
};

/**
 * Create a stock update request
 * @param {Object} data - { store_product, requested_stock }
 * @returns {Promise<Object>} Created request response
 */
export const createStockUpdateRequest = async (data) => {
  return httpClient.post(getApiUrl("stock-update-request"), data);
};

/**
 * Approve (apply) a stock update request
 * @param {number|string} id - Request ID
 * @returns {Promise<Object>} Approval response
 */
export const approveStockUpdateRequest = async (id) => {
  return httpClient.post(getApiUrl(`stock-update-request/${id}/approve`), {});
};

/**
 * Delete a stock update request
 * @param {number|string} id - Request ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteStockUpdateRequest = async (id) => {
  return httpClient.delete(getApiUrl(`stock-update-request/${id}`));
};
