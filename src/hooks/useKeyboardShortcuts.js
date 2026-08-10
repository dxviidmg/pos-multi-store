import { useEffect, useCallback } from "react";
import { updateMovementType } from "../redux/cart/cartActions";
import { MOVEMENT_TYPES, QUERY_TYPES } from "../constants";

export const useKeyboardShortcuts = (inputRef, dispatch) => {
  const handleShortcut = useCallback((event) => {
    if (event.ctrlKey && (event.key === "q" || event.key === "Q")) {
      event.preventDefault();
      dispatch(updateMovementType(QUERY_TYPES.CODE));
    }
    if (event.ctrlKey && (event.key === "w" || event.key === "W")) {
      event.preventDefault();
      dispatch(updateMovementType(QUERY_TYPES.NAME));
    }
    if (event.ctrlKey && (event.key === "e" || event.key === "E")) {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.SALE));
    }
    if (event.ctrlKey && (event.key === "r" || event.key === "R")) {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.TRANSFER));
    }
    if (event.ctrlKey && (event.key === "t" || event.key === "T")) {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.DISTRIBUTION));
    }
    if (event.ctrlKey && (event.key === "y" || event.key === "Y")) {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.ADD_STOCK));
    }
    if (event.ctrlKey && (event.key === "u" || event.key === "U")) {
      event.preventDefault();
      dispatch(updateMovementType(MOVEMENT_TYPES.CHECK_STOCK));
    }
    if (event.ctrlKey && (event.key === "b" || event.key === "B")) {
      event.preventDefault();
      inputRef?.current?.focus();
    }
  }, [dispatch, inputRef]);

  useEffect(() => {
    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [handleShortcut]);
};
