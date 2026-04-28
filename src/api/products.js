import { logger } from "../utils/logger";
import httpClient from "./httpClient";
import { getApiUrl, buildUrlWithParams } from "./utils";

const timedRequest = async (axiosCall, meta = {}) => {
  const start = performance.now();
  try {
    const response = await axiosCall();
    return response;
  } catch (error) {
    const end = performance.now();
    const duration = Math.round((end - start) / 1000);
    logger.warn(`[FAIL] ${meta.name || "request"}: ${duration} s`);
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
    () => httpClient.get(url, config),
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
  return httpClient.get(url);
};

/**
 * Create new product
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Created product response
 */
export const createProduct = async (data) => {
  return httpClient.post(getApiUrl("product"), data);
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
  return httpClient.patch(getApiUrl(`product/${data.id}`), data);
};

/**
 * Add products to store inventory
 * @param {Object} data - Products data
 * @returns {Promise<Object>} Add products response
 */
export const addProducts = async (data) => {
  return httpClient.post(getApiUrl("products/add"), data);
};

/**
 * Get store product logs
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Product logs response
 */
export const getStoreProductLogs = async (params) => {
  const url = buildUrlWithParams(getApiUrl("store-product-logs"), params);
  return httpClient.get(url);
};

/**
 * Get store product log choices
 * @returns {Promise<Object>} Log choices response
 */
export const getStoreProductLogsChoices = async () => {
  return httpClient.get(getApiUrl("store-product-logs/choices"));
};

/**
 * Update store product
 * @param {Object} data - Store product data with ID
 * @returns {Promise<Object>} Updated store product response
 */
export const updateStoreProduct = async (data) => {
  return httpClient.patch(getApiUrl(`store-product/${data.id}`), data);
};

/**
 * Validate products import file
 * @param {FormData} data - Form data with file
 * @returns {Promise<Object>} Validation results
 */
export const importProductsValidation = async (data) => {
  return httpClient.post(getApiUrl("products/import-validation"), data);
};

/**
 * Import products from file
 * @param {FormData} data - Form data with validated file
 * @returns {Promise<Object>} Import results
 */
export const importProducts = async (data) => {
  return httpClient.post(getApiUrl("products/import"), data);
};

/**
 * Delete multiple products
 * @param {Object} data - Object with product IDs to delete
 * @returns {Promise<Object>} Deletion response
 */
export const deleteProducts = async (data) => {
  return httpClient.post(getApiUrl("products/delete"), data);
};

/**
 * Convert product codes to uppercase
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Update response
 */
export const upperCodeProducts = async (data) => {
  return httpClient.post(getApiUrl("products/upper-code"), data);
};

/**
 * Validate store products import file
 * @param {FormData} data - Form data with file
 * @returns {Promise<Object>} Validation results
 */
export const importStoreProductsValidation = async (data) => {
  return httpClient.post(getApiUrl("store-products/import-validation"), data);
};

/**
 * Import store products from file
 * @param {FormData} data - Form data with validated file
 * @returns {Promise<Object>} Import results
 */
export const importStoreProducts = async (data) => {
  return httpClient.post(getApiUrl("store-products/import"), data);
};

/**
 * Check if import can include quantity
 * @returns {Promise<Object>} Configuration response
 */
export const getImportCanIncludeQuantity = async () => {
  return httpClient.get(getApiUrl("store-products/import/can-include-quantity"));
};

/**
 * Reassign products to different department/category
 * @param {Object} data - Reassignment data
 * @returns {Promise<Object>} Reassignment response
 */
export const reassignProducts = async (data) => {
  return httpClient.post(getApiUrl("products/reassign"), data);
};

/**
 * Get async task result
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Task result response
 */
export const getTaskResult = async (id) => {
  return httpClient.get(getApiUrl(`task-result/${id}`));
};

/**
 * Get stock in other stores for a product
 * @param {string} code - Product code
 * @returns {Promise<Object>} Stock information response
 */
export const getStockOtherStores = async (storeProductId) => {
  return httpClient.get(getApiUrl(`products/stock-other-stores/?store-product=${storeProductId}`, false));
};

export const getProductPriceLogs = async (productId) => {
  const url = buildUrlWithParams(getApiUrl("product-price-logs"), { product_id: productId });
  return httpClient.get(url);
};

/**
 * Check if products can be created on sale
 * @returns {Promise<Object>} Configuration response with create_products_on_sale flag
 */
export const getCreateProductsOnSale = async () => {
  return httpClient.get(getApiUrl("create-products-on-sale"));
};
