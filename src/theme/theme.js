import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#04346b', light: '#065a9e', dark: '#022347' },
    secondary: { main: '#e94560' },
    success: { main: '#16a34a', light: '#dcfce7', dark: '#15803d' },
    warning: { main: '#d97706', light: '#fef3c7', dark: '#b45309' },
    error: { main: '#dc2626', light: '#fee2e2', dark: '#b91c1c' },
    info: { main: '#0284c7', light: '#e0f2fe', dark: '#0369a1' },
    ...(mode === 'light' ? {
      background: { default: '#e8eef6', paper: '#ffffff' },
      text: { primary: '#1e293b', secondary: '#4a5568' },
      divider: '#e2e8f0',
    } : {
      background: { default: '#0d1117', paper: '#161b22' },
      text: { primary: '#e6edf3', secondary: '#8b949e' },
      divider: '#30363d',
    }),
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, fontSize: '1.125rem' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.875rem' },
    body1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', fontWeight: 400, lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', letterSpacing: '0.01em' },
    caption: { fontSize: '0.75rem', color: mode === 'light' ? '#64748b' : '#8b949e' },
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.05)',
    '0 1px 3px rgba(0,0,0,0.07)',
    '0 2px 4px rgba(0,0,0,0.06)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.08)',
    ...Array(19).fill('0 4px 12px rgba(0,0,0,0.08)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '6px 16px',
          fontWeight: 600,
          fontSize: '0.8125rem',
          transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
          '&:hover': { transform: 'none' },
          '&:active': { transform: 'none' },
        },
        contained: {
          background: '#04346b',
          color: '#fff',
          '&:hover': {
            background: '#065a9e',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          },
        },
        outlined: {
          borderColor: mode === 'light' ? '#d1d5db' : '#30363d',
          '&:hover': {
            borderColor: '#04346b',
            backgroundColor: 'rgba(4,52,107,0.04)',
          },
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.75rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: 'none',
          boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRadius: 0, border: 'none' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#30363d'}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#30363d'}`,
          transition: 'box-shadow 0.15s ease',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transform: 'none',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 24,
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            fontSize: '0.875rem',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            '&:hover fieldset': {
              borderColor: mode === 'light' ? '#94a3b8' : '#484f58',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#04346b',
              borderWidth: '1.5px',
              boxShadow: '0 0 0 3px rgba(4,52,107,0.08)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.875rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#30363d'}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
          fontSize: '0.75rem',
          backgroundColor: mode === 'light' ? '#1e293b' : '#e2e8f0',
          color: mode === 'light' ? '#fff' : '#1e293b',
          padding: '4px 8px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: '#fff',
            backgroundColor: '#04346b',
            borderBottom: 'none',
            padding: '8px 12px',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background-color 0.1s ease',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.02)',
            },
          },
          '& .MuiTableCell-root': {
            fontSize: '0.8125rem',
            padding: '6px 12px',
            borderBottom: `1px solid ${mode === 'light' ? '#f1f5f9' : '#21262d'}`,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.8125rem',
          textTransform: 'none',
          minHeight: 40,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: 1,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 3,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
        },
      },
    },
  },
});
