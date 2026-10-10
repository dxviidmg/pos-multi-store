import { createApiService } from "./apiFactory";

const clientService = createApiService("client");

export const getClients = clientService.getAll;
export const createClient = clientService.create;
export const updateClient = clientService.update;
