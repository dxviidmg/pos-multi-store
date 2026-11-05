import { colors } from './colors';

/** Publica los tokens de `colors.js` como variables CSS para App.css y los .css de componentes. */
export const applyCssVariables = (mode) => {
  const t = colors.modes[mode];
  const vars = {
    '--color-primary': t.primary,
    '--color-primary-light': t.primaryLight,
    '--color-primary-dark': t.primaryDark,
    '--color-white': colors.white,
    '--color-background': t.background,
    '--color-paper': t.paper,
    '--color-text': t.text,
    '--color-text-secondary': t.textSecondary,
    '--color-border': t.border,
    '--color-border-hover': t.borderHover,
    '--color-table-head': t.tableHead,
    '--color-table-head-text': t.tableHeadText,
    '--shadow-sm': t.shadowSm,
    '--shadow-md': t.shadowMd,
    '--radius-card': colors.radius.card,
    '--radius-panel': colors.radius.panel,
    '--radius-field': colors.radius.field,
    '--radius-tag': colors.radius.tag,
    '--radius-tooltip': colors.radius.tooltip,
    '--radius-pill': colors.radius.pill,
  };
  const style = document.documentElement.style;
  Object.entries(vars).forEach(([name, value]) => style.setProperty(name, value));
};
