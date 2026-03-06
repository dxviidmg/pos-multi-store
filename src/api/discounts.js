import { createApiService } from "./apiFactory";

const discountService = createApiService("discount");

export const getDiscounts = discountService.getAll;
export const createDiscount = discountService.create;
