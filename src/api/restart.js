import httpClient from "@/src/api/httpClient";
import { getApiUrl } from "@/src/api/utils";

/**
 * Trigger Render service redeployment
 * @returns {Promise<Object>} Redeploy response
 */
export const getRedeployRender = async () => {
  return httpClient.get(getApiUrl("redeploy-render"));
};