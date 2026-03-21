import httpClient from "./httpClient";
import { getApiUrl, getHeaders, buildUrlWithParams } from "./utils";

export const getAudit = async (params) => {
  const url = buildUrlWithParams(getApiUrl("audit1"), params);
  return httpClient.get(url, { headers: getHeaders() });
};

export const getAudit2 = async (params) => {
  const url = buildUrlWithParams(getApiUrl("audit2"), params);
  return httpClient.get(url, { headers: getHeaders() });
};

export const getProductAudit = async () => {
  return httpClient.get(getApiUrl("product-audit"), { headers: getHeaders() });
};

export const getProductAuditActivity = async () => {
  return httpClient.get(getApiUrl("product-audit-activity"), { headers: getHeaders() });
};