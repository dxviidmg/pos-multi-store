import { useQueryClient } from '@tanstack/react-query';
import { canCreateStore } from '../api/stores';
import { createQueryHook } from './createQueryHook';

const QUERY_KEY = 'canCreateStore';

const useCanCreateStoreQuery = createQueryHook(QUERY_KEY, canCreateStore);

export const useCanCreateStore = () => {
  const queryClient = useQueryClient();
  const query = useCanCreateStoreQuery();

  const refetch = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

  return { ...query, refetch };
};
