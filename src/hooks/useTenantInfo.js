import { getTenantInfo } from '../api/tenants';
import { createQueryHook } from './createQueryHook';

export const useTenantInfo = createQueryHook('tenantInfo', getTenantInfo);
