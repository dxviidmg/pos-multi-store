import { useQuery } from '@tanstack/react-query';
import { getConversions, getConversionUnits, createConversion, updateConversion, deleteConversion, applyConversion } from '../api/conversions';
import { createMutationHooks, useCrudMutation } from './useCrudMutation';

export const useConversions = () => {
  return useQuery({
    queryKey: ['conversions'],
    queryFn: getConversions,
    select: (response) => response.data,
  });
};

export const useConversionUnits = () => {
  return useQuery({
    queryKey: ['conversionUnits'],
    queryFn: getConversionUnits,
    select: (response) => response.data,
  });
};

const { useCreate, useUpdate, useDelete } = createMutationHooks(
  'Conversión',
  'conversions',
  { create: createConversion, update: updateConversion, delete: deleteConversion }
);

export const useCreateConversion = useCreate;
export const useUpdateConversion = useUpdate;
export const useDeleteConversion = useDelete;

export const useApplyConversion = (options = {}) => {
  return useCrudMutation(applyConversion, {
    queryKey: 'conversions',
    successMessage: 'Conversión aplicada correctamente',
    errorMessage: 'Error al aplicar la conversión',
    ...options,
  });
};
