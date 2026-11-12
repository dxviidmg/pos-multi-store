import { getDepartments } from '../api/departments';
import { createQueryHook } from './createQueryHook';

export const useDepartments = createQueryHook('departments', getDepartments);
