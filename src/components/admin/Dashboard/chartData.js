import { CHART_COLORS } from "../../../utils/chart";

// Cubetas por tipo de agrupación: cantidad de posiciones y posición de cada venta
const BUCKETS = {
  monthly: { size: () => 12, index: (date) => date.getMonth() },
  daily: { size: () => 7, index: (date) => date.getDay() },
  hourly: { size: () => 24, index: (date) => date.getHours() },
  day_of_month: { size: (daysInMonth) => daysInMonth, index: (date) => date.getDate() - 1 },
};

/**
 * Series por sucursal (una por `stores[i].name`) con el monto o la cantidad de ventas
 * agrupadas por mes, día de la semana, hora o día del mes.
 */
export const getStoreSeries = (result, dataType, metricType, daysInMonth = 31) => {
  const bucket = BUCKETS[dataType];
  if (!bucket || !result?.sales?.length) return [];

  const { stores, sales } = result;
  const size = bucket.size(daysInMonth);
  const byStore = {};
  stores.forEach((store) => { byStore[store.name] = Array(size).fill(0); });

  sales.forEach((sale) => {
    const values = byStore[sale.store_name];
    if (!values) return;
    const index = bucket.index(new Date(sale.created_at));
    if (index >= 0 && index < size) values[index] += metricType === "total" ? (sale.total || 0) : 1;
  });

  return Object.entries(byStore).map(([label, data], index) => ({
    data,
    label,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
};
