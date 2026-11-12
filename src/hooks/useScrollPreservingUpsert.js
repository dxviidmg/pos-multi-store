import { useCallback } from "react";
import { upsertById } from "../utils/array";

const GRID_SELECTOR = '[role="grid"]';

/**
 * Devuelve un `upsert(item)` que reemplaza o agrega `item` en la lista (`upsertById`)
 * conservando la posición de scroll de la tabla (`DataTable`) visible.
 *
 * @param {Function} setList - Setter de estado de la lista
 * @returns {(item: Object) => void}
 */
export const useScrollPreservingUpsert = (setList) =>
  useCallback(
    (item) => {
      const scrollTop = document.querySelector(GRID_SELECTOR)?.scrollTop || 0;
      setList((prev) => upsertById(prev, item));
      setTimeout(() => {
        const grid = document.querySelector(GRID_SELECTOR);
        if (grid) grid.scrollTop = scrollTop;
      }, 0);
    },
    [setList]
  );
