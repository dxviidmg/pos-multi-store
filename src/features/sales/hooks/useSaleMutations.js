import { useCrudMutation } from '@/src/shared/hooks/useCrudMutation';
import { cancelSale } from '@/src/features/sales/api/sales';

export const useCancelSale = (options = {}) => {
  return useCrudMutation(cancelSale, {
    queryKey: 'sales',
    errorMessage: 'Error al procesar la devolución',
    onSuccess: (response) => {
      const { cash_back } = response.data;
      return cash_back > 0 ? `Devolución realizada. Entregar $${cash_back} al cliente` : "Venta cancelada";
    },
    ...options,
  });
};
