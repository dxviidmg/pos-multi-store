import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

/**
 * Get all discounts
 * @returns {Promise<Object>} Discounts list response
 */
export const getDiscounts = async () => {
  const response = await httpClient.get(getApiUrl("discount"), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Create new discount
 * @param {Object} data - Discount data
 * @returns {Promise<Object>} Created discount response
 */
export const createDiscount = async (data) => {
  const response = await httpClient.post(getApiUrl("discount"), data, {
    headers: getHeaders(),
  });
  return response;
};