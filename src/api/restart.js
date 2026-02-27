import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

/**
 * Trigger Render service redeployment
 * @returns {Promise<Object>} Redeploy response
 */
export const getRedeployRender = async () => {
  const response = await httpClient.get(getApiUrl("redeploy-render"), {
    headers: getHeaders(),
  });
  return response;
};