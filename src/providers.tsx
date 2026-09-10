'use client';

import React, { useMemo, useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import { getQueryClient } from './api/queryClient';
import { getTheme } from './theme';
import { UserProvider } from './context/UserContext';
import { WebSocketProvider } from './context/WebSocketContext';
import ConnectionStatusBanner from './components/ui/ConnectionStatusBanner';

type ThemeMode = 'light' | 'dark';

interface ThemeModeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType>({
  mode: 'light',
  toggleMode: () => {},
});

export const useThemeModeContext = () => useContext(ThemeModeContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  // Leer el modo desde localStorage solo en cliente (tras el montaje).
  // Nunca condicionamos el árbol de providers a esto; de lo contrario los
  // consumidores de estos contextos (p.ej. useUser) renderizarían sin
  // provider en el server / primer render de cliente y lanzarían error.
  useEffect(() => {
    const savedMode = (localStorage.getItem('themeMode') as ThemeMode) || 'light';
    setMode(savedMode);
  }, []);

  // Mantener sincronizados localStorage y el atributo data-theme del <html>,
  // que es lo que activan las variables CSS (.card, etc.) en modo oscuro.
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    localStorage.setItem('hasSeenUpdates', 'true');
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);
  const queryClient = getQueryClient();

  const themeModeValue = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <WebSocketProvider>
            <ThemeModeContext.Provider value={themeModeValue}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ConnectionStatusBanner />
                {children}
              </ThemeProvider>
            </ThemeModeContext.Provider>
          </WebSocketProvider>
        </UserProvider>
      </QueryClientProvider>
    </Provider>
  );
}
