// --- Constantes de fechas ---
export const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
export const MONTH_NAMES_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
export const DAY_NAMES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
export const DAY_NAMES_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const getFormattedDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getFormattedDateTime = (isoDate) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(date);
};

export const formatTimeFromDate = (dateString) => {
  let date = "";
  if (dateString) {
    date = new Date(dateString);
  } else {
    date = new Date();
  }
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const calculateTimeAgo = (creationDate) => {
  const now = new Date();
  const createdAt = new Date(creationDate);
  const differenceInMs = now - createdAt;

  const seconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `hace ${days} dia(s)`;
  } else if (hours > 0) {
    return `hace ${hours} horas(s)`;
  } else if (minutes > 0) {
    return `hace ${minutes} minuto(s)`;
  } else {
    return `hace ${seconds} segundo(s)`;
  }
};

export function getDateDifference(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    let prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let result = [];
  if (years > 0) result.push(`${years} año${years > 1 ? "s" : ""}`);
  if (months > 0) result.push(`${months} mes${months > 1 ? "es" : ""}`);
  if (days > 0) result.push(`${days} día${days > 1 ? "s" : ""}`);

  return result.join(" ");
}
