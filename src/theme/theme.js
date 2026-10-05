import { createTheme, alpha } from '@mui/material/styles';
import { colors } from './colors';

const DISPLAY = "'Plus Jakarta Sans', 'Inter', sans-serif";

const lightShadows = [
  'none',
  colors.shadow.light,
  '0 1px 3px rgba(2,35,71,0.08)',
  '0 2px 6px rgba(2,35,71,0.08)',
  '0 4px 12px rgba(2,35,71,0.08)',
  colors.shadow.medium,
  ...Array(19).fill('0 12px 32px rgba(2,35,71,0.14)'),
];

const darkShadows = [
  'none',
  '0 1px 2px rgba(0,0,0,0.3)',
  '0 1px 3px rgba(0,0,0,0.35)',
  '0 2px 6px rgba(0,0,0,0.4)',
  '0 4px 12px rgba(0,0,0,0.4)',
  '0 8px 24px rgba(0,0,0,0.45)',
  ...Array(19).fill('0 12px 32px rgba(0,0,0,0.5)'),
];

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: colors.primary, light: colors.primaryLight, dark: colors.primaryDark },
    secondary: { main: colors.secondary },
    accent: { main: colors.accent, dark: colors.accentDark },
    success: { main: '#16a34a', light: '#dcfce7', dark: '#15803d' },
    warning: { main: '#d97706', light: '#fef3c7', dark: '#b45309' },
    error: { main: colors.error, light: '#fee2e2', dark: '#b91c1c' },
    info: { main: '#0284c7', light: '#e0f2fe', dark: '#0369a1' },
    modalBody: { main: 'rgba(4, 53, 107, 0.2)' },
    ...(mode === 'light' ? {
      background: { default: colors.background.main, paper: colors.background.paper },
      text: { primary: colors.text.primary, secondary: colors.text.secondary },
      divider: colors.border,
    } : {
      background: { default: '#0d1117', paper: '#161b22' },
      text: { primary: '#e6edf3', secondary: '#8b949e' },
      divider: '#30363d',
    }),
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: DISPLAY, fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.025em' },
    h2: { fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em' },
    h3: { fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.015em' },
    h4: { fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.875rem' },
    body1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', fontWeight: 400, lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', letterSpacing: '0.01em' },
    caption: { fontSize: '0.75rem', color: mode === 'light' ? '#64748b' : '#8b949e' },
  },
  shadows: mode === 'light' ? lightShadows : darkShadows,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '6px 16px',
          fontWeight: 600,
          fontSize: '0.8125rem',
          lineHeight: 1.4,
          transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.2s ease, transform 0.2s ease',
          '&:active': { transform: 'translateY(0) scale(0.98)' },
          '&.Mui-focusVisible': { boxShadow: `0 0 0 3px ${alpha(colors.accent, 0.7)}` },
        },
        contained: {
          background: colors.primary,
          color: colors.white,
          '&:hover': {
            background: colors.primaryLight,
            boxShadow: colors.shadow.brand,
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: mode === 'light' ? '#d1d5db' : '#30363d',
          '&:hover': {
            borderColor: colors.primary,
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
          borderRadius: 12,
          border: `1px solid ${mode === 'light' ? colors.border : '#30363d'}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${mode === 'light' ? colors.border : '#30363d'}`,
          transition: 'box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: mode === 'light' ? lightShadows[4] : darkShadows[4],
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
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
            borderRadius: 8,
            fontSize: '0.875rem',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            '&:hover fieldset': {
              borderColor: mode === 'light' ? '#94a3b8' : '#484f58',
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary,
              borderWidth: '1.5px',
              boxShadow: '0 0 0 3px rgba(4,52,107,0.12)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.875rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: `1px solid ${mode === 'light' ? colors.border : '#30363d'}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
          backgroundColor: mode === 'light' ? colors.text.primary : colors.border,
          color: mode === 'light' ? colors.white : colors.text.primary,
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
            color: colors.white,
            backgroundColor: colors.primary,
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
            fontVariantNumeric: 'tabular-nums',
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
          borderRadius: 8,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 3,
          backgroundColor: mode === 'light' ? 'rgba(4,52,107,0.08)' : 'rgba(255,255,255,0.08)',
        },
        bar: {
          borderRadius: 4,
          background: `linear-gradient(90deg, ${colors.primaryLight} 0%, ${colors.accent} 100%)`,
        },
      },
    },
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? 'rgba(4,52,107,0.07)' : 'rgba(255,255,255,0.06)',
        },
        rounded: { borderRadius: 8 },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: mode === 'light' ? lightShadows[5] : darkShadows[5],
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: { padding: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.8125rem',
          transition: 'background-color 0.15s ease',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease, transform 0.1s ease',
          '&:active': { transform: 'scale(0.92)' },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          '&:not(.MuiBadge-invisible)': { animation: 'badge-pop 0.35s var(--ease-out)' },
        },
      },
    },
  },
});
