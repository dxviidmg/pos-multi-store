import { useCallback, useEffect, useRef, useState } from "react";
import { useMercadoPago } from "./useMercadoPago";
import { useModal } from "./useModal";

const FORM_ERROR_MESSAGE = "Error en el formulario de pago.";

/**
 * Modal con el formulario de tarjeta de Mercado Pago (Card Payment Brick).
 *
 * `open()` abre el modal y monta el formulario en `containerId` (el modal debe
 * renderizar `<div id={containerId} />`). Al enviar la tarjeta llama a `submit(cardData)`;
 * si resuelve, desmonta el formulario, cierra el modal y llama a `onSuccess(response)`.
 * Si falla, `error` guarda el mensaje de `getErrorMessage(err)` para mostrarlo en el modal.
 *
 * @param {Object} options
 * @param {string} options.containerId - id del contenedor del formulario
 * @param {number|string} options.amount - Monto que muestra el formulario
 * @param {(cardData: Object) => Promise} options.submit - Petición con el token de la tarjeta
 * @param {(response: Object) => void} [options.onSuccess]
 * @param {(error: Error) => string} options.getErrorMessage
 * @returns {{ isOpen: boolean, open: Function, close: Function, submitting: boolean, error: string|null }}
 */
export const useCardFormModal = (options) => {
  const modal = useModal();
  const { createCardForm, unmountCardForm } = useMercadoPago();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Las opciones cambian en cada render; el formulario siempre usa las más recientes.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const { open: openModal, close: closeModal } = modal;

  const open = useCallback(() => {
    const { containerId, amount } = optionsRef.current;
    setError(null);
    openModal();
    // Espera a que el modal monte el contenedor del formulario.
    setTimeout(() => {
      createCardForm({
        amount,
        containerId,
        onSubmit: async (cardData) => {
          const { submit, onSuccess, getErrorMessage } = optionsRef.current;
          setSubmitting(true);
          try {
            const response = await submit(cardData);
            unmountCardForm();
            closeModal();
            onSuccess?.(response);
          } catch (err) {
            setError(getErrorMessage(err));
          } finally {
            setSubmitting(false);
          }
        },
        onError: () => setError(FORM_ERROR_MESSAGE),
      });
    }, 100);
  }, [openModal, closeModal, createCardForm, unmountCardForm]);

  const close = useCallback(() => {
    unmountCardForm();
    setError(null);
    closeModal();
  }, [unmountCardForm, closeModal]);

  useEffect(() => unmountCardForm, [unmountCardForm]);

  return { isOpen: modal.isOpen, open, close, submitting, error };
};
