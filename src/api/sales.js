import httpClient from "./httpClient";
import { getApiUrl, buildUrlWithParams } from "./utils";

/**
 * Create a new sale
 * @param {Object} data - Sale data
 * @returns {Promise<Object>} Created sale response
 */
export const createSale = async (data) => {
  return httpClient.post(getApiUrl("sale"), data);
};

/**
 * Get sales list with optional filters
 * @param {Object} params - Query parameters (page, search, date, etc.)
 * @returns {Promise<Object>} Sales list response
 */
export const getSales = async (params) => {
  const url = buildUrlWithParams(getApiUrl("sale"), params);
  return httpClient.get(url);
};

/**
 * Get single sale by ID
 * @param {number|string} id - Sale ID
 * @returns {Promise<Object>} Sale details
 */
export const getSale = async (id) => {
  return httpClient.get(getApiUrl(`sale/${id}`));
};

/**
 * Get cash summary for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Cash summary data
 */
export const getCashSummary = async (date) => {
  const url = buildUrlWithParams(getApiUrl("cash/summary"), date ? { date } : null);
  return httpClient.get(url);
};

/**
 * Validate sales import file
 * @param {FormData} data - Form data with file
 * @returns {Promise<Object>} Validation results
 */
export const importSalesValidation = async (data) => {
  return httpClient.post(getApiUrl("sales/import-validation"), data);
};

/**
 * Import sales from file
 * @param {FormData} data - Form data with validated file
 * @returns {Promise<Object>} Import results
 */
export const importSales = async (data) => {
  return httpClient.post(getApiUrl("sales/import"), data);
};

/**
 * Cancel a sale
 * @param {Object} data - Cancellation data with sale ID
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelSale = async (data) => {
  return httpClient.post(getApiUrl("sales/cancel"), data);
};

/**
 * Update sale information
 * @param {Object} data - Sale data with ID
 * @returns {Promise<Object>} Updated sale response
 */
export const updateSale = async (data) => {
  return httpClient.patch(getApiUrl(`sale/${data.id}`), data);
};

/**
 * Get sales dashboard data
 * @param {Object} params - Dashboard filters (date range, store, etc.)
 * @returns {Promise<Object>} Dashboard data
 */
export const getSalesDashboard = async (params) => {
  const url = buildUrlWithParams(getApiUrl("sales-dashboard"), params);
  return httpClient.get(url);
};