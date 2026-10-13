// Paleta del POS: navy de marca (topbar, sidebar, botones, encabezados de tabla y pestaña activa)
// sobre neutros fríos y descansados. Es la única fuente de color: theme y cssVariables solo la leen.
const SIDEBAR = '#121a45';
const SIDEBAR_DARK = '#121a45';
const PRIMARY = SIDEBAR;
const PRIMARY_LIGHT = '#2b3578';
const PRIMARY_DARK = '#0b1233';
const ACCENT = '#ffb020';
const ACCENT_DARK = '#f59e0b';

const PRIMARY_RGB = '18,26,69';
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
  onAccent: '#0b1b4d',
  sidebar: SIDEBAR,
  sidebarDark: SIDEBAR_DARK,
  sidebarActive: '#ffffff',
  sidebarIcon: '#8e95be',
  whatsapp: '#25D366',
  googleBlue: '#4285F4',
  white: '#fff',

  // Fondo detrás de los modales
  backdrop: 'rgba(8,20,58,0.45)',

  shadow: {
    brand: `0 4px 14px rgba(${PRIMARY_RGB},0.22)`,
    brandHover: `0 8px 24px rgba(${PRIMARY_RGB},0.28)`,
    appbar: 'none',
    card: '0 8px 30px rgba(15,23,42,0.06)',
    toast: '0 4px 20px rgba(15,23,42,0.12)',
    dialog: '0 24px 80px rgba(15,23,42,0.2)',
    logo: 'drop-shadow(0 8px 30px rgba(0,0,0,0.25))',
  },

  gradient: {
    sidebar: `linear-gradient(180deg, ${SIDEBAR} 0%, ${SIDEBAR_DARK} 100%)`,
    brand: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`,
    brandHover: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
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
      secondary: '#5b6280',
      buttonBg: SIDEBAR,
      buttonHover: '#1c2760',
      buttonDisabledBg: '#e7e9f0',
      buttonDisabledText: '#9ea3b8',
      focusRing: SIDEBAR,
      tabSelectedColor: '#141a33',
      skeletonBase: '#5b6280',
      background: '#f3f4f8',
      paper: '#ffffff',
      text: '#141a33',
      textSecondary: '#5b6280',
      caption: '#8c92ab',
      border: '#e3e6ee',
      borderStrong: '#d3d7e3',
      borderHover: '#a9aec4',
      rowHover: '#f6f7fb',
      rowDivider: '#eef0f5',
      tableHead: SIDEBAR,
      tableHeadText: '#ffffff',
      modalHeader: '#eceef5',
      modalBody: '#e6e9f2',
      modalField: '#f6f7fb',
      modalBorder: '#b9bfd4',
      heroBg: SIDEBAR,
      heroLabel: '#aeb5da',
      heroDivider: 'rgba(255,255,255,0.12)',
      heroGlow: 'rgba(255,255,255,0.14)',
      pillBg: '#e9ebf2',
      pillActiveBg: 'rgba(255,255,255,0.2)',
      shadowSm: '0 1px 2px rgba(18,26,69,0.04)',
      shadowMd: '0 8px 24px rgba(18,26,69,0.08)',
      shadows: [
        '0 1px 3px rgba(18,26,69,0.05)',
        '0 2px 6px rgba(18,26,69,0.06)',
        '0 4px 12px rgba(18,26,69,0.07)',
        '0 12px 32px rgba(18,26,69,0.10)',
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
      rowDivider: '#232944',
      tableHead: '#1b2766',
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
