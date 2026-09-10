'use client';

import React, { useMemo, useState, useEffect } from 'react';
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

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState('light');

  // Get theme mode from localStorage only on client (after mount).
  // We never gate the provider tree on this, otherwise consumers of
  // these contexts (e.g. useUser) would render without a provider on
  // the server / first client render and throw.
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') || 'light';
    setMode(savedMode);
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);
  const queryClient = getQueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <WebSocketProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ConnectionStatusBanner />
              {children}
            </ThemeProvider>
          </WebSocketProvider>
        </UserProvider>
      </QueryClientProvider>
    </Provider>
  );
}
