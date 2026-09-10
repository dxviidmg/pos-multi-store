import httpClient from "@/src/shared/api/httpClient";
import { getApiUrl } from "@/src/shared/api/utils";

/**
 * Trigger Render service redeployment
 * @returns {Promise<Object>} Redeploy response
 */
export const getRedeployRender = async () => {
  return httpClient.get(getApiUrl("redeploy-render"));
};