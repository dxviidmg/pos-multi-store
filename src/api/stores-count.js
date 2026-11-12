import { getApiUrl } from "./utils";
import httpClient from "./httpClient";

export const fetchStoresCount = async () => {
  const url = getApiUrl("stores-count");
  const response = await httpClient.get(url);
  return response.data;
};
