import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

/**
 * Create new transfer between stores
 * @param {Object} data - Transfer data
 * @returns {Promise<Object>} Created transfer response
 */
export const createTransfer = async (data) => {
  return httpClient.post(getApiUrl("transfer"), data);
};

/**
 * Get all transfers
 * @returns {Promise<Object>} Transfers list response
 */
export const getTransfers = async () => {
  return httpClient.get(getApiUrl("transfer"));
};

/**
 * Confirm multiple transfers
 * @param {Object} data - Transfer IDs to confirm
 * @returns {Promise<Object>} Confirmation response
 */
export const confirmTransfers = async (data) => {
  return httpClient.post(getApiUrl("transfers/confirm"), data);
};

/**
 * Confirm product distribution
 * @param {Object} data - Distribution data
 * @returns {Promise<Object>} Confirmation response
 */
export const confirmDistribution = async (data) => {
  return httpClient.post(getApiUrl("store-product/distribution/confirm"), data);
};

/**
 * Delete transfer by ID
 * @param {number|string} id - Transfer ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTransfer = async (id) => {
  return httpClient.delete(getApiUrl(`transfer/${id}`));
};

/**
 * Create new distribution
 * @param {Object} data - Distribution data
 * @returns {Promise<Object>} Created distribution response
 */
export const createDistribution = async (data) => {
  return httpClient.post(getApiUrl("distribution"), data);
};

/**
 * Get all distributions
 * @returns {Promise<Object>} Distributions list response
 */
export const getDistributions = async () => {
  return httpClient.get(getApiUrl("distribution"));
};

/**
 * Update transfer
 * @param {Object} data - Transfer data with ID
 * @returns {Promise<Object>} Updated transfer response
 */
export const updateTranfer = async (data) => {
  return httpClient.patch(getApiUrl(`transfer/${data.id}`), data);
};

/**
 * Delete transfer (alternative method)
 * @param {Object} data - Transfer data with ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTranfer = async (data) => {
  return httpClient.delete(getApiUrl(`transfer/${data.id}`));
};

/**
 * Delete distribution by ID
 * @param {number|string} id - Distribution ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteDistribution = async (id) => {
  return httpClient.delete(getApiUrl(`distribution/${id}`));
};
