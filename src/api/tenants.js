import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

/**
 * Get available payment methods
 * @returns {Promise<Object>} Payment methods list
 */
export const getPayments = async () => {
  const response = await httpClient.get(getApiUrl("payment"), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get tenant information
 * @returns {Promise<Object>} Tenant configuration and details
 */
export const getTenantInfo = async () => {
  const response = await httpClient.get(getApiUrl("tenant-info"), {
    headers: getHeaders(),
  });
  return response;
};