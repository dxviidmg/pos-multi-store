import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

const conversionService = createApiService("product-conversion");

export const getConversions = conversionService.getAll;
export const createConversion = conversionService.create;
export const updateConversion = conversionService.update;
export const deleteConversion = conversionService.delete;

/**
 * Get available units for conversions
 * @returns {Promise<Object>} Array of { value, label }
 */
export const getConversionUnits = async () => {
  return httpClient.get(getApiUrl("products/units"));
};

/**
 * Apply a conversion (unpack product)
 * @param {number} id - Conversion ID
 * @returns {Promise<Object>} { status: "Conversión aplicada" }
 */
export const applyConversion = async (id) => {
  return httpClient.post(getApiUrl(`product-conversion/${id}/apply`));
};
