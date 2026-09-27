import { useCrudMutation } from './useCrudMutation';
import { cancelSale } from '../api/sales';
import { formatCurrency } from "../utils/utils";

export const useCancelSale = (options = {}) => {
  return useCrudMutation(cancelSale, {
    queryKey: 'sales',
    errorAction: 'procesar la devolución',
    onSuccess: (response) => {
      const { cash_back } = response.data;
      return cash_back > 0 ? `Devolución realizada. Entregar ${formatCurrency(cash_back)} al cliente` : "Venta cancelada";
    },
    ...options,
  });
};
