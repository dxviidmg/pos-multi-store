import { useQuery } from '@tanstack/react-query';
import { getStoresCashSummary } from '../api/stores';

export const useStores = (params) => {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: () => getStoresCashSummary(params),
    select: (response) => response.data,
  });
};
