import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

export const getCurrentPlan = async () => {
  return httpClient.get(getApiUrl("current-plan"));
};

export const getPlanEquivalent = async (stores) =>
  httpClient.get(getApiUrl(`plan-equivalent/${stores}`));
