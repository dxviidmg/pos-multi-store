import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

/**
 * Creates a CRUD API service for a given resource
 * @param {string} resource - The API resource name (e.g., 'client', 'brand', 'department')
 * @param {Object} options - Configuration options
 * @param {string} options.pluralDelete - Custom plural endpoint for delete (e.g., 'clients/delete')
 * @returns {Object} CRUD methods for the resource
 */
export const createApiService = (resource, options = {}) => {
  const { pluralDelete } = options;

  return {
    /**
     * Get all items with optional filters
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Items list response
     */
    getAll: async (params) => {
      const url = params 
        ? buildUrlWithParams(getApiUrl(resource), params)
        : getApiUrl(resource);
      const response = await httpClient.get(url, {
        headers: getHeaders(),
      });
      return response;
    },

    /**
     * Get single item by ID
     * @param {number|string} id - Item ID
     * @returns {Promise<Object>} Item response
     */
    getById: async (id) => {
      const response = await httpClient.get(getApiUrl(`${resource}/${id}`), {
        headers: getHeaders(),
      });
      return response;
    },

    /**
     * Create new item
     * @param {Object} data - Item data
     * @returns {Promise<Object>} Created item response
     */
    create: async (data) => {
      const response = await httpClient.post(getApiUrl(resource), data, {
        headers: getHeaders(),
      });
      return response;
    },

    /**
     * Update item
     * @param {Object} data - Item data with ID
     * @returns {Promise<Object>} Updated item response
     */
    update: async (data) => {
      const response = await httpClient.patch(getApiUrl(`${resource}/${data.id}`), data, {
        headers: getHeaders(),
      });
      return response;
    },

    /**
     * Delete single item
     * @param {number|string} id - Item ID
     * @returns {Promise<Object>} Deletion response
     */
    delete: async (id) => {
      const response = await httpClient.delete(getApiUrl(`${resource}/${id}`), {
        headers: getHeaders(),
      });
      return response;
    },

    /**
     * Delete multiple items
     * @param {Object} data - Object with item IDs to delete
     * @returns {Promise<Object>} Deletion response
     */
    deleteMany: async (data) => {
      const endpoint = pluralDelete || `${resource}/delete`;
      const response = await httpClient.post(getApiUrl(endpoint), data, {
        headers: getHeaders(),
      });
      return response;
    },
  };
};
