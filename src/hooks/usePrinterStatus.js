import { useState, useEffect, useRef, useCallback } from "react";
import { testPrinterConnection } from "../api/printers";
import { getPrinterWsUrl } from "../api/utils";

// Reconnect backoff (ms) while the WS is down. Grows until it caps out.
const RECONNECT_STEPS = [3000, 5000, 10000];
// Heartbeat interval to detect dead sockets that never fired onclose.
const HEARTBEAT_MS = 25000;
// WS endpoint exposed by the local printer service.
const WS_ENDPOINT = "printer-status";

/**
 * Hook para verificar el estado de conexión de la impresora en tiempo real.
 *
 * Estrategia:
 *  - Canal principal: WebSocket contra el servicio local de impresora
 *    (ej. ws://localhost:5000/printer-status/). El servicio empuja el estado
 *    al conectar y en cada cambio; el cliente no envía tráfico salvo un ping
 *    de heartbeat. Si el socket se cae/no conecta, se reintenta con backoff
 *    (por eso también cubre el caso de abrir la app antes que el servicio).
 *  - Fallback: si el WebSocket no puede crearse o el navegador no lo soporta,
 *    se usa el GET /status/ HTTP previo para no romper versiones antiguas del
 *    servicio de impresora.
 *
 * Contrato de mensajes esperado del servicio (servidor -> cliente):
 *   { "type": "printer_status", "connected": true,  "error": null }
 *   { "type": "printer_status", "connected": false, "error": "Sin papel" }
 *
 * @param {string|null} printer - ID de impresora (null si no hay).
 * @param {Object} options - Opciones.
 * @param {boolean} options.testOnMount - Si debe conectar/probar al montar (default: true).
 * @param {*} options.triggerDep - Dependencia adicional para (re)activar (ej: isOpen de un modal).
 * @returns {{ connected: boolean|null, error: string|null, retest: Function }}
 */
export const usePrinterStatus = (printer, options = {}) => {
  const { testOnMount = true, triggerDep } = options;
  const [connected, setConnected] = useState(null);
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const heartbeatTimerRef = useRef(null);
  const attemptRef = useRef(0);
  // Evita que callbacks de un socket viejo (tras cleanup) muten el estado.
  const activeRef = useRef(false);

  const active = testOnMount && (triggerDep === undefined || triggerDep) && !!printer;

  const clearTimers = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  const closeSocket = useCallback(() => {
    clearTimers();
    if (wsRef.current) {
      // Quitamos handlers antes de cerrar para no disparar reconexión.
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      try {
        wsRef.current.close();
      } catch {
        // noop
      }
      wsRef.current = null;
    }
  }, [clearTimers]);

  // Fallback HTTP: usado si el WS no puede crearse.
  const httpCheck = useCallback(() => {
    testPrinterConnection()
      .then((result) => {
        if (!activeRef.current) return;
        setConnected(result.connected);
        setError(result.error || null);
      })
      .catch(() => {
        if (!activeRef.current) return;
        setConnected(false);
        setError("Error de conexión");
      });
  }, []);

  const scheduleReconnect = useCallback((connectFn) => {
    if (!activeRef.current) return;
    const delay =
      RECONNECT_STEPS[Math.min(attemptRef.current, RECONNECT_STEPS.length - 1)];
    attemptRef.current += 1;
    reconnectTimerRef.current = setTimeout(() => {
      connectFn();
    }, delay);
  }, []);

  const connect = useCallback(() => {
    if (!activeRef.current || !printer) return;
    closeSocket();

    let ws;
    try {
      ws = new WebSocket(getPrinterWsUrl(WS_ENDPOINT));
    } catch {
      // El navegador no pudo crear el socket -> caemos a HTTP y reintentamos.
      httpCheck();
      scheduleReconnect(connect);
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      if (!activeRef.current) return;
      attemptRef.current = 0; // reset backoff al conectar
      // Heartbeat: detecta sockets muertos que no dispararon onclose.
      heartbeatTimerRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(JSON.stringify({ type: "ping" }));
          } catch {
            // noop
          }
        }
      }, HEARTBEAT_MS);
    };

    ws.onmessage = (event) => {
      if (!activeRef.current) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === "printer_status") {
          setConnected(!!data.connected);
          setError(data.error || null);
        }
      } catch {
        // Mensaje no-JSON o inesperado: lo ignoramos.
      }
    };

    ws.onerror = () => {
      // onerror suele venir seguido de onclose; dejamos que onclose maneje el retry.
    };

    ws.onclose = () => {
      if (!activeRef.current) return;
      setConnected(false);
      setError((prev) => prev || "Iniciar servidor de impresora");
      clearTimers();
      scheduleReconnect(connect);
    };
  }, [printer, closeSocket, clearTimers, httpCheck, scheduleReconnect]);

  // retest: fuerza un intento de reconexión inmediato.
  const retest = useCallback(() => {
    if (!printer) {
      setConnected(null);
      setError(null);
      return;
    }
    attemptRef.current = 0;
    if (activeRef.current) {
      connect();
    } else {
      // Si el hook no está "activo" (ej: modal cerrado), al menos un check puntual.
      httpCheck();
    }
  }, [printer, connect, httpCheck]);

  useEffect(() => {
    if (!active) {
      // Sin impresora o inactivo: limpiamos estado y socket.
      activeRef.current = false;
      closeSocket();
      if (!printer) {
        setConnected(null);
        setError(null);
      }
      return undefined;
    }

    activeRef.current = true;
    attemptRef.current = 0;
    connect();

    return () => {
      activeRef.current = false;
      closeSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, printer]);

  return { connected, error, retest };
};
