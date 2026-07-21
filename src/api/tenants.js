import { createApiService } from "./apiFactory";
import httpClient from "./httpClient";
import { getApiUrl } from "./utils";

const paymentService = createApiService("payment");

export const getPayments = paymentService.getAll;

export const getTenantInfo = async () => {
  return httpClient.get(getApiUrl("tenant-info"));
};

export const getTenant = async (tenantId) => {
  return httpClient.get(getApiUrl(`tenant/${tenantId}`));
};

export const updateTenant = async (tenantId, data) => {
  return httpClient.patch(getApiUrl(`tenant/${tenantId}`), data);
};
