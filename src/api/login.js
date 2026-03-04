import httpClient from './httpClient';
import { getApiUrl } from "./utils";

/**
 * Authenticate user with credentials
 * @param {Object} credentials - User credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Response with token and user data
 */
export const loginUser = async (credentials) => {
  const response = await httpClient.post(getApiUrl("api-token-auth"), credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};
