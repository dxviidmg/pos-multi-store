import { useCallback, useState } from "react";
import { readString, writeString } from "../utils/storage";
import { PRODUCT_VIEW_OPTIONS } from "../constants";

const DEFAULT_MODES = PRODUCT_VIEW_OPTIONS.map((option) => option.value);

/**
 * Hook para persistir la preferencia de modo de visualización (tabla/galería) en localStorage.
 *
 * @param {string} storageKey - Clave de localStorage (ver STORAGE_KEYS.VIEW_MODE)
 * @param {string} [defaultMode="table"] - Modo por defecto si no hay preferencia válida
 * @param {string[]} [validModes] - Modos aceptados (por defecto los valores de PRODUCT_VIEW_OPTIONS)
 * @returns {[string, (mode: string) => void]} Tupla [mode, setMode]
 */
export const useViewModePreference = (storageKey, defaultMode = "table", validModes = DEFAULT_MODES) => {
  const [mode, setModeState] = useState(() => {
    const stored = readString(storageKey);
    return validModes.includes(stored) ? stored : defaultMode;
  });

  const setMode = useCallback(
    (nextMode) => {
      if (!validModes.includes(nextMode)) return;
      setModeState(nextMode);
      writeString(storageKey, nextMode);
    },
    [storageKey, validModes]
  );

  return [mode, setMode];
};
