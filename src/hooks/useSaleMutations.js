import { useCrudMutation } from './useCrudMutation';
import { cancelSale } from '../api/sales';

export const useCancelSale = (options = {}) => {
  return useCrudMutation(cancelSale, {
    queryKey: 'sales',
    errorMessage: 'Error al cancelar venta',
    onSuccess: (response) => {
      const { cash_back } = response.data;
      return `Devolución exitosa. Devolver $${cash_back}`;
    },
    ...options,
  });
};
