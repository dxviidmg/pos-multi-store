import { createApiService } from './apiFactory';

const mercadopagoAPI = createApiService('mercadopago');

export const createMercadoPagoPreference = (planId) => 
  mercadopagoAPI.create({ plan_id: planId });

export const getMercadoPagoStatus = (preferenceId) => 
  mercadopagoAPI.getById(preferenceId);
