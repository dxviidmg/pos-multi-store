import { useQuery } from '@tanstack/react-query';
import { getSellers } from '@/src/api/sellers';

export const useSellers = () => {
  return useQuery({
    queryKey: ['sellers'],
    queryFn: () => getSellers(),
    select: (response) => response.data,
  });
};
