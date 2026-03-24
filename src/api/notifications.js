import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

export const getOwnerNotifications = async () => {
  const response = await httpClient.get(getApiUrl("notifications"), {
    headers: getHeaders(),
  });
  return response;
};
