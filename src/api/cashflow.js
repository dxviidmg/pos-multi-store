import { createApiService } from "@/src/api/apiFactory";
import httpClient from "@/src/api/httpClient";
import { getApiUrl } from "@/src/api/utils";

const cashFlowService = createApiService("cash-flow");

export const getCashFlow = cashFlowService.getAll;
export const createCashFlow = cashFlowService.create;
export const updateCashFlow = cashFlowService.update;
export const deleteCashFlow = cashFlowService.delete;

export const getCashFlowChoices = async () => {
  return httpClient.get(getApiUrl("cash-flow/choices"));
};
