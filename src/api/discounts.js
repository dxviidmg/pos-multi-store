import { createApiService } from "@/src/api/apiFactory";

const discountService = createApiService("discount");

export const getDiscounts = discountService.getAll;
export const createDiscount = discountService.create;
