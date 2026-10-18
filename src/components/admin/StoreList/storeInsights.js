import { getFormattedDate } from "../../../utils/date";

/** Periodos rápidos del filtro; `noun` es cómo se nombra el periodo dentro de una frase. */
export const PERIODS = {
  today: { label: "Hoy", noun: "hoy" },
  yesterday: { label: "Ayer", noun: "ayer" },
  week: { label: "Últimos 7 días", noun: "en los últimos 7 días" },
  month: { label: "Este mes", noun: "en lo que va del mes" },
  custom: { label: "Otro rango", noun: "en este periodo" },
};

const daysAgo = (days, now) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date;
};

/** Fechas `start_date` / `end_date` de un periodo rápido (`custom` no tiene rango fijo). */
export const getPeriodRange = (period, now = new Date()) => {
  const today = getFormattedDate(now);
  if (period === "yesterday") {
    const yesterday = getFormattedDate(daysAgo(1, now));
    return { start_date: yesterday, end_date: yesterday };
  }
  if (period === "week") return { start_date: getFormattedDate(daysAgo(6, now)), end_date: today };
  if (period === "month") {
    return { start_date: getFormattedDate(new Date(now.getFullYear(), now.getMonth(), 1)), end_date: today };
  }
  return { start_date: today, end_date: today };
};

const capitalize = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : "");

/** "Buenos días, David" según la hora; sin nombre, solo el saludo. */
export const getGreeting = (user, now = new Date()) => {
  const hour = now.getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const name = capitalize(user?.first_name || user?.username);
  return name ? `${greeting}, ${name}` : greeting;
};
