/**
 * Sobreescrituras de componentes MUI.
 * Define estilos y comportamientos para componentes Material-UI.
 */

import { alpha } from '@mui/material/styles';
import { colors } from './colors';

/**
 * Genera la configuración de componentes MUI según el modo.
 * @param {Object} modeColors - Colores del modo actual (light/dark)
 * @param {string} mode - 'light' o 'dark'
 * @returns {Object} Objeto de componentes para createTheme()
 */
export const buildComponentsConfig = (modeColors, mode) => ({
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
        background: modeColors.buttonBg,
        color: colors.white,
        '&:hover': {
          background: modeColors.buttonHover,
          boxShadow: colors.shadow.brand,
          transform: 'translateY(-1px)',
        },
      },
      outlined: {
        borderColor: modeColors.borderStrong,
        '&:hover': {
          borderColor: modeColors.primary,
          backgroundColor: alpha(modeColors.primary, 0.05),
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
        border: `1px solid ${modeColors.border}`,
        backgroundImage: 'none',
      },
    },
  },

  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: `1px solid ${modeColors.border}`,
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: modeColors.shadows[2],
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
            borderColor: modeColors.borderHover,
          },
          '&.Mui-focused fieldset': {
            borderColor: modeColors.primary,
            borderWidth: '1.5px',
            boxShadow: `0 0 0 3px ${alpha(modeColors.primary, 0.12)}`,
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
        border: `1px solid ${modeColors.border}`,
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 6,
        fontSize: '0.75rem',
        backgroundColor: mode === 'light' ? modeColors.text : modeColors.border,
        color: mode === 'light' ? colors.white : modeColors.text,
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
          color: modeColors.tableHeadText,
          backgroundColor: modeColors.tableHead,
          borderBottom: `1px solid ${modeColors.border}`,
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
            backgroundColor: modeColors.rowHover,
          },
        },
        '& .MuiTableCell-root': {
          fontSize: '0.8125rem',
          fontVariantNumeric: 'tabular-nums',
          padding: '6px 12px',
          borderBottom: `1px solid ${modeColors.rowDivider}`,
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
        background: `linear-gradient(90deg, ${modeColors.primary} 0%, ${colors.secondary} 100%)`,
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
        boxShadow: modeColors.shadowMd,
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
});
