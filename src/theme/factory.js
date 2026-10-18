/**
 * Factory del tema — función que arma el tema completo.
 * Importa base, tipografía y componentes, y los combina según el modo.
 */

import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { buildShadows, paletteBase, shapeConfig } from './base';
import { typographyConfig } from './typography';
import { buildComponentsConfig } from './components';

/**
 * Construye y retorna el tema MUI completo según el modo (light/dark).
 * 
 * @param {string} mode - 'light' o 'dark'
 * @returns {Object} Tema MUI (resultado de createTheme())
 * 
 * Paleta:
 * - Primary: navy de marca (#121a45)
 * - Secondary: gris azulado
 * - Accent: ámbar (#ffb020)
 * - Success/Warning/Error/Info: del objeto status
 * 
 * Tipografía:
 * - Títulos: Inter (800, 700)
 * - Cuerpo: Inter (400)
 * - Botones: 600, sin mayúsculas forzadas
 * 
 * Componentes:
 * - Customizados: Button, TextField, Dialog, Table, etc.
 */
export const getTheme = (mode) => {
  const t = colors.modes[mode];
  const { status } = colors;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: t.primary,
        light: t.primaryLight ?? paletteBase.primaryLight,
        dark: t.primaryDark ?? paletteBase.primaryDark,
        contrastText: paletteBase.white,
      },
      secondary: {
        main: t.secondary ?? paletteBase.secondary,
        contrastText: paletteBase.onAccent,
      },
      accent: {
        main: paletteBase.accent,
        dark: paletteBase.accentDark,
        contrastText: paletteBase.onAccent,
      },
      success: status.success,
      warning: status.warning,
      error: status.error,
      info: status.info,
      rowDivider: { main: t.rowDivider },
      modalBody: { main: t.modalBody },
      modalHeader: { main: t.modalHeader },
      modalField: { main: t.modalField },
      modalBorder: { main: t.modalBorder },
      tableHead: { main: t.tableHead, contrastText: t.tableHeadText },
      background: { default: t.background, paper: t.paper },
      text: { primary: t.text, secondary: t.textSecondary },
      divider: t.border,
    },
    shape: shapeConfig,
    typography: typographyConfig(t),
    shadows: buildShadows(t),
    components: buildComponentsConfig(t, mode),
  });
};
