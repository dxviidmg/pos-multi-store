import { getConversions, getConversionUnits, createConversion, updateConversion, deleteConversion, applyConversion } from '../api/conversions';
import { createMutationHooks, useCrudMutation } from './useCrudMutation';
import { createQueryHook } from './createQueryHook';

export const useConversions = createQueryHook('conversions', getConversions);

export const useConversionUnits = createQueryHook('conversionUnits', getConversionUnits);

const { useCreate, useUpdate, useDelete } = createMutationHooks(
  'Conversión',
  'conversions',
  { create: createConversion, update: updateConversion, delete: deleteConversion },
  { feminine: true }
);

export const useCreateConversion = useCreate;
export const useUpdateConversion = useUpdate;
export const useDeleteConversion = useDelete;

export const useApplyConversion = (options = {}) => {
  return useCrudMutation(applyConversion, {
    queryKey: 'conversions',
    successMessage: 'Conversión aplicada',
    errorAction: 'aplicar la conversión',
    ...options,
  });
};
