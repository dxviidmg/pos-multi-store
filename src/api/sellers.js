import { createApiService } from "./apiFactory";

const sellerService = createApiService("store-worker");

export const getSellers = sellerService.getAll;
export const createSeller = sellerService.create;
