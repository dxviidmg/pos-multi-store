/**
 * Paleta base del tema — primitivas (colores, sombras, gradientes).
 * No depende de modo (light/dark); modo se aplica en factory.js
 */

import { colors } from './colors';

/**
 * Construye el arreglo de sombras MUI a partir de primitivas.
 * Formato MUI: 25 sombras (índice 0-24)
 * @param {Object} modeColors - Objeto con colores del modo actual
 * @returns {Array} Arreglo de 25 sombras
 */
export const buildShadows = ({ shadowSm, shadowMd, shadows: [s2, s3, s4, s5] }) => [
  'none',
  shadowSm,
  s2,
  s3,
  s4,
  shadowMd,
  ...Array(19).fill(s5),
];

/**
 * Objeto base de paleta. Contiene colores y sombras primitivas.
 * Usado por la factory para construir la paleta final según el modo.
 */
export const paletteBase = {
  status: colors.status,
  white: colors.white,
  secondary: colors.secondary,
  accent: colors.accent,
  accentDark: colors.accentDark,
  onAccent: colors.onAccent,
  primaryLight: colors.primaryLight,
  primaryDark: colors.primaryDark,
  shadows: colors.shadow,
  gradients: colors.gradient,
};

/**
 * Configuración de forma (border radius)
 */
export const shapeConfig = {
  borderRadius: 8,
};
