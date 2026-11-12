import { useEffect, useRef } from "react";
import { updateMovementType } from "../redux/cart/cartActions";
import { MOVEMENT_TYPES, QUERY_TYPES } from "../constants";

// Ctrl+<tecla> → acción. `enabledBy` es la opción que habilita el atajo (si aplica).
const SHORTCUTS = {
  q: { run: ({ onQueryTypeChange }) => onQueryTypeChange?.(QUERY_TYPES.CODE) },
  l: { run: ({ onQueryTypeChange }) => onQueryTypeChange?.(QUERY_TYPES.NAME) },
  e: { enabledBy: "allowSale", movementType: MOVEMENT_TYPES.SALE },
  r: { enabledBy: "allowTransfer", movementType: MOVEMENT_TYPES.TRANSFER },
  d: { enabledBy: "allowDistribution", movementType: MOVEMENT_TYPES.DISTRIBUTION },
  y: { movementType: MOVEMENT_TYPES.ADD_STOCK },
  u: { movementType: MOVEMENT_TYPES.CHECK_STOCK },
  i: { enabledBy: "allowReservation", movementType: MOVEMENT_TYPES.RESERVATION },
  b: { run: ({ inputRef }) => inputRef?.current?.focus() },
  k: { run: ({ onVisualSearch }) => onVisualSearch?.() },
};

export const useKeyboardShortcuts = (inputRef, dispatch, options = {}) => {
  const {
    onVisualSearch,
    onQueryTypeChange,
    allowTransfer = true,
    allowSale = true,
    allowReservation = true,
    allowDistribution = true,
  } = options;

  // Los callbacks y opciones viven en un ref para registrar el listener una sola vez
  const contextRef = useRef();
  contextRef.current = {
    inputRef,
    dispatch,
    onVisualSearch,
    onQueryTypeChange,
    allowTransfer,
    allowSale,
    allowReservation,
    allowDistribution,
  };

  useEffect(() => {
    const handleShortcut = (event) => {
      if (!event.ctrlKey || typeof event.key !== "string") return;
      const shortcut = SHORTCUTS[event.key.toLowerCase()];
      const context = contextRef.current;
      if (!shortcut || (shortcut.enabledBy && !context[shortcut.enabledBy])) return;
      event.preventDefault();
      if (shortcut.movementType) {
        context.dispatch(updateMovementType(shortcut.movementType));
      } else {
        shortcut.run(context);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);
};
