import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelSale } from '../components/apis/sales';
import { showSuccess, showError } from '../components/utils/alerts';

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
