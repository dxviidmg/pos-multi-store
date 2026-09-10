import httpClient from "@/src/api/httpClient";
import { getApiUrl } from "@/src/api/utils";

export const getPendingMovements = async () => {
  return httpClient.get(getApiUrl("pending-movements"));
};

export const getDuplicateSales = async () => {
  return httpClient.get(getApiUrl("duplicate-sales"));
};

export const getStockUpdateRequests = async () => {
  return httpClient.get(getApiUrl("stock-update-request"));
};
