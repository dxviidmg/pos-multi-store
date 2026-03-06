import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

const storeService = createApiService("store");

export const getStores = storeService.getAll;

export const getStoreInvestment = async (store) => {
  const response = await httpClient.get(getApiUrl(`store/investment/${store.id}`), {
    headers: getHeaders(),
  });
  return response;
};

export const getInvestment = async (storeId = null) => {
  const url = storeId ? `investment/${storeId}` : "investment";
  const response = await httpClient.get(getApiUrl(url), {
    headers: getHeaders(),
  });
  return response;
};
