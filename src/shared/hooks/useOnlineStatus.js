import { useState, useEffect } from "react";

/**
 * Hook para conocer el estado de conexión a Internet del navegador.
 *
 * Usa `navigator.onLine` como estado inicial y escucha los eventos nativos
 * `online` / `offline` del navegador. No hace polling ni peticiones al backend.
 *
 * @returns {boolean} `true` si hay conexión, `false` si está offline.
 */
export const useOnlineStatus = () => {
  const [online, setOnline] = useState(() =>
    typeof navigator !== "undefined" && "onLine" in navigator
      ? navigator.onLine
      : true
  );

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Re-sincroniza por si el estado cambió entre el render inicial y el montaje.
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
};
