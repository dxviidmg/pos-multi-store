import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

const cashFlowService = createApiService("cash-flow");

export const getCashFlow = cashFlowService.getAll;
export const createCashFlow = cashFlowService.create;

export const getCashFlowChoices = async () => {
  const response = await httpClient.get(getApiUrl("cash-flow/choices"), {
    headers: getHeaders(),
  });
  return response;
};
