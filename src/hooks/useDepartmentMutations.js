import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDepartment, updateDepartment } from '../components/apis/departments';
import Swal from 'sweetalert2';

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      Swal.fire({
        icon: 'success',
        title: 'Departamento creado',
        timer: 5000,
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear el departamento',
        timer: 5000,
      });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      Swal.fire({
        icon: 'success',
        title: 'Departamento actualizado',
        timer: 5000,
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar el departamento',
        timer: 5000,
      });
    },
  });
};
