import httpClient from "@/src/shared/api/httpClient";
import { getApiUrl } from "@/src/shared/api/utils";

export const getCurrentPlan = async () => {
  return httpClient.get(getApiUrl("current-plan"));
};

export const getPlanEquivalent = async (id) =>
  httpClient.get(getApiUrl(`plan-equivalent`));
