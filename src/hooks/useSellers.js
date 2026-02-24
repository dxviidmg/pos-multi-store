import { useQuery } from '@tanstack/react-query';
import { getSellers } from '../components/apis/sellers';

export const useSellers = () => {
  return useQuery({
    queryKey: ['sellers'],
    queryFn: getSellers,
    select: (response) => response.data,
  });
};
