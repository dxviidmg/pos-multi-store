import { colors } from './colors';

/** Publica los tokens de `colors.js` como variables CSS para App.css y los .css de componentes. */
export const applyCssVariables = (mode) => {
  const t = colors.modes[mode];
  const vars = {
    '--color-primary': colors.primary,
    '--color-primary-light': colors.primaryLight,
    '--color-primary-dark': colors.primaryDark,
    '--color-white': colors.white,
    '--color-background': t.background,
    '--color-paper': t.paper,
    '--color-text': t.text,
    '--color-text-secondary': t.textSecondary,
    '--color-border': t.border,
    '--shadow-sm': t.shadowSm,
    '--shadow-md': t.shadowMd,
  };
  const style = document.documentElement.style;
  Object.entries(vars).forEach(([name, value]) => style.setProperty(name, value));
};
