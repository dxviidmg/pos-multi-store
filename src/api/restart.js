import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

/**
 * Trigger Render service redeployment
 * @returns {Promise<Object>} Redeploy response
 */
export const getRedeployRender = async () => {
  return httpClient.get(getApiUrl("redeploy-render"));
};