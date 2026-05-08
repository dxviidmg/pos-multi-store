import { useQuery } from '@tanstack/react-query';
import { getTransfers } from '../api/transfers';
import { createApiService } from '../api/apiFactory';
import { createMutationHooks } from './useCrudMutation';

// Transfers
export const useTransfers = (params = {}) => {
  return useQuery({
    queryKey: ['transfers', params],
    queryFn: async () => {
      const response = await getTransfers(params);
      return response.data;
    }
  });
};

const transferApi = createApiService('transfer');
export const { useDelete: useDeleteTransfer } = createMutationHooks('Traspaso', 'transfers', transferApi);
