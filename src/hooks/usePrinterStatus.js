import { useState, useEffect } from "react";
import { testPrinterConnection } from "../api/printers";

/**
 * Hook para verificar el estado de conexión de la impresora
 * @param {string|null} printer - ID de impresora (null si no hay)
 * @param {Object} options - Opciones
 * @param {boolean} options.testOnMount - Si debe probar al montar (default: true)
 * @param {*} options.triggerDep - Dependencia adicional para re-testear (ej: isOpen de un modal)
 * @returns {{ connected: boolean|null, error: string|null, retest: Function }}
 */
export const usePrinterStatus = (printer, options = {}) => {
  const { testOnMount = true, triggerDep } = options;
  const [connected, setConnected] = useState(null);
  const [error, setError] = useState(null);

  const retest = () => {
    if (!printer) {
      setConnected(null);
      setError(null);
      return;
    }

    testPrinterConnection()
      .then((result) => {
        setConnected(result.connected);
        setError(result.error || null);
      })
      .catch(() => {
        setConnected(false);
        setError("Error de conexión");
      });
  };

  useEffect(() => {
    if (testOnMount) {
      retest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printer, triggerDep]);

  return { connected, error, retest };
};
