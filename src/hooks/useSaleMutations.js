import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelSale } from '../components/apis/sales';
import Swal from 'sweetalert2';

export const useCancelSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSale,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      const { cash_back } = response.data;
      Swal.fire({
        icon: 'success',
        title: `Devolución exitosa. Devolver $${cash_back}`,
        timer: 5000,
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al cancelar venta',
        text: 'Error desconocido. Por favor, contacte soporte.',
        timer: 5000,
      });
    },
  });
};
