import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrand, updateBrand } from '../components/apis/brands';
import Swal from 'sweetalert2';

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      Swal.fire({
        icon: 'success',
        title: 'Marca creada',
        timer: 5000,
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear la marca',
        text: 'Error desconocido, por favor comuníquese con soporte',
        timer: 5000,
      });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      Swal.fire({
        icon: 'success',
        title: 'Marca actualizada',
        timer: 5000,
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar la marca',
        timer: 5000,
      });
    },
  });
};
