import { useQuery } from '@tanstack/react-query';
import { getTransfers, transferApi } from '../api/transfers';
import { createMutationHooks } from './useCrudMutation';

// Transfers
export const useTransfers = (params = {}) => {
  return useQuery({
    queryKey: ['transfers', params],
    // Los traspasos cambian desde la venta y otras sucursales sin invalidar esta query.
    refetchOnMount: 'always',
    queryFn: async () => {
      const response = await getTransfers(params);
      return response.data;
    }
  });
};

export const { useDelete: useDeleteTransfer } = createMutationHooks('Traspaso', 'transfers', transferApi);
