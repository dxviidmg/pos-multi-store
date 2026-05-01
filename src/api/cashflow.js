import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

const cashFlowService = createApiService("cash-flow");

export const getCashFlow = cashFlowService.getAll;
export const createCashFlow = cashFlowService.create;

export const getCashFlowChoices = async () => {
  return httpClient.get(getApiUrl("cash-flow/choices"));
};
