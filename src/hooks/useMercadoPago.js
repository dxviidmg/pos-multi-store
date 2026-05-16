import { useCallback } from 'react';

const MERCADO_PAGO_PUBLIC_KEY = process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY || 'APP_USR-test-key';

export const useMercadoPago = () => {
  const initMercadoPago = useCallback(async () => {
    if (window.MercadoPago) return;
    
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const openCheckout = useCallback((preferenceId) => {
    if (!window.MercadoPago) {
      console.error('Mercado Pago SDK not loaded');
      return;
    }
    
    const mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY);
    mp.checkout({
      preference: {
        id: preferenceId,
      },
      autoOpen: true,
    });
  }, []);

  return { initMercadoPago, openCheckout };
};
