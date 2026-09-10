'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useUser } from './UserContext';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface WebSocketContextType {
  isConnected: boolean;
  send: (message: WebSocketMessage) => void;
  subscribe: (messageType: string, callback: (data: any) => void) => () => void;
}

const WebSocketContext = React.createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const subscribersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    // El consumer de Django Channels requiere autenticación en el handshake.
    // El WebSocket del navegador no permite headers custom, así que el token
    // (y el store_id) se envían como query params. Sin token, no conectamos.
    const token = user?.token;
    if (!token) return;

    // Derivar la URL del WebSocket del backend (no del host del frontend).
    // window.location.host apunta al dev server de Next (p.ej. localhost:3001),
    // que no tiene servidor de WebSocket; hay que usar la URL del backend.
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.REACT_APP_API_URL ||
      `${window.location.protocol}//${window.location.host}`;

    // Permite override explícito de la URL del WS de notificaciones.
    const explicitWsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.REACT_APP_WS_URL;

    const wsBase = (explicitWsUrl || apiUrl.replace(/^http/i, 'ws')).replace(/\/$/, '');
    let wsUrl = `${wsBase}/ws/notifications/?token=${encodeURIComponent(token)}`;
    if (user?.store_id) {
      wsUrl += `&store_id=${encodeURIComponent(user.store_id)}`;
    }

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket conectado');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const callbacks = subscribersRef.current.get(message.type);
          if (callbacks) {
            callbacks.forEach((callback) => callback(message.data));
          }
        } catch (error) {
          console.error('Error procesando mensaje WebSocket:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Reintentar conexión después de 3 segundos
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error conectando WebSocket:', error);
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    }
  }, [user?.token, user?.store_id]);

  useEffect(() => {
    // Si no hay sesión, cerrar cualquier conexión abierta y no reconectar.
    if (!user?.token) {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, user?.token]);

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const subscribe = useCallback(
    (messageType: string, callback: (data: any) => void) => {
      if (!subscribersRef.current.has(messageType)) {
        subscribersRef.current.set(messageType, new Set());
      }
      subscribersRef.current.get(messageType)!.add(callback);

      // Retornar función para desuscribirse
      return () => {
        const callbacks = subscribersRef.current.get(messageType);
        if (callbacks) {
          callbacks.delete(callback);
        }
      };
    },
    []
  );

  const value: WebSocketContextType = {
    isConnected,
    send,
    subscribe,
  };

  return (
    <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = React.useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket debe usarse dentro de WebSocketProvider');
  }
  return context;
}
