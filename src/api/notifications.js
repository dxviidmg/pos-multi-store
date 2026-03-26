import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

export const getPendingMovements = async () => {
  const response = await httpClient.get(getApiUrl("pending-movements"), {
    headers: getHeaders(),
  });
  return response;
};
