import { getDiscounts } from '../api/discounts';
import { createQueryHook } from './createQueryHook';

export const useDiscounts = createQueryHook('discounts', getDiscounts);
