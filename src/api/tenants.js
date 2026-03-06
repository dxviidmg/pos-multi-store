import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl, getHeaders } from "./utils";

const paymentService = createApiService("payment");

export const getPayments = paymentService.getAll;

export const getTenantInfo = async () => {
  const response = await httpClient.get(getApiUrl("tenant-info"), {
    headers: getHeaders(),
  });
  return response;
};
