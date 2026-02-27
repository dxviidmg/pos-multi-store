import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrand, updateBrand } from '../api/brands';
import { showSuccess, showError } from '../utils/alerts';

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      showSuccess('Marca creada');
    },
    onError: () => {
      showError('Error al crear la marca', 'Error desconocido, por favor comuníquese con soporte');
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      showSuccess('Marca actualizada');
    },
    onError: () => {
      showError('Error al actualizar la marca');
    },
  });
};
