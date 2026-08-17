import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl, buildUrlWithParams } from "./utils";

const storeService = createApiService("store");

export const getStores = storeService.getAll;
export const createStore = storeService.create;

export const getStoresCashSummary = async (params) => {
  const url = buildUrlWithParams(getApiUrl("stores-cash-summary"), params);
  return httpClient.get(url);
};

export const getInvestment = async (storeId = null) => {
  const url = storeId ? `store/${storeId}/investment` : "investment";
  return httpClient.get(getApiUrl(url));
};

/**
 * Check if the tenant can create more stores
 * @returns {Promise<Object>} { can_create: boolean, remaining: number }
 */
export const canCreateStore = async () => {
  return httpClient.get(getApiUrl("can-create-store"));
};

/**
 * Reset store stock
 * @param {number} storeId - Store ID
 * @returns {Promise<Object>} Reset response
 */
export const resetStoreStock = async (storeId) => {
  return httpClient.post(getApiUrl(`store/${storeId}/reset-stock/`, false), {});
};
