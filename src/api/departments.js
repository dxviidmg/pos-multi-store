import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

/**
 * Get all departments
 * @returns {Promise<Object>} Departments list response
 */
export const getDepartments = async () => {
  const response = await httpClient.get(getApiUrl("department"), {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Create new department
 * @param {Object} data - Department data
 * @returns {Promise<Object>} Created department response
 */
export const createDepartment = async (data) => {
  const response = await httpClient.post(getApiUrl("department"), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Update department
 * @param {Object} data - Department data with ID
 * @returns {Promise<Object>} Updated department response
 */
export const updateDepartment = async (data) => {
  const response = await httpClient.patch(getApiUrl(`department/${data.id}`), data, {
    headers: getHeaders(),
  });
  return response;
};

/**
 * Delete multiple departments
 * @param {Object} data - Object with department IDs to delete
 * @returns {Promise<Object>} Deletion response
 */
export const deleteDepartments = async (data) => {
  const response = await httpClient.post(getApiUrl("departments/delete"), data, {
    headers: getHeaders(),
  });
  return response;
};