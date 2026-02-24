import { useQuery } from '@tanstack/react-query';
import { getSales } from '../components/apis/sales';

export const useSales = (params = {}) => {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => getSales(params),
    select: (response) => response.data,
  });
};
