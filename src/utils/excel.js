import * as XLSX from "xlsx";
import { getFormattedDate } from "./date";

export const exportToExcel = (data, prefixName, use_today = true) => {
  const worksheet = XLSX.utils.json_to_sheet(data, prefixName);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
  const formattedDate = getFormattedDate();

  if (use_today) {
    XLSX.writeFile(workbook, `${prefixName} ${formattedDate}.xlsx`);
  } else {
    XLSX.writeFile(workbook, `${prefixName}.xlsx`);
  }
};
