/**
 * Store products API — Funciones de punto de venta.
 * Lectura de productos, inventario por tienda, logs.
 */

import httpClient from "./httpClient";
import { getApiUrl, buildUrlWithParams } from "./utils";

/**
 * Get store products with optional filters.
 * Endpoint para listar productos en el punto de venta de una sucursal.
 * @param {Object} params - Query parameters (q, code, limit, etc.)
 * @param {Object} config - Axios config options
 * @returns {Promise<Object>} Store products response
 */
export const getStoreProducts = async (params, config = {}) => {
  const url = buildUrlWithParams(getApiUrl("store-product"), params);
  return httpClient.get(url, config);
};

/**
 * Get product suggestions for autocomplete (name/brand search).
 * Reutiliza el endpoint store-product con limit=5 para el desplegable.
 * @param {string} q - Texto de búsqueda (nombre o marca)
 * @param {Object} config - Axios config (ej. { signal } para cancelación)
 * @returns {Promise<Object>} Store products response (máx 5)
 */
export const getStoreProductSuggestions = async (q, config = {}) => {
  return getStoreProducts({ q, limit: 5 }, config);
};

/**
 * Update store product (stock, visible flag, etc.).
 * @param {Object} data - Store product data with ID
 * @returns {Promise<Object>} Updated store product response
 */
export const updateStoreProduct = async (data) => {
  return httpClient.patch(getApiUrl(`store-product/${data.id}`), data);
};

/**
 * Get store product logs (historial de movimientos).
 * @param {Object} params - Query parameters (product_id, store_id, movement_type, etc.)
 * @returns {Promise<Object>} Product logs response
 */
export const getStoreProductLogs = async (params) => {
  const url = buildUrlWithParams(getApiUrl("store-product-logs"), params);
  return httpClient.get(url);
};

/**
 * Get store product log choices (tipos de movimiento, etc.).
 * @returns {Promise<Object>} Log choices response
 */
export const getStoreProductLogsChoices = async () => {
  return httpClient.get(getApiUrl("store-product-logs/choices"));
};

/**
 * Validate store products import file.
 * @param {FormData} data - Form data with file
 * @returns {Promise<Object>} Validation results
 */
export const importStoreProductsValidation = async (data) => {
  return httpClient.post(getApiUrl("store-products/import-validation"), data);
};

/**
 * Import store products from file (inventario inicial o actualización).
 * @param {FormData} data - Form data with validated file
 * @returns {Promise<Object>} Import results
 */
export const importStoreProducts = async (data) => {
  return httpClient.post(getApiUrl("store-products/import"), data);
};

/**
 * Check if import can include quantity (configuración por tenant).
 * @returns {Promise<Object>} Configuration response
 */
export const getImportCanIncludeQuantity = async () => {
  return httpClient.get(getApiUrl("store-products/import/can-include-quantity"));
};
