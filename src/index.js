import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import App from './App';
import { getTheme } from './theme';
import { useThemeMode } from './hooks/useThemeMode';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AppWrapper = () => {
  const { mode, toggleMode } = useThemeMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App toggleTheme={toggleMode} themeMode={mode} />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(<AppWrapper />);
