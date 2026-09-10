import { createApiService } from "@/src/shared/api/apiFactory";
import httpClient from "@/src/shared/api/httpClient";
import { getApiUrl } from "@/src/shared/api/utils";

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
