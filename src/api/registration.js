import httpClient from "./httpClient";
import { getApiUrl, getHeaders, getUserData } from "./utils";

export const registerClient = async (data) => {
  const user = getUserData();
  const headers = user ? getHeaders() : { "Content-Type": "application/json" };
  const response = await httpClient.post(getApiUrl("client"), data, { headers });
  return response;
};
