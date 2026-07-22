import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

const API_KEY = process.env.REACT_APP_API_URL_KEY;

const tenantHeaders = {
  "Content-Type": "application/json",
  "X-API-Key": API_KEY,
};

export const checkTenantExists = async (short_name) => {
  const response = await httpClient.get(getApiUrl("tenant-exists"), {
    params: { short_name },
    headers: tenantHeaders,
  });
  return response.data;
};

export const createTenant = async (data) => {
  const response = await httpClient.post(getApiUrl("create-tenant"), data, {
    headers: tenantHeaders,
  });
  return response;
};

export const registerClient = async (data) => {
  const response = await httpClient.post(getApiUrl("client"), data);
  return response;
};
