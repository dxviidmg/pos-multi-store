import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#04346b', light: '#065a9e', dark: '#022347' },
    secondary: { main: '#e94560' },
    ...(mode === 'light' ? {
      background: { default: 'rgba(4, 53, 107, 0.08)', paper: '#ffffff' },
      text: { primary: '#1e293b', secondary: '#4a5568' },
    } : {
      background: { default: '#0d1117', paper: '#161b22' },
      text: { primary: '#e6edf3', secondary: '#8b949e' },
    }),
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
    h1: { fontWeight: 700, fontSize: '2.25rem' },
    h2: { fontWeight: 700, fontSize: '1.875rem' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
    h4: { fontWeight: 600, fontSize: '1.3125rem' },
    h5: { fontWeight: 600, fontSize: '1.125rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    body1: { fontSize: '0.875rem', fontWeight: 400 },
    body2: { fontSize: '0.8rem', fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          boxShadow: 'none',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(4,52,107,0.3)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
        },
        contained: {
          background: 'linear-gradient(135deg, #04346b 0%, #065a9e 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #022347 0%, #04346b 100%)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { borderRadius: 0, border: 'none' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRadius: 0, border: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: mode === 'light' ? '1px solid #e8ecf1' : '1px solid #30363d',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: mode === 'light' ? '1px solid #e8ecf1' : '1px solid #30363d',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease',
            '&:hover fieldset': { borderColor: '#04346b' },
            '&.Mui-focused fieldset': {
              borderColor: '#04346b',
              boxShadow: '0 0 0 3px rgba(4,52,107,0.1)',
            },
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: 14,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: mode === 'light' ? '#f8fafc' : '#1e2530',
            borderRadius: '14px 14px 0 0',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: mode === 'light' ? 'rgba(15,52,96,0.04)' : 'rgba(255,255,255,0.04)',
          },
        },
        row: { minHeight: '40px !important', maxHeight: '40px !important' },
        cell: { padding: '4px 12px', fontSize: '0.875rem', borderBottom: mode === 'light' ? '1px solid rgba(4, 53, 107, 0.08)' : '1px solid #21262d' },
      },
      defaultProps: { density: 'compact' },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 8, fontSize: '0.75rem' },
      },
    },
  },
});
