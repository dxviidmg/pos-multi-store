/**
 * API serializers — Funciones para transformar datos en formatos HTTP.
 * URL encoding, FormData, etc.
 */

/**
 * Build URL with query parameters.
 * Skips null/undefined values; convierte todo a string.
 * 
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters object
 * @returns {URL} URL object con parámetros
 * 
 * @example
 * const url = buildUrlWithParams('http://api.test/products', { q: 'iPhone', limit: 5 });
 * url.toString() → 'http://api.test/products?q=iPhone&limit=5'
 */
export const buildUrlWithParams = (baseUrl, params) => {
  const url = new URL(baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
  }
  return url;
};

/**
 * Build FormData from a plain object sin mutar el original.
 * Skips null, undefined and "" values.
 * Booleans se convierten a "true"/"false".
 * Files se agregan tal cual.
 * 
 * @param {Object} data - Plain object con datos a serializar
 * @returns {FormData} FormData listo para POST/PATCH
 * 
 * @example
 * const formData = toFormData({ 
 *   name: 'Producto', 
 *   price: 100,
 *   image: fileInput.files[0],
 *   active: true
 * });
 * // FormData contiene: name, price, image, active=true
 */
export const toFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
