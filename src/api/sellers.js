import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

/**
 * Get sellers/workers list with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Sellers list response
 */
export const getSellers = async (params) => {
  const url = buildUrlWithParams(getApiUrl("store-worker"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Create new seller/worker
 * @param {Object} data - Seller data
 * @returns {Promise<Object>} Created seller response
 */
export const createSeller = async (data) => {
  const response = await httpClient.post(getApiUrl("store-worker"), data, {
    headers: getHeaders(),
  });
  return response;
};
