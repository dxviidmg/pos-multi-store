import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

/**
 * Create new transfer between stores
 * @param {Object} data - Transfer data
 * @returns {Promise<Object>} Created transfer response
 */
export const createTransfer = async (data) => {
  const response = await httpClient.post(getApiUrl("transfer"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get all transfers
 * @returns {Promise<Object>} Transfers list response
 */
export const getTransfers = async () => {
  const response = await httpClient.get(getApiUrl("transfer"), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Confirm multiple transfers
 * @param {Object} data - Transfer IDs to confirm
 * @returns {Promise<Object>} Confirmation response
 */
export const confirmTransfers = async (data) => {
  const response = await httpClient.post(getApiUrl("transfers/confirm"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Confirm product distribution
 * @param {Object} data - Distribution data
 * @returns {Promise<Object>} Confirmation response
 */
export const confirmDistribution = async (data) => {
  const response = await httpClient.post(
    getApiUrl("store-product/distribution/confirm"),
    data,
    {
      headers: getHeaders(),
    }
  );
  return response;
};

/**
 * Delete transfer by ID
 * @param {number|string} id - Transfer ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTransfer = async (id) => {
  const response = await httpClient.delete(getApiUrl(`transfer/${id}`), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Create new distribution
 * @param {Object} data - Distribution data
 * @returns {Promise<Object>} Created distribution response
 */
export const createDistribution = async (data) => {
  const response = await httpClient.post(getApiUrl("distribution"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get all distributions
 * @returns {Promise<Object>} Distributions list response
 */
export const getDistributions = async () => {
  const response = await httpClient.get(getApiUrl("distribution"), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Update transfer
 * @param {Object} data - Transfer data with ID
 * @returns {Promise<Object>} Updated transfer response
 */
export const updateTranfer = async (data) => {
  const response = await httpClient.patch(getApiUrl(`transfer/${data.id}`), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Delete transfer (alternative method)
 * @param {Object} data - Transfer data with ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTranfer = async (data) => {
  const response = await httpClient.delete(getApiUrl(`transfer/${data.id}`), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Delete distribution by ID
 * @param {number|string} id - Distribution ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteDistribution = async (id) => {
  const response = await httpClient.delete(getApiUrl(`distribution/${id}`), {
    headers: getHeaders(),
  });
  return response;
};
