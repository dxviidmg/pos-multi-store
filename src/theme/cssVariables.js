import { colors } from './colors';

/** Tokens de `colors.js` como variables CSS. `variant` 'warm' usa la paleta cálida. */
export const getCssVariables = (mode, variant = 'default') => {
  const warm = variant === 'warm';
  const t = (warm ? colors.warm.modes : colors.modes)[mode];
  const brand = warm
    ? { primary: t.primary, light: t.primaryLight, dark: t.primaryDark }
    : { primary: colors.primary, light: colors.primaryLight, dark: colors.primaryDark };
  const status = warm ? colors.warm.status[mode] : null;
  return {
    '--color-primary': brand.primary,
    '--color-primary-light': brand.light,
    '--color-primary-dark': brand.dark,
    '--color-white': colors.white,
    '--color-background': t.background,
    '--color-paper': t.paper,
    '--color-text': t.text,
    '--color-text-secondary': t.textSecondary,
    '--color-border': t.border,
    '--shadow-sm': t.shadowSm,
    '--shadow-md': t.shadowMd,
    ...(status && {
      '--color-success': status.success.main,
      '--color-warning': status.warning.main,
      '--color-error': status.error.main,
    }),
  };
};

/** Publica los tokens de `colors.js` como variables CSS para App.css y los .css de componentes. */
export const applyCssVariables = (mode) => {
  const style = document.documentElement.style;
  Object.entries(getCssVariables(mode)).forEach(([name, value]) => style.setProperty(name, value));
};
