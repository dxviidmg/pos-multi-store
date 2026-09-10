import { useQuery } from '@tanstack/react-query';
import { getStoresCashSummary } from '@/src/features/admin/api/stores';

export const useStores = (params) => {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: () => getStoresCashSummary(params),
    select: (response) => response.data,
  });
};
