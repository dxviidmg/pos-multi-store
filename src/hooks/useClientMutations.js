import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient, updateClient } from '../components/apis/clients';
import Swal from 'sweetalert2';

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      Swal.fire({
        icon: 'success',
        title: 'Cliente creado',
        timer: 5000,
      });
    },
    onError: (error) => {
      let message = 'Error desconocido. Por favor, contacte soporte.';
      
      if (error.response?.status === 400 && error.response.data.phone_number) {
        const phoneError = error.response.data.phone_number[0];
        if (phoneError === 'Ensure this field has at least 10 characters.') {
          message = 'El teléfono debe tener al menos 10 dígitos.';
        } else if (phoneError === 'client with this phone number already exists.') {
          message = 'El teléfono ya existe.';
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error al guardar cliente',
        text: message,
        timer: 5000,
      });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      Swal.fire({
        icon: 'success',
        title: 'Cliente actualizado',
        timer: 5000,
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar cliente',
        timer: 5000,
      });
    },
  });
};
