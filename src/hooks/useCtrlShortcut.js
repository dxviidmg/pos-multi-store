import { useEffect, useRef } from "react";

/**
 * Atajo Ctrl+<tecla> con un solo listener en window.
 * El handler se guarda en un ref (se actualiza en cada render), así que no hace
 * falta memoizarlo ni se re-registra el listener.
 *
 * @param {string|string[]} keys - Tecla(s) sin distinguir mayúsculas (ej. "p" o ["g", "f"])
 * @param {(event: KeyboardEvent, key: string) => void} handler - Recibe el evento y la tecla en minúscula
 * @param {{ enabled?: boolean }} [options] - Con `enabled: false` no se intercepta la tecla
 */
export const useCtrlShortcut = (keys, handler, { enabled = true } = {}) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const keyList = (Array.isArray(keys) ? keys : [keys]).map((k) => k.toLowerCase());
  const keysId = keyList.join("|");

  useEffect(() => {
    if (!enabled) return undefined;
    const accepted = keysId.split("|");
    const onKeyDown = (event) => {
      if (!event.ctrlKey || typeof event.key !== "string") return;
      const key = event.key.toLowerCase();
      if (!accepted.includes(key)) return;
      event.preventDefault();
      handlerRef.current?.(event, key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keysId, enabled]);
};
