import { createApiService } from "@/src/shared/api/apiFactory";

const discountService = createApiService("discount");

export const getDiscounts = discountService.getAll;
export const createDiscount = discountService.create;
