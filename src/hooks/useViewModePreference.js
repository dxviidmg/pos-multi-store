import { useCallback, useState } from "react";
import { logger } from "../utils/logger";

const VALID_MODES = ["table", "gallery"];

/**
 * Hook para persistir la preferencia de modo de visualización (tabla/galería) en localStorage.
 *
 * @param {string} storageKey - Clave de localStorage (ej. "productList.viewMode")
 * @param {string} [defaultMode="table"] - Modo por defecto si no hay preferencia válida
 * @returns {[string, (mode: string) => void]} Tupla [mode, setMode]
 */
export const useViewModePreference = (storageKey, defaultMode = "table") => {
  const [mode, setModeState] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return VALID_MODES.includes(stored) ? stored : defaultMode;
    } catch (err) {
      // localStorage puede no estar disponible (modo privado); usar el valor por defecto.
      return defaultMode;
    }
  });

  const setMode = useCallback(
    (nextMode) => {
      if (!VALID_MODES.includes(nextMode)) return;
      setModeState(nextMode);
      try {
        localStorage.setItem(storageKey, nextMode);
      } catch (err) {
        logger.warn("No se pudo guardar la preferencia de vista:", err?.message || err);
      }
    },
    [storageKey]
  );

  return [mode, setMode];
};
