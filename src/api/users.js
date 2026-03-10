import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

export const getUser = async (id) => {
  const response = await httpClient.get(getApiUrl(`user/${id}`), {
    headers: getHeaders(),
  });
  return response;
};

export const updateUser = async (id, data) => {
  const response = await httpClient.patch(getApiUrl(`user/${id}`), data, {
    headers: getHeaders(),
  });
  return response;
};
