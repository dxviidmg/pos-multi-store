import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

const storeService = createApiService("store");

export const getStores = storeService.getAll;

export const getStoreInvestment = async (store) => {
  const response = await httpClient.get(getApiUrl(`store/investments/${store.id}`), {
    headers: getHeaders(),
  });
  return response;
};

export const getInvestment = async () => {
  const response = await httpClient.get(getApiUrl("investments"), {
    headers: getHeaders(),
  });
  return response;
};
