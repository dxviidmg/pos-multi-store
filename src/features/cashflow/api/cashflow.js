import { createApiService } from "@/src/shared/api/apiFactory";
import httpClient from "@/src/shared/api/httpClient";
import { getApiUrl } from "@/src/shared/api/utils";

const cashFlowService = createApiService("cash-flow");

export const getCashFlow = cashFlowService.getAll;
export const createCashFlow = cashFlowService.create;
export const updateCashFlow = cashFlowService.update;
export const deleteCashFlow = cashFlowService.delete;

export const getCashFlowChoices = async () => {
  return httpClient.get(getApiUrl("cash-flow/choices"));
};
