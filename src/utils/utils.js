import * as XLSX from "xlsx";
import { getPrint } from "../api/printers";
import { showAlert } from "./alerts";

// --- Constantes de fechas ---
export const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
export const MONTH_NAMES_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
export const DAY_NAMES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
export const DAY_NAMES_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// --- Paleta de colores para gráficas ---
export const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4'];

// --- Formateo de moneda ---
export const formatCurrency = (value, decimals = 2) =>
  `$${(value || 0).toLocaleString("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

// --- Extractor de mensaje de error ---
export const getErrorMessage = (error, fallback = "Error de conexión") =>
  error.response?.data?.message || error.message || fallback;

// --- Encuentra todos los empatados en max/min ---
export const getTied = (entries, mapLabel, mode) => {
  if (!entries.length) return "N/A";
  const vals = entries.map(e => e[1]);
  const target = mode === "best" ? Math.max(...vals) : Math.min(...vals);
  return entries.filter(e => e[1] === target).map(e => mapLabel(e[0])).join(", ");
};

export const getFormattedDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const exportToExcel = (data, prefixName, use_today = true) => {
  const worksheet = XLSX.utils.json_to_sheet(data, prefixName);

  // Crear un libro de trabajo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
  const formattedDate = getFormattedDate();

  if (use_today) {
    XLSX.writeFile(workbook, `${prefixName} ${formattedDate}.xlsx`);
  } else {
    XLSX.writeFile(workbook, `${prefixName}.xlsx`);
  }
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

  // Ajuste si los días son negativos
  if (days < 0) {
    months--;
    let prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // Ajuste si los meses son negativos
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


export const handlePrintTicket = async (endpoint, data) => {
  try {
    const response2 = await getPrint(endpoint, data);
    showAlert(
      response2.status === 200 ? "success" : "error",
      response2.status === 200 ? "Imprimiendo" : "Error de impresión",
    );
  } catch (error) {
    showAlert("warning", "No se pudo conectar a la impresora", "Verifique que la impresora esté encendida, conectada y que el servidor de impresión esté funcionando.");
  }
};