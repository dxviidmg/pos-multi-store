import { useQuery } from '@tanstack/react-query';
import { getTenantInfo } from '../components/apis/tenants';

export const useTenantInfo = () => {
  return useQuery({
    queryKey: ['tenantInfo'],
    queryFn: getTenantInfo,
    select: (response) => response.data,
  });
};
