/**
 * Configuración de tipografía del tema.
 * Define fuentes, tamaños, pesos y espaciado de línea.
 */

const DISPLAY = "'Plus Jakarta Sans', 'Inter', sans-serif";
const BODY = "'Inter', sans-serif";

/**
 * Configuración de tipografía de MUI.
 * Incluye: fontFamily, h1-h6, body1-2, button, caption.
 * 
 * Paleta de tipografía:
 * - Títulos (h1-h4): Plus Jakarta Sans, 700-800, con tracking negativo
 * - Cuerpo (body1-2): Inter, 400
 * - Botones: 600, sin mayúsculas forzadas (textTransform: none)
 * - Caption: 75%, color del modo
 */
export const typographyConfig = (modeColors) => ({
  fontFamily: BODY,
  h1: {
    fontFamily: DISPLAY,
    fontWeight: 800,
    fontSize: '1.75rem',
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
  },
  h2: {
    fontFamily: DISPLAY,
    fontWeight: 700,
    fontSize: '1.5rem',
    letterSpacing: '-0.02em',
    lineHeight: 1.3,
  },
  h3: {
    fontFamily: DISPLAY,
    fontWeight: 700,
    fontSize: '1.25rem',
    letterSpacing: '-0.015em',
    lineHeight: 1.3,
  },
  h4: {
    fontFamily: DISPLAY,
    fontWeight: 700,
    fontSize: '1.125rem',
    letterSpacing: '-0.01em',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.4,
  },
  h6: {
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8125rem',
    letterSpacing: '0.01em',
  },
  caption: {
    fontSize: '0.75rem',
    color: modeColors.caption,
    lineHeight: 1.4,
  },
});
