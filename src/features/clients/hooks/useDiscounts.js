import { useQuery } from '@tanstack/react-query';
import { getDiscounts } from '@/src/features/clients/api/discounts';

export const useDiscounts = () => {
  return useQuery({
    queryKey: ['discounts'],
    queryFn: () => getDiscounts(),
    select: (response) => response.data,
  });
};
