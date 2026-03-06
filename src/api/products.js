import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

const timedRequest = async (axiosCall, meta = {}) => {
  const localString = localStorage.getItem("monitoring");
  let local = localString ? JSON.parse(localString) : {};
  const start = performance.now();
  try {
    const response = await axiosCall();
    const end = performance.now();
    const duration = Math.round((end - start) / 1000);
    local[duration] = (local[duration] || 0) + 1;
    localStorage.setItem("monitoring", JSON.stringify(local));
    return response;
  } catch (error) {
    const end = performance.now();
    const duration = Math.round((end - start) / 1000);
    local[duration] = (local[duration] || 0) + 1;
    localStorage.setItem("monitoring", JSON.stringify(local));
    console.log(`[FAIL] ${meta.name || "request"}: ${duration} s`);
    throw error;
  }
};

/**
 * Get store products with optional filters
 * @param {Object} params - Query parameters
 * @param {Object} config - Axios config options
 * @returns {Promise<Object>} Store products response
 */
export const getStoreProducts = async (params, config = {}) => {
  const url = buildUrlWithParams(getApiUrl("store-product"), params);
  return timedRequest(
    () => httpClient.get(url, { headers: getHeaders(), ...config }),
    { name: "getStoreProducts" }
  );
};

/**
 * Get products with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Products list response
 */
export const getProducts = async (params) => {
  const url = buildUrlWithParams(getApiUrl("product"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Create new product
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Created product response
 */
export const createProduct = async (data) => {
  const response = await httpClient.post(getApiUrl("product"), data, {
    headers: getHeaders(true),
  });
  return response;
};

/**
 * Update product
 * @param {Object} data - Product data with ID
 * @returns {Promise<Object>} Updated product response
 */
export const updateProduct = async (data) => {
  if (typeof data.image === "string") {
    delete data.image;
  }
  const response = await httpClient.patch(getApiUrl(`product/${data.id}`), data, {
    headers: getHeaders(true),
  });
  return response;
};

/**
 * Add products to store inventory
 * @param {Object} data - Products data
 * @returns {Promise<Object>} Add products response
 */
export const addProducts = async (data) => {
  const response = await httpClient.post(getApiUrl("products/add"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get store product logs
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Product logs response
 */
export const getStoreProductLogs = async (params) => {
  const url = buildUrlWithParams(getApiUrl("store-product-logs"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get store product log choices
 * @returns {Promise<Object>} Log choices response
 */
export const getStoreProductLogsChoices = async () => {
  const response = await httpClient.get(getApiUrl("store-product-logs/choices"), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Update store product
 * @param {Object} data - Store product data with ID
 * @returns {Promise<Object>} Updated store product response
 */
export const updateStoreProduct = async (data) => {
  const response = await httpClient.patch(getApiUrl(`store-product/${data.id}`), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Validate products import file
 * @param {FormData} data - Form data with file
 * @returns {Promise<Object>} Validation results
 */
export const importProductsValidation = async (data) => {
  const response = await httpClient.post(getApiUrl("products/import-validation"), data, {
    headers: getHeaders(true),
  });
  return response;
};

/**
 * Import products from file
 * @param {FormData} data - Form data with validated file
 * @returns {Promise<Object>} Import results
 */
export const importProducts = async (data) => {
  const response = await httpClient.post(getApiUrl("products/import"), data, {
    headers: getHeaders(true),
  });
  return response;
};

/**
 * Delete multiple products
 * @param {Object} data - Object with product IDs to delete
 * @returns {Promise<Object>} Deletion response
 */
export const deleteProducts = async (data) => {
  const response = await httpClient.post(getApiUrl("products/delete"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Convert product codes to uppercase
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Update response
 */
export const upperCodeProducts = async (data) => {
  const response = await httpClient.post(getApiUrl("products/upper-code"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Validate store products import file
 * @param {FormData} data - Form data with file
 * @returns {Promise<Object>} Validation results
 */
export const importStoreProductsValidation = async (data) => {
  const response = await httpClient.post(getApiUrl("store-products/import-validation"), data, {
    headers: getHeaders(true),
  });
  return response;
};

/**
 * Import store products from file
 * @param {FormData} data - Form data with validated file
 * @returns {Promise<Object>} Import results
 */
export const importStoreProducts = async (data) => {
  const response = await httpClient.post(getApiUrl("store-products/import"), data, {
    headers: getHeaders(true),
  });
  return response;
};

/**
 * Check if import can include quantity
 * @returns {Promise<Object>} Configuration response
 */
export const getImportCanIncludeQuantity = async () => {
  const response = await httpClient.get(getApiUrl("store-products/import/can-include-quantity"), {
    headers: getHeaders(true),
  });
  return response;
};

/**
 * Reassign products to different department/category
 * @param {Object} data - Reassignment data
 * @returns {Promise<Object>} Reassignment response
 */
export const reassignProducts = async (data) => {
  const response = await httpClient.post(getApiUrl("products/reassign"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get store products asynchronously
 * @returns {Promise<Object>} Async task response
 */
export const getStoreProductsAsync = async () => {
  const response = await httpClient.get(getApiUrl("async-store-product"), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get async task result
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Task result response
 */
export const getTaskResult = async (id) => {
  const response = await httpClient.get(getApiUrl(`task-result/${id}`), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get stock in other stores for a product
 * @param {string} code - Product code
 * @returns {Promise<Object>} Stock information response
 */
export const getStockOtherStores = async (code) => {
  const response = await httpClient.get(getApiUrl(`products/stock-other-stores/?code=${code}`, false), {
    headers: getHeaders(),
  });
  return response;
};
