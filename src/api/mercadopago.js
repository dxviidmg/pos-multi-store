import { createApiService } from './apiFactory';

const mercadopagoAPI = createApiService('mercadopago');

/** Clave pública del formulario de pago (REACT_APP_MERCADO_PAGO_PUBLIC_KEY). */
export const getMercadoPagoPublicKey = () => process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY;

export const createMercadoPagoPreference = (planId) => 
  mercadopagoAPI.create({ plan_id: planId });
