/**
 * Catalog products API — Funciones de catálogo y administración.
 * Crear, actualizar, eliminar, importar, precios.
 */

import httpClient from "./httpClient";
import { getApiUrl, buildUrlWithParams, toFormData } from "./utils";

/**
 * Normaliza campos de mayoreo vacíos a null sin mutar el objeto original.
 * @param {Object} data - Product data
 * @returns {Object} Normalized product data
 * @private
 */
const normalizeProductPayload = (data) => ({
  ...data,
  ...(data.min_wholesale_quantity === "" && { min_wholesale_quantity: null }),
  ...(data.wholesale_price === "" && { wholesale_price: null }),
});

/**
 * Get products with optional filters (catálogo global).
 * Endpoint para listar todos los productos (no específico de sucursal).
 * @param {Object} params - Query parameters
 * @param {Object} config - Axios config (ej. { signal } para cancelación)
 * @returns {Promise<Object>} Products list response
 */
export const getProducts = async (params, config = {}) => {
  const url = buildUrlWithParams(getApiUrl("product"), params);
  return httpClient.get(url, config);
};

/**
 * Create new product en el catálogo global.
 * @param {Object} data - Product data (nombre, código, precios, imagen, etc.)
 * @returns {Promise<Object>} Created product response
 */
export const createProduct = async (data) => {
  const payload = normalizeProductPayload(data);
  const body = payload.image instanceof File ? toFormData(payload) : payload;
  return httpClient.post(getApiUrl("product"), body);
};

/**
 * Update product en el catálogo global.
 * @param {Object} data - Product data with ID
 * @returns {Promise<Object>} Updated product response
 */
export const updateProduct = async (data) => {
  const payload = normalizeProductPayload(data);
  // Una imagen string es la URL ya guardada: no se reenvía
  if (typeof payload.image === "string") delete payload.image;
  const body = payload.image instanceof File ? toFormData(payload) : payload;
  return httpClient.patch(getApiUrl(`product/${payload.id}`), body);
};

/**
 * Add products to store inventory (agregar a stock).
 * @param {Object} data - Products data
 * @returns {Promise<Object>} Add products response
 */
export const addProducts = async (data) => {
  return httpClient.post(getApiUrl("products/add"), data);
};

/**
 * Validate products import file (catálogo).
 * @param {Object} data - Object with file and config options
 * @returns {Promise<Object>} Validation results
 */
export const importProductsValidation = async (data) => {
  return httpClient.post(getApiUrl("products/import-validation"), toFormData(data));
};

/**
 * Import products from file (crear/actualizar catálogo).
 * @param {Object} data - Object with file and config options
 * @returns {Promise<Object>} Import results
 */
export const importProducts = async (data) => {
  return httpClient.post(getApiUrl("products/import"), toFormData(data));
};

/**
 * Delete multiple products del catálogo.
 * @param {Object} data - Object with product IDs to delete
 * @returns {Promise<Object>} Deletion response
 */
export const deleteProducts = async (data) => {
  return httpClient.post(getApiUrl("products/delete"), data);
};

/**
 * Update prices for multiple products masivamente.
 * @param {Array} data - Array de objetos con IDs y nuevos precios
 * @returns {Promise<Object>} Update prices response
 */
export const updatePricesProducts = async (data) => {
  return httpClient.post(getApiUrl("products/update-prices"), data);
};

/**
 * Convert product codes to uppercase (formateo).
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Update response
 */
export const upperCodeProducts = async (data) => {
  return httpClient.post(getApiUrl("products/upper-code"), data);
};

/**
 * Reassign products a diferente departamento/marca.
 * @param {Object} data - Reassignment data { from_department, to_department, etc. }
 * @returns {Promise<Object>} Reassignment response
 */
export const reassignProducts = async (data) => {
  return httpClient.post(getApiUrl("products/reassign"), data);
};
