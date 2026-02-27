import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

/**
 * Create a new sale
 * @param {Object} data - Sale data
 * @returns {Promise<Object>} Created sale response
 */
export const createSale = async (data) => {
  const response = await httpClient.post(getApiUrl("sale"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get sales list with optional filters
 * @param {Object} params - Query parameters (page, search, date, etc.)
 * @returns {Promise<Object>} Sales list response
 */
export const getSales = async (params) => {
  const url = buildUrlWithParams(getApiUrl("sale"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get single sale by ID
 * @param {number|string} id - Sale ID
 * @returns {Promise<Object>} Sale details
 */
export const getSale = async (id) => {
  const response = await httpClient.get(getApiUrl(`sale/${id}`), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get cash summary for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Cash summary data
 */
export const getCashSummary = async (date) => {
  const url = buildUrlWithParams(getApiUrl("cash/summary"), date ? { date } : null);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Validate sales import file
 * @param {FormData} data - Form data with file
 * @returns {Promise<Object>} Validation results
 */
export const importSalesValidation = async (data) => {
  const response = await httpClient.post(getApiUrl("sales/import-validation"), data, {
    headers: getHeaders(true),
  });
  return response;
};

/**
 * Import sales from file
 * @param {FormData} data - Form data with validated file
 * @returns {Promise<Object>} Import results
 */
export const importSales = async (data) => {
  const response = await httpClient.post(getApiUrl("sales/import"), data, {
    headers: getHeaders(true),
  });
  return response;
};

/**
 * Cancel a sale
 * @param {Object} data - Cancellation data with sale ID
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelSale = async (data) => {
  const response = await httpClient.post(getApiUrl("sales/cancel"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Update sale information
 * @param {Object} data - Sale data with ID
 * @returns {Promise<Object>} Updated sale response
 */
export const updateSale = async (data) => {
  const response = await httpClient.patch(getApiUrl(`sale/${data.id}`), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get sales dashboard data
 * @param {Object} params - Dashboard filters (date range, store, etc.)
 * @returns {Promise<Object>} Dashboard data
 */
export const getSalesDashboard = async (params) => {
  const url = buildUrlWithParams(getApiUrl("sales-dashboard"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};