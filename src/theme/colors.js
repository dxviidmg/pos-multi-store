const PRIMARY = '#04346b';
const PRIMARY_LIGHT = '#065a9e';
const PRIMARY_DARK = '#022347';
const ACCENT = '#a78bfa';
const ACCENT_DARK = '#7c5cbf';

export const colors = {
  primary: PRIMARY,
  primaryLight: PRIMARY_LIGHT,
  primaryDark: PRIMARY_DARK,
  secondary: '#e94560',
  accent: ACCENT,
  accentDark: ACCENT_DARK,
  error: '#dc2626',
  whatsapp: '#25D366',
  white: '#fff',
  appbar: PRIMARY,

  background: {
    main: '#e8eef6',
    paper: '#ffffff',
  },

  text: {
    primary: '#1e293b',
    secondary: '#4a5568',
  },

  border: '#e2e8f0',

  // Fondo detrás de los modales
  backdrop: 'rgba(2,17,38,0.45)',

  shadow: {
    light: '0 1px 2px rgba(2,35,71,0.06)',
    medium: '0 8px 24px rgba(2,35,71,0.10)',
    brand: '0 4px 14px rgba(4,52,107,0.25)',
    brandHover: '0 8px 24px rgba(4,52,107,0.32)',
    appbar: '0 1px 0 rgba(0,0,0,0.08)',
    card: '0 8px 30px rgba(0,0,0,0.08)',
    toast: '0 4px 20px rgba(0,0,0,0.12)',
    dialog: '0 24px 80px rgba(0,0,0,0.2)',
    logo: 'drop-shadow(0 8px 30px rgba(0,0,0,0.25))',
  },

  gradient: {
    sidebar: `linear-gradient(180deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
    brand: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`,
    brandHover: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
    kpi: [
      `linear-gradient(135deg, ${PRIMARY} 0%, #3b82f6 100%)`,
      'linear-gradient(135deg, #047857 0%, #34d399 100%)',
      `linear-gradient(135deg, ${ACCENT_DARK} 0%, ${ACCENT} 100%)`,
      'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
      'linear-gradient(135deg, #0369a1 0%, #38bdf8 100%)',
    ],
  },
};
