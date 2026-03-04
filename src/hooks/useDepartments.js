import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '../api/departments';

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    select: (response) => response.data,
  });
};
