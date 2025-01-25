import * as XLSX from "xlsx";

export const getFormattedDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const exportToExcel = (data, prefixName, use_today = true) => {
  console.log(data, prefixName);
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
