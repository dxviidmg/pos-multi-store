import { useCallback } from "react";
import { useModal } from "../../../hooks/useModal";

/**
 * Modales de historial/ajuste de stock y de solicitud de ajuste para un store-product,
 * con los handlers que esperan `StoreProductActions` y `StoreProductGridCard`.
 * Renderiza los modales con `StoreProductModals`.
 */
export const useStoreProductActions = () => {
  const logsModal = useModal();
  const requestModal = useModal();
  const { open: openLogs } = logsModal;
  const { open: openRequest } = requestModal;

  const onAdjust = useCallback((storeProduct) => openLogs({ storeProduct, adjustStock: true }), [openLogs]);
  const onLogs = useCallback((storeProduct) => openLogs({ storeProduct, adjustStock: false }), [openLogs]);
  const onRequest = useCallback((storeProduct) => openRequest(storeProduct), [openRequest]);

  return { logsModal, requestModal, onAdjust, onLogs, onRequest };
};
