import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

export const getUser = async (id) => {
  return httpClient.get(getApiUrl(`user/${id}`));
};

export const updateUser = async (id, data) => {
  return httpClient.patch(getApiUrl(`user/${id}`), data);
};

export const changePassword = async (_id, data) => {
  return httpClient.post(getApiUrl('user/change_password'), data);
};
