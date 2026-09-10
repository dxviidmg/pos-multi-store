import httpClient from "@/src/api/httpClient";
import { getApiUrl, buildUrlWithParams } from "@/src/api/utils";

export const getAudit = async (params) => {
  const url = buildUrlWithParams(getApiUrl("sales-logs-audit"), params);
  return httpClient.get(url);
};

export const getAudit2 = async (params) => {
  const url = buildUrlWithParams(getApiUrl("stock-audit"), params);
  return httpClient.get(url);
};

export const getProductAudit = async () => {
  return httpClient.get(getApiUrl("product-audit"));
};

export const getProductAuditActivity = async () => {
  return httpClient.get(getApiUrl("product-audit-activity"));
};