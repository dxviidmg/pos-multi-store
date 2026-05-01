import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateMovementType } from "../redux/cart/cartActions";

export const useKeyboardShortcuts = (inputRef, dispatch) => {
  const handleShortcut = useCallback((event) => {
    if (event.ctrlKey && (event.key === "q" || event.key === "Q")) {
      event.preventDefault();
      dispatch(updateMovementType("code"));
    }
    if (event.ctrlKey && (event.key === "w" || event.key === "W")) {
      event.preventDefault();
      dispatch(updateMovementType("q"));
    }
    if (event.ctrlKey && (event.key === "e" || event.key === "E")) {
      event.preventDefault();
      dispatch(updateMovementType("venta"));
    }
    if (event.ctrlKey && (event.key === "r" || event.key === "R")) {
      event.preventDefault();
      dispatch(updateMovementType("traspaso"));
    }
    if (event.ctrlKey && (event.key === "t" || event.key === "T")) {
      event.preventDefault();
      dispatch(updateMovementType("distribucion"));
    }
    if (event.ctrlKey && (event.key === "y" || event.key === "Y")) {
      event.preventDefault();
      dispatch(updateMovementType("agregar"));
    }
    if (event.ctrlKey && (event.key === "u" || event.key === "U")) {
      event.preventDefault();
      dispatch(updateMovementType("checar"));
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
