import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

/**
 * Get cash flow records with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Cash flow list response
 */
export const getCashFlow = async (params) => {
  const url = buildUrlWithParams(getApiUrl("cash-flow"), params);
  const response = await httpClient.get(url, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Get cash flow type choices
 * @returns {Promise<Object>} Available cash flow types
 */
export const getCashFlowChoices = async () => {
  const response = await httpClient.get(getApiUrl("cash-flow/choices"), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Create new cash flow record
 * @param {Object} data - Cash flow data
 * @returns {Promise<Object>} Created cash flow response
 */
export const createCashFlow = async (data) => {
  const response = await httpClient.post(getApiUrl("cash-flow"), data, {
    headers: getHeaders(),
  });
  return response;
};