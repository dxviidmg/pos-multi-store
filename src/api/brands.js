import { createApiService } from "./apiFactory";

const brandService = createApiService("brand", { pluralDelete: "brands/delete" });

export const getBrands = brandService.getAll;
export const createBrand = brandService.create;
export const updateBrand = brandService.update;
export const deleteBrands = brandService.deleteMany;
