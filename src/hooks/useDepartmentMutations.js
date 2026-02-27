import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDepartment, updateDepartment } from '../api/departments';
import { showSuccess, showError } from '../utils/alerts';

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      showSuccess('Departamento creado');
    },
    onError: () => {
      showError('Error al crear el departamento');
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      showSuccess('Departamento actualizado');
    },
    onError: () => {
      showError('Error al actualizar el departamento');
    },
  });
};
