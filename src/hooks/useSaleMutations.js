import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelSale } from '../api/sales';
import { showSuccess, showError } from '../utils/alerts';

export const useCancelSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSale,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      const { cash_back } = response.data;
      showSuccess(`Devolución exitosa. Devolver $${cash_back}`);
    },
    onError: () => {
      showError('Error al cancelar venta', 'Error desconocido. Por favor, contacte soporte.');
    },
  });
};
