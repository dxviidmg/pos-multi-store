import { useCallback, useRef } from 'react';

const MERCADO_PAGO_PUBLIC_KEY = process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY

export const useMercadoPago = () => {
  const bricksControllerRef = useRef(null);

  const loadSDK = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.MercadoPago) return resolve();
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }, []);

  const createCardForm = useCallback(async ({ amount, onSubmit, onError }) => {
    await loadSDK();
    const mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY, { locale: 'es-MX' });
    const bricksBuilder = mp.bricks();

    bricksControllerRef.current = await bricksBuilder.create('cardPayment', 'mp-bricks-container', {
      initialization: { amount: Number(amount) },
      customization: { visual: { style: { theme: 'default' } } },
      callbacks: {
        onReady: () => {},
        onSubmit: (cardFormData) => {
          if (onSubmit) onSubmit({ token: cardFormData.token, email: cardFormData.payer.email });
        },
        onError: (error) => {
          console.error('Brick error:', error);
          if (onError) onError(error);
        },
      },
    });
  }, [loadSDK]);

  const unmountCardForm = useCallback(() => {
    if (bricksControllerRef.current) {
      bricksControllerRef.current.unmount();
      bricksControllerRef.current = null;
    }
  }, []);

  return { createCardForm, unmountCardForm };
};
