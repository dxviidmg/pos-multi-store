import { useQuery } from '@tanstack/react-query';
import { getSellers } from '@/src/features/catalog/api/sellers';

export const useSellers = () => {
  return useQuery({
    queryKey: ['sellers'],
    queryFn: () => getSellers(),
    select: (response) => response.data,
  });
};
