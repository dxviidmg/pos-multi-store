import { getClients } from '../api/clients';
import { createQueryHook } from './createQueryHook';

const useClientsQuery = createQueryHook('clients', getClients);

export const useClients = (params = {}) => useClientsQuery(params);
