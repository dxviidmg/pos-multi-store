import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

/**
 * Get all brands
 * @returns {Promise<Object>} Brands list response
 */
export const getBrands = async () => {
  const response = await httpClient.get(getApiUrl("brand"), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Create new brand
 * @param {Object} data - Brand data
 * @returns {Promise<Object>} Created brand response
 */
export const createBrand = async (data) => {
  const response = await httpClient.post(getApiUrl("brand"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Update brand
 * @param {Object} data - Brand data with ID
 * @returns {Promise<Object>} Updated brand response
 */
export const updateBrand = async (data) => {
  const response = await httpClient.patch(getApiUrl(`brand/${data.id}`), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Delete multiple brands
 * @param {Object} data - Object with brand IDs to delete
 * @returns {Promise<Object>} Deletion response
 */
export const deleteBrands = async (data) => {
  const response = await httpClient.post(getApiUrl("brands/delete"), data, {
    headers: getHeaders(),
  });
  return response;
};