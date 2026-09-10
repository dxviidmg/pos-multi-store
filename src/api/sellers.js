import { createApiService } from "@/src/shared/api/apiFactory";

const sellerService = createApiService("store-worker");

export const getSellers = sellerService.getAll;
export const createSeller = sellerService.create;
