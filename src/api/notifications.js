import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

export const getPendingMovements = async () => {
  return httpClient.get(getApiUrl("pending-movements"));
};

export const getDuplicateSales = async () => {
  return httpClient.get(getApiUrl("duplicate-sales"));
};
