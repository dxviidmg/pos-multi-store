import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl, buildUrlWithParams } from "./utils";

const sellerService = createApiService("store-worker");

export const getSellers = sellerService.getAll;
export const createSeller = sellerService.create;

export const checkWorkerExists = async (username, config) => {
  const response = await httpClient.get(buildUrlWithParams(getApiUrl("worker-exists"), { username }), config);
  return response.data;
};
