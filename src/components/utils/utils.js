import * as XLSX from "xlsx";


export const getFormattedDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}/${month}/${day}`;
};


export const exportToExcel = (data, prefix_name) => {  
    console.log(data, prefix_name)
    const worksheet = XLSX.utils.json_to_sheet(data, prefix_name);

    // Crear un libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
    const formattedDate = getFormattedDate()

    XLSX.writeFile(workbook, `${prefix_name} ${formattedDate}.xlsx`);
  };