// Paleta del POS, alineada con smartventa-landing pero en clave SaaS:
// superficies neutras y descansadas, y el azul de marca solo en acciones y estados activos.
const PRIMARY = '#1d4ed8';
const PRIMARY_LIGHT = '#3b82f6';
const PRIMARY_DARK = '#1e40af';
const ACCENT = '#ffb020';
const ACCENT_DARK = '#f59e0b';

// Navy del landing (footer y textos) para el sidebar
const SIDEBAR = '#0b1b4d';
const SIDEBAR_DARK = '#08143a';

const PRIMARY_RGB = '29,78,216';
const SHADOW_TINT = '15,23,42';
const STATUS_ERROR = '#dc2626';

export const colors = {
  primary: PRIMARY,
  primaryLight: PRIMARY_LIGHT,
  primaryDark: PRIMARY_DARK,
  secondary: '#00a4db',
  accent: ACCENT,
  accentDark: ACCENT_DARK,
  error: STATUS_ERROR,
  onAccent: '#0b1b4d',
  sidebar: SIDEBAR,
  sidebarDark: SIDEBAR_DARK,
  sidebarActive: '#00e0d8',
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

  // Tono de cada indicador (ícono sobre un fondo del mismo color al 12%)
  kpiTones: ['#1d4ed8', '#059669', '#0284c7', '#b45309', '#0f766e'],

  status: {
    success: { main: '#16a34a', light: '#dcfce7', dark: '#15803d' },
    warning: { main: '#d97706', light: '#fef3c7', dark: '#b45309' },
    error: { main: STATUS_ERROR, light: '#fee2e2', dark: '#b91c1c' },
    info: { main: '#0284c7', light: '#e0f2fe', dark: '#0369a1' },
  },

  // Tokens semánticos por modo: los consumen theme.js y cssVariables.js
  modes: {
    light: {
      primary: PRIMARY,
      primaryHover: PRIMARY_DARK,
      buttonBg: SIDEBAR,
      buttonHover: SIDEBAR_DARK,
      background: '#E8EEF6',
      paper: '#fbfcfe',
      text: '#0f172a',
      textSecondary: '#475569',
      caption: '#64748b',
      border: '#dde3ec',
      borderStrong: '#cfd6e2',
      borderHover: '#94a3b8',
      rowHover: '#f1f4f9',
      rowDivider: '#e8ecf2',
      tableHead: '#f1f4f9',
      tableHeadText: '#475569',
      shadowSm: `0 1px 2px rgba(${SHADOW_TINT},0.08)`,
      shadowMd: `0 8px 24px rgba(${SHADOW_TINT},0.12)`,
      shadows: [
        `0 1px 3px rgba(${SHADOW_TINT},0.09)`,
        `0 2px 6px rgba(${SHADOW_TINT},0.10)`,
        `0 4px 12px rgba(${SHADOW_TINT},0.11)`,
        `0 12px 32px rgba(${SHADOW_TINT},0.16)`,
      ],
    },
    dark: {
      primary: '#5b8cff',
      primaryHover: '#7aa2ff',
      buttonBg: '#5b8cff',
      buttonHover: '#7aa2ff',
      background: '#0f1420',
      paper: '#161c2a',
      text: '#e6eaf2',
      textSecondary: '#a3adc2',
      caption: '#7f8aa3',
      border: '#262f42',
      borderStrong: '#2f3a50',
      borderHover: '#4a5670',
      rowHover: 'rgba(255,255,255,0.03)',
      rowDivider: '#1f2738',
      tableHead: '#1b2232',
      tableHeadText: '#a3adc2',
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
