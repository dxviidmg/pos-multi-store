import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

export const getCurrentPlan = async () => {
  return httpClient.get(getApiUrl("current-plan"));
};
