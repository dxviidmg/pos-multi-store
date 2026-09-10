import { useQuery } from '@tanstack/react-query';
import { getTenantInfo } from '@/src/features/tenant/api/tenants';

export const useTenantInfo = () => {
  return useQuery({
    queryKey: ['tenantInfo'],
    queryFn: () => getTenantInfo(),
    select: (response) => response.data,
  });
};
