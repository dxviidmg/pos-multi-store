import { createMutationHooks } from './useCrudMutation';
import { createClient, updateClient } from '../api/clients';
import { parsePhoneError } from '../utils/apiErrors';

const { useCreate, useUpdate } = createMutationHooks('Cliente', 'clients', {
  create: createClient,
  update: updateClient,
});

const clientErrorParser = (error) =>
  error.response?.status === 400 ? parsePhoneError(error.response.data?.phone_number) : null;

export const useCreateClient = (options = {}) =>
  useCreate({ errorParser: clientErrorParser, ...options });

export const useUpdateClient = (options = {}) =>
  useUpdate({ errorParser: clientErrorParser, ...options });
