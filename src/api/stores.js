import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

const storeService = createApiService("store");

export const getStores = storeService.getAll;

export const getStoresCashSummary = async (params) => {
  const url = buildUrlWithParams(getApiUrl("stores-cash-summary"), params);
  const response = await httpClient.get(url, { headers: getHeaders() });
  return response;
};

export const getStoreInvestment = async (store) => {
  const response = await httpClient.get(getApiUrl(`store/${store.id}/investment`), {
    headers: getHeaders(),
  });
  return response;
};

export const getInvestment = async (storeId = null) => {
  const url = storeId ? `store/${storeId}/investment` : "investment";
  const response = await httpClient.get(getApiUrl(url), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Reset store stock
 * @param {number} storeId - Store ID
 * @returns {Promise<Object>} Reset response
 */
export const resetStoreStock = async (storeId) => {
  const response = await httpClient.post(getApiUrl(`store/${storeId}/reset-stock/`, false), {}, {
    headers: getHeaders(),
  });
  return response;
};
