import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

/**
 * Get audit logs (type 1)
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Audit logs response
 */
export const getAudit = async (params) => {
  const url = buildUrlWithParams(getApiUrl("audit1"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get audit logs (type 2)
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Audit logs response
 */
export const getAudit2 = async (params) => {
  const url = buildUrlWithParams(getApiUrl("audit2"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};