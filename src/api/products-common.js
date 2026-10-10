/**
 * Products common API — Funciones compartidas.
 * Logs de precios, tareas asincrónicas, stock en otras tiendas.
 */

import httpClient from "./httpClient";
import { getApiUrl, buildUrlWithParams } from "./utils";

/**
 * Get async task result (para importaciones, auditorías, etc.).
 * Usado en polling de tareas en segundo plano (Celery).
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Task result response
 */
export const getTaskResult = async (id) => {
  return httpClient.get(getApiUrl(`task-result/${id}`));
};

/**
 * Get stock in other stores for a product.
 * Usado en pantalla de venta para sugerir traspasos.
 * @param {string} storeProductId - Store product ID
 * @returns {Promise<Object>} Stock information response
 */
export const getStockOtherStores = async (storeProductId) => {
  const url = buildUrlWithParams(getApiUrl("products/stock-other-stores"), {
    "store-product": storeProductId,
  });
  return httpClient.get(url);
};

/**
 * Get product price change logs (historial de cambios de precio).
 * @param {Object} options - { productId?, months? }
 * @returns {Promise<Object>} Price logs response
 */
export const getProductPriceLogs = async ({ productId, months } = {}) => {
  const url = buildUrlWithParams(getApiUrl("product-price-logs"), {
    product_id: productId,
    months,
  });
  return httpClient.get(url);
};

/**
 * Check if products can be created on sale (configuración del negocio).
 * @returns {Promise<Object>} Configuration response with create_products_on_sale flag
 */
export const getCreateProductsOnSale = async () => {
  return httpClient.get(getApiUrl("create-products-on-sale"));
};
