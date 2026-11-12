import { getBrands } from '../api/brands';
import { createQueryHook } from './createQueryHook';

export const useBrands = createQueryHook('brands', getBrands);
