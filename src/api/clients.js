import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

/**
 * Get clients list with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Clients list response
 */
export const getClients = async (params) => {
  const url = buildUrlWithParams(getApiUrl("client"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Create new client
 * @param {Object} data - Client data
 * @returns {Promise<Object>} Created client response
 */
export const createClient = async (data) => {
  const response = await httpClient.post(getApiUrl("client"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Update client information
 * @param {Object} data - Client data with ID
 * @returns {Promise<Object>} Updated client response
 */
export const updateClient = async (data) => {
  const response = await httpClient.patch(getApiUrl(`client/${data.id}`), data, {
    headers: getHeaders(),
  });
  return response;
};
