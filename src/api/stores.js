import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

/**
 * Get stores list with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Stores list response
 */
export const getStores = async (params) => {
  const url = buildUrlWithParams(getApiUrl("store"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get investment data for specific store
 * @param {Object} store - Store object with ID
 * @returns {Promise<Object>} Store investment data
 */
export const getStoreInvestment = async (store) => {
  const response = await httpClient.get(getApiUrl(`store/investments/${store.id}`), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get total investments across all stores
 * @returns {Promise<Object>} Total investments data
 */
export const getInvestment = async () => {
  const response = await httpClient.get(getApiUrl("investments"), {
    headers: getHeaders(),
  });
  return response;
};
