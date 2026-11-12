import { DAY_NAMES } from "../../../utils/date";

const MS_PER_DAY = 86400000;

const metricValue = (metricType) => (sale) => (metricType === "total" ? (sale.total || 0) : 1);

// Primera y última clave de las entradas ordenadas de mayor a menor
const bestAndWorst = (totals, format = (key) => key) => {
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return ["N/A", "N/A"];
  return [format(entries[0][0]), format(entries[entries.length - 1][0])];
};

const sumBy = (sales, getKey, getValue) => {
  const totals = {};
  sales.forEach((sale) => {
    const key = getKey(sale);
    totals[key] = (totals[key] || 0) + getValue(sale);
  });
  return totals;
};

/** Totales, ganancia, margen y días transcurridos del periodo (month 0 = todo el año). */
export const getSalesKpis = (dashboardData, { metricType, year, month }) => {
  if (!dashboardData?.sales?.length) return null;
  const salesData = dashboardData.sales;
  const totalSales = salesData.length;
  const totalAmount = metricType === "total"
    ? salesData.reduce((sum, s) => sum + (s.total || 0), 0)
    : totalSales;
  const totalProfit = metricType === "total"
    ? salesData.reduce((sum, s) => sum + (s.profit || 0), 0)
    : 0;
  const marginPercentage = metricType === "total" && totalAmount > 0
    ? ((totalProfit / totalAmount) * 100).toFixed(2)
    : 0;

  const now = new Date();
  const totalDaysInPeriod = month === 0 ? 365 : new Date(year, month, 0).getDate();
  const isCurrentPeriod = month === 0
    ? year === now.getFullYear()
    : year === now.getFullYear() && month === now.getMonth() + 1;
  const elapsedDays = month === 0 ? Math.floor((now - new Date(year, 0, 1)) / MS_PER_DAY) + 1 : now.getDate();
  const daysInPeriod = isCurrentPeriod ? elapsedDays : totalDaysInPeriod;

  return { totalSales, totalAmount, totalProfit, marginPercentage, daysInPeriod };
};

/** Ventas, ganancias, margen y ticket promedio por tienda. */
export const getStoreComparison = (dashboardData, metricType) => {
  if (!dashboardData?.sales?.length) return [];
  const byStore = {};

  dashboardData.stores?.forEach((store) => {
    byStore[store.id] = { id: store.id, name: store.name, ventas: 0, ganancias: 0, transacciones: 0 };
  });

  dashboardData.sales.forEach((sale) => {
    const store = byStore[sale.store_id];
    if (!store) return;
    if (metricType === "total") {
      store.ventas += sale.total || 0;
      store.ganancias += sale.profit || 0;
    } else {
      store.ventas += 1;
    }
    store.transacciones += 1;
  });

  return Object.values(byStore).map((store) => ({
    ...store,
    margen: metricType === "total" && store.ventas > 0 ? ((store.ganancias / store.ventas) * 100).toFixed(2) : 0,
    ticketPromedio: store.transacciones > 0 ? (store.ventas / store.transacciones).toFixed(2) : 0,
  }));
};

/** Mejor y peor tienda, día del mes, día de la semana (promedio) y hora. */
export const getSalesInsights = (dashboardData, { metricType, month }) => {
  if (!dashboardData?.sales?.length) return null;
  const { sales } = dashboardData;
  const value = metricValue(metricType);

  const byStore = {};
  dashboardData.stores?.forEach((s) => { byStore[s.name] = 0; });
  sales.forEach((s) => {
    const store = s.store_name || "Sin tienda";
    byStore[store] = (byStore[store] || 0) + value(s);
  });
  const [bestStore, worstStore] = bestAndWorst(byStore);

  let bestDay = "N/A", worstDay = "N/A", bestDayOfWeek = "N/A", worstDayOfWeek = "N/A";
  if (month !== 0) {
    [bestDay, worstDay] = bestAndWorst(sumBy(sales, (s) => new Date(s.created_at).getDate(), value));

    // Promedio por venta de cada día de la semana
    const byDayOfWeek = {};
    const countByDayOfWeek = {};
    DAY_NAMES.forEach((day) => {
      byDayOfWeek[day] = 0;
      countByDayOfWeek[day] = 0;
    });
    sales.forEach((s) => {
      const day = DAY_NAMES[new Date(s.created_at).getDay()];
      byDayOfWeek[day] += value(s);
      countByDayOfWeek[day] += 1;
    });
    Object.keys(byDayOfWeek).forEach((day) => {
      if (countByDayOfWeek[day] > 0) byDayOfWeek[day] /= countByDayOfWeek[day];
    });
    [bestDayOfWeek, worstDayOfWeek] = bestAndWorst(byDayOfWeek);
  }

  const [bestHour, worstHour] = bestAndWorst(
    sumBy(sales, (s) => new Date(s.created_at).getHours(), value),
    (hour) => `${hour}:00`
  );

  return { bestStore, worstStore, bestDay, worstDay, bestDayOfWeek, worstDayOfWeek, bestHour, worstHour };
};
