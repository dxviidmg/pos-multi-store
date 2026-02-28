import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import App from './App';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    fontSize: 13,
    body1: {
      fontSize: '0.8125rem',
    },
    body2: {
      fontSize: '0.8125rem',
    },
    button: {
      fontSize: '0.8125rem',
      fontWeight: 600,
    },
    caption: {
      fontSize: '0.6875rem',
    },
  },
  palette: {
    text: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.85)',
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        row: {
          minHeight: '36px !important',
          maxHeight: '36px !important',
        },
        cell: {
          padding: '4px 8px',
        },
      },
      defaultProps: {
        density: 'compact',
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);
