import { useQuery } from '@tanstack/react-query';
import { getDiscounts } from '../api/discounts';

export const useDiscounts = () => {
  return useQuery({
    queryKey: ['discounts'],
    queryFn: getDiscounts,
    select: (response) => response.data,
  });
};
