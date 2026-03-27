import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

export const getPendingMovements = async () => {
  const response = await httpClient.get(getApiUrl("pending-movements"), {
    headers: getHeaders(),
  });
  return response;
};

export const getDuplicateSales = async () => {
  const response = await httpClient.get(getApiUrl("duplicate-sales"), {
    headers: getHeaders(),
  });
  return response;
};

export const getStockUpdateRequests = async () => {
  const response = await httpClient.get(getApiUrl("stock-update-request"), {
    headers: getHeaders(),
  });
  return response;
};
