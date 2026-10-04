import { useEffect, useCallback } from "react";
import { updateMovementType } from "../redux/cart/cartActions";
import { MOVEMENT_TYPES, QUERY_TYPES } from "../constants";

export const useKeyboardShortcuts = (inputRef, dispatch, options = {}) => {
  const {
    onVisualSearch,
    onQueryTypeChange,
    allowTransfer = true,
    allowSale = true,
    allowReservation = true,
    allowDistribution = true,
  } = options;
  const handleShortcut = useCallback((event) => {
    if (!event.ctrlKey) return;
    const key = event.key.toLowerCase();

    if (key === "q") {
      event.preventDefault();
      onQueryTypeChange?.(QUERY_TYPES.CODE);
    }
    if (key === "l") {
      event.preventDefault();
      onQueryTypeChange?.(QUERY_TYPES.NAME);
    }
    if (allowSale && key === "e") {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.SALE));
    }
    if (allowTransfer && key === "r") {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.TRANSFER));
    }
    if (allowDistribution && key === "d") {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.DISTRIBUTION));
    }
    if (key === "y") {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.ADD_STOCK));
    }
    if (key === "u") {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.CHECK_STOCK));
    }
    if (allowReservation && key === "i") {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.RESERVATION));
    }
    if (key === "b") {
      event.preventDefault();
      inputRef?.current?.focus();
    }
    if (key === "k") {
      event.preventDefault();
      onVisualSearch?.();
    }
  }, [dispatch, inputRef, onVisualSearch, onQueryTypeChange, allowTransfer, allowSale, allowReservation, allowDistribution]);

  useEffect(() => {
    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [handleShortcut]);
};
