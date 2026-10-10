import React from "react";
import StoreProductLogsModal from "../StoreProductLogsModal/StoreProductLogsModal";
import StockUpdateRequestModal from "../../inventory/StockUpdateRequestModal/StockUpdateRequestModal";

/** Modales de `useStoreProductActions`; `onUpdate` recibe el store-product ajustado. */
const StoreProductModals = ({ logsModal, requestModal, onUpdate }) => (
  <>
    <StoreProductLogsModal
      isOpen={logsModal.isOpen}
      logs={logsModal.data}
      onClose={logsModal.close}
      onUpdate={onUpdate}
    />
    <StockUpdateRequestModal isOpen={requestModal.isOpen} storeProduct={requestModal.data} onClose={requestModal.close} />
  </>
);

export default StoreProductModals;
