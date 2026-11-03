export const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4'];

// Gris neutro para los segmentos atenuados (faded) de los PieChart; legible en claro y oscuro.
export const CHART_FADED = '#9ca3af';

/**
 * Encuentra todos los empatados en max/min
 */
export const getTied = (entries, mapLabel, mode) => {
  if (!entries.length) return "N/A";
  const vals = entries.map(e => e[1]);
  const target = mode === "best" ? Math.max(...vals) : Math.min(...vals);
  return entries.filter(e => e[1] === target).map(e => mapLabel(e[0])).join(", ");
};
