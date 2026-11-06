import { getSellers } from '../api/sellers';
import { createQueryHook } from './createQueryHook';

export const useSellers = createQueryHook('sellers', getSellers);
