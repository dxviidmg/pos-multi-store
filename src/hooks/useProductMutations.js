import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, updateProduct } from '../api/products';
import { showSuccess, showError } from '../utils/alerts';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccess('Producto creado');
    },
    onError: (error) => {
      let message = 'Error desconocido. Por favor, contacte soporte.';
      if (error.response?.status === 400 && error.response.data?.code) {
        const codeError = error.response.data.code[0];
        if (codeError === 'product with this code already exists.') {
          message = 'El código ya existe.';
        }
      }
      showError('Error al crear producto', message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSuccess('Producto actualizado');
    },
    onError: () => {
      showError('Error al actualizar producto');
    },
  });
};
