import { useQuery } from '@tanstack/react-query';
import { getBrands } from '@/src/api/brands';

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands(),
    select: (response) => response.data,
  });
};
