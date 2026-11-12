import httpClient from "./httpClient";
import { createApiService } from "./apiFactory";
import { getApiUrl } from "./utils";

export const transferApi = createApiService("transfer");
const distributionApi = createApiService("distribution");

/**
 * Create new transfer between stores
 * @param {Object} data - Transfer data
 * @returns {Promise<Object>} Created transfer response
 */
export const createTransfer = transferApi.create;

/**
 * Get all transfers
 * @param {Object} params - Query parameters (e.g., { status: 'pending' })
 * @returns {Promise<Object>} Transfers list response
 */
export const getTransfers = async (params = {}) => {
  return httpClient.get(getApiUrl("transfer"), { params });
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
 * Create new distribution
 * @param {Object} data - Distribution data
 * @returns {Promise<Object>} Created distribution response
 */
export const createDistribution = distributionApi.create;

/**
 * Get all distributions
 * @returns {Promise<Object>} Distributions list response
 */
export const getDistributions = () => distributionApi.getAll();

/**
 * Update transfer
 * @param {Object} data - Transfer data with ID
 * @returns {Promise<Object>} Updated transfer response
 */
export const updateTransfer = transferApi.update;

/**
 * Delete transfer (alternative method)
 * @param {Object} data - Transfer data with ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTransfer = async (data) => {
  return httpClient.delete(getApiUrl(`transfer/${data.id}`));
};

/**
 * Delete distribution by ID
 * @param {number|string} id - Distribution ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteDistribution = distributionApi.delete;
