import { useQuery } from '@tanstack/react-query';
import { getSales } from '@/src/features/sales/api/sales';

export const useSales = (params = {}) => {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => getSales(params),
    select: (response) => response.data,
  });
};
