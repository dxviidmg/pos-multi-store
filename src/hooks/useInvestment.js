import { useQuery } from '@tanstack/react-query';
import { getInvestment } from '../components/apis/stores';

export const useInvestment = (enabled = false) => {
  return useQuery({
    queryKey: ['investment'],
    queryFn: getInvestment,
    enabled, // Solo se ejecuta cuando enabled es true
    select: (response) => {
      const investments = response.data;
      const total = investments.reduce(
        (acc, store) => acc + store.investment,
        0
      );
      return { investments, total };
    },
  });
};
