import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, updateProduct } from '../components/apis/products';
import Swal from 'sweetalert2';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Swal.fire({
        icon: 'success',
        title: 'Producto creado',
        timer: 5000,
      });
    },
    onError: (error) => {
      let message = 'Error desconocido. Por favor, contacte soporte.';
      if (error.response?.status === 400 && error.response.data?.code) {
        const codeError = error.response.data.code[0];
        if (codeError === 'product with this code already exists.') {
          message = 'El código ya existe.';
        }
      }
      Swal.fire({
        icon: 'error',
        title: 'Error al crear producto',
        text: message,
        timer: 5000,
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      Swal.fire({
        icon: 'success',
        title: 'Producto actualizado',
        timer: 5000,
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar producto',
        timer: 5000,
      });
    },
  });
};
