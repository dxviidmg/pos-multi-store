import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    fontSize: 16,
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '1rem',
    },
    button: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    caption: {
      fontSize: '0.875rem',
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
          fontSize: '0.875rem',
        },
      },
      defaultProps: {
        density: 'compact',
      },
    },
  },
});
