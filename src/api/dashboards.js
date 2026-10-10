import httpClient from "./httpClient";
import { getApiUrl, buildUrlWithParams } from "./utils";

/**
 * Start pending transfers dashboard task
 * @returns {Promise<Object>} Response with data.task (task id)
 */
export const getPendingTransfersDashboard = async () => {
  return httpClient.get(getApiUrl("pending-transfers-dashboard"));
};

/**
 * Start stock verification dashboard task
 * @returns {Promise<Object>} Response with data.task (task id)
 */
export const getStockVerificationDashboard = async () => {
  return httpClient.get(getApiUrl("stock-verification-dashboard"));
};

/**
 * Start products dashboard task
 * @param {Object} params - { year, month, store_id? }
 * @returns {Promise<Object>} Response with data.task (task id)
 */
export const getProductsDashboard = async (params) => {
  const url = buildUrlWithParams(getApiUrl("products-dashboard"), params);
  return httpClient.get(url);
};

/**
 * Start cancellations dashboard task
 * @param {Object} params - { year, month }
 * @returns {Promise<Object>} Response with data.task (task id)
 */
export const getCancellationsDashboard = async (params) => {
  const url = buildUrlWithParams(getApiUrl("sales-dashboard-cancellations"), params);
  return httpClient.get(url);
};
