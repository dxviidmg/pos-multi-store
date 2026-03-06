import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    h1: { fontWeight: 600, fontSize: '2.25rem', lineHeight: '2.75rem' },
    h2: { fontWeight: 600, fontSize: '1.875rem', lineHeight: '2.25rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem', lineHeight: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.3125rem', lineHeight: '1.6rem' },
    h5: { fontWeight: 600, fontSize: '1.125rem', lineHeight: '1.6rem' },
    h6: { fontWeight: 600, fontSize: '1rem', lineHeight: '1.2rem' },
    body1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.334rem' },
    body2: { fontSize: '0.75rem', fontWeight: 400, lineHeight: '1rem' },
    button: { textTransform: 'capitalize', fontWeight: 400 },
    subtitle1: { fontSize: '0.875rem', fontWeight: 400 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 400 },
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
