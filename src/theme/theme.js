import { createTheme, alpha } from '@mui/material/styles';
import { colors } from './colors';

const DISPLAY = "'Plus Jakarta Sans', 'Inter', sans-serif";

const buildShadows = ({ shadowSm, shadowMd, shadows: [s2, s3, s4, s5] }) => [
  'none', shadowSm, s2, s3, s4, shadowMd, ...Array(19).fill(s5),
];

export const getTheme = (mode) => {
  const t = colors.modes[mode];
  const { status } = colors;
  return createTheme({
    palette: {
      mode,
      primary: { main: t.primary, light: colors.primaryLight, dark: colors.primaryDark, contrastText: colors.white },
      secondary: { main: colors.secondary, contrastText: colors.onAccent },
      accent: { main: colors.accent, dark: colors.accentDark, contrastText: colors.onAccent },
      success: status.success,
      warning: status.warning,
      error: status.error,
      info: status.info,
      modalBody: { main: t.background },
      tableHead: { main: t.tableHead, contrastText: t.tableHeadText },
      background: { default: t.background, paper: t.paper },
      text: { primary: t.text, secondary: t.textSecondary },
      divider: t.border,
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
      caption: { fontSize: '0.75rem', color: t.caption },
    },
    shadows: buildShadows(t),
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
            '&.Mui-focusVisible': { boxShadow: `0 0 0 3px ${alpha(colors.secondary, 0.6)}` },
          },
          contained: {
            background: t.buttonBg,
            color: colors.white,
            '&:hover': {
              background: t.buttonHover,
              boxShadow: colors.shadow.brand,
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderColor: t.borderStrong,
            '&:hover': {
              borderColor: t.primary,
              backgroundColor: alpha(t.primary, 0.05),
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
            boxShadow: colors.shadow.appbar,
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
            border: `1px solid ${t.border}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${t.border}`,
            transition: 'box-shadow 0.2s ease',
            '&:hover': {
              boxShadow: t.shadows[2],
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
                borderColor: t.borderHover,
              },
              '&.Mui-focused fieldset': {
                borderColor: t.primary,
                borderWidth: '1.5px',
                boxShadow: `0 0 0 3px ${alpha(t.primary, 0.12)}`,
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
            border: `1px solid ${t.border}`,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 6,
            fontSize: '0.75rem',
            backgroundColor: mode === 'light' ? t.text : t.border,
            color: mode === 'light' ? colors.white : t.text,
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
              color: t.tableHeadText,
              backgroundColor: t.tableHead,
              borderBottom: `1px solid ${t.border}`,
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
                backgroundColor: t.rowHover,
              },
            },
            '& .MuiTableCell-root': {
              fontSize: '0.8125rem',
              fontVariantNumeric: 'tabular-nums',
              padding: '6px 12px',
              borderBottom: `1px solid ${t.rowDivider}`,
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
            backgroundColor: mode === 'light' ? alpha(colors.primary, 0.08) : alpha(colors.white, 0.08),
          },
          bar: {
            borderRadius: 4,
            background: `linear-gradient(90deg, ${t.primary} 0%, ${colors.secondary} 100%)`,
          },
        },
      },
      MuiSkeleton: {
        defaultProps: { animation: 'wave' },
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? alpha(colors.primary, 0.07) : alpha(colors.white, 0.06),
          },
          rounded: { borderRadius: 8 },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow: t.shadowMd,
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
};
