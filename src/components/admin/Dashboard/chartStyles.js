// Estilos compartidos de las gráficas de los tableros (@mui/x-charts).
// Los textos de los ejes son SVG: se usa la variable CSS del tema para que respeten el modo oscuro.

export const CHART_TICK_STYLE = { fontSize: 11, fill: "var(--color-text-secondary)" };

export const CHART_AXIS_LABEL_STYLE = { fontSize: 12, fill: "var(--color-text-secondary)" };

export const CHART_LEGEND_TOP = {
  direction: "row",
  position: { vertical: "top", horizontal: "middle" },
  padding: 0,
};

export const CHART_MARGIN = { top: 50, bottom: 50, left: 70, right: 10 };

