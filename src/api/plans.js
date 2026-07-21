import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

export const getCurrentPlan = async () => {
  return httpClient.get(getApiUrl("current-plan"));
};

export const getPlanEquivalent = async (id) =>
  httpClient.get(getApiUrl(`plan-equivalent`));
