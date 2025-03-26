import * as XLSX from "xlsx";
import {printTicket } from "../apis/sales";
import Swal from "sweetalert2";
import { getUserData } from "../apis/utils";




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


const showAlert = (icon, title, text = "", timer = 5000) => {
  Swal.fire({ icon, title, text, timer });
};

export const handlePrintTicket = async (data) => {

  const urlPrinter = getUserData().store_url_printer
  try {
    const response = await printTicket(urlPrinter, "ticket/", {
      data,
    });
    
    console.log()
    if (response.status !== 200){
      const text = response.code === "ERR_NETWORK" ? "Servidor no encontrado" : ""
      showAlert("error", "Error de impresión", text
      );
    }

  } catch (error) {
    showAlert("error", "Error inesperado");
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
    if (years > 0) result.push(`${years} año${years > 1 ? 's' : ''}`);
    if (months > 0) result.push(`${months} mes${months > 1 ? 'es' : ''}`);
    if (days > 0) result.push(`${days} día${days > 1 ? 's' : ''}`);

    return result.join(" ");
}