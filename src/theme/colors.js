// Paleta del POS: navy de marca (topbar, sidebar, botones, encabezados de tabla y pestaña activa)
// sobre neutros fríos y descansados. Es la única fuente de color: theme y cssVariables solo la leen.
const SIDEBAR = '#171A4A';
const SIDEBAR_DARK = '#171A4A';
const PRIMARY = SIDEBAR;
const PRIMARY_LIGHT = '#262A63';
const PRIMARY_DARK = '#0F1236';
const ACCENT = '#ffb020';
const ACCENT_DARK = '#f59e0b';

const PRIMARY_RGB = '23,26,74';
const STATUS_ERROR = '#dc2626';
const SECONDARY = '#00a4db';

export const colors = {
  primary: PRIMARY,
  primaryLight: PRIMARY_LIGHT,
  primaryDark: PRIMARY_DARK,
  secondary: SECONDARY,
  accent: ACCENT,
  accentDark: ACCENT_DARK,
  error: STATUS_ERROR,
  confirm: '#14A34A',
  onAccent: '#0b1b4d',
  sidebar: SIDEBAR,
  sidebarDark: SIDEBAR_DARK,
  sidebarActive: '#ffffff',
  sidebarIcon: '#8e95be',
  whatsapp: '#25D366',
  whatsappDark: '#075e54',
  googleBlue: '#4285F4',
  white: '#fff',

  // Fondo detrás de los modales
  backdrop: `rgba(${PRIMARY_RGB},0.45)`,

  shadow: {
    brand: `0 4px 14px rgba(${PRIMARY_RGB},0.22)`,
    brandHover: `0 8px 24px rgba(${PRIMARY_RGB},0.28)`,
    appbar: 'none',
    dialog: '0 24px 80px rgba(15,23,42,0.2)',
    logo: 'drop-shadow(0 8px 30px rgba(0,0,0,0.25))',
  },

  gradient: {
    brand: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`,
  },

  // Radio único (AGENTS.md §11): `base` para todo lo rectangular (cards, paneles,
  // controles, chips, tooltips); `pill` para círculos y barras finas (999px).
  radius: {
    base: '12px',
    pill: '999px',
  },

  status: {
    success: { main: '#16a34a', light: '#dcfce7', dark: '#15803d' },
    warning: { main: '#d97706', light: '#fef3c7', dark: '#b45309' },
    error: { main: STATUS_ERROR, light: '#fee2e2', dark: '#b91c1c' },
    info: { main: '#0284c7', light: '#e0f2fe', dark: '#0369a1' },
  },

  // Tokens semánticos por modo: los consumen theme.js y cssVariables.js
  // (más los de la tarjeta destacada y las pastillas, que lee `useThemeTokens`).
  modes: {
    light: {
      primary: SIDEBAR,
      primaryHover: PRIMARY_DARK,
      primaryLight: PRIMARY_LIGHT,
      primaryDark: PRIMARY_DARK,
      secondary: '#6B7090',
      buttonBg: SIDEBAR,
      buttonHover: PRIMARY_LIGHT,
      buttonDisabledBg: '#e7e9f0',
      buttonDisabledText: '#9ea3b8',
      focusRing: SIDEBAR,
      tabSelectedColor: '#1A1D3A',
      skeletonBase: '#6B7090',
      background: '#E9ECF4',
      paper: '#ffffff',
      text: '#1A1D3A',
      textSecondary: '#6B7090',
      caption: '#8c92ab',
      border: '#DCE1EC',
      borderStrong: '#C9D0E0',
      borderHover: '#a9aec4',
      rowHover: '#EDF0FA',
      rowSelected: '#E3E8FA',
      rowStripe: '#F5F7FB',
      rowDivider: '#E9ECF3',
      tableHead: SIDEBAR,
      tableHeadText: '#ffffff',
      modalHeader: '#eceef5',
      modalBody: '#e6e9f2',
      modalField: '#F5F7FB',
      modalBorder: '#b9bfd4',
      heroBg: SIDEBAR,
      heroLabel: '#aeb5da',
      heroDivider: 'rgba(255,255,255,0.12)',
      heroGlow: 'rgba(255,255,255,0.14)',
      pillBg: '#e9ebf2',
      pillActiveBg: 'rgba(255,255,255,0.2)',
      shadowSm: `0 1px 2px rgba(${PRIMARY_RGB},0.05), 0 6px 20px rgba(${PRIMARY_RGB},0.06)`,
      shadowMd: `0 8px 24px rgba(${PRIMARY_RGB},0.08)`,
      shadows: [
        `0 1px 3px rgba(${PRIMARY_RGB},0.05)`,
        `0 2px 6px rgba(${PRIMARY_RGB},0.06)`,
        `0 4px 12px rgba(${PRIMARY_RGB},0.07)`,
        `0 12px 32px rgba(${PRIMARY_RGB},0.10)`,
      ],
    },
    dark: {
      primary: '#aab3e6',
      primaryHover: '#c3caf0',
      primaryLight: '#c3caf0',
      primaryDark: SIDEBAR,
      secondary: '#a4abc9',
      buttonBg: '#2b3a8f',
      buttonHover: '#3647a8',
      buttonDisabledBg: '#262c48',
      buttonDisabledText: '#6b7294',
      focusRing: '#aab3e6',
      tabSelectedColor: '#e8eaf4',
      skeletonBase: '#aeb5da',
      background: '#0f1220',
      paper: '#171b2e',
      text: '#e8eaf4',
      textSecondary: '#a4abc9',
      caption: '#7f86a8',
      border: '#2a3050',
      borderStrong: '#363d63',
      borderHover: '#5a6390',
      rowHover: 'rgba(255,255,255,0.04)',
      rowSelected: 'rgba(170,179,230,0.14)',
      rowStripe: 'rgba(255,255,255,0.02)',
      rowDivider: '#232944',
      tableHead: '#1f2440',
      tableHeadText: '#ffffff',
      modalHeader: '#171b2e',
      modalBody: '#0f1220',
      modalField: '#1e2338',
      modalBorder: '#3a4266',
      heroBg: '#1b2766',
      heroLabel: '#aeb5da',
      heroDivider: 'rgba(255,255,255,0.12)',
      heroGlow: 'rgba(255,255,255,0.1)',
      pillBg: '#262c48',
      pillActiveBg: 'rgba(255,255,255,0.2)',
      shadowSm: '0 1px 2px rgba(0,0,0,0.3)',
      shadowMd: '0 8px 24px rgba(0,0,0,0.4)',
      shadows: [
        '0 1px 3px rgba(0,0,0,0.35)',
        '0 2px 6px rgba(0,0,0,0.4)',
        '0 4px 12px rgba(0,0,0,0.4)',
        '0 12px 32px rgba(0,0,0,0.5)',
      ],
    },
  },
};
