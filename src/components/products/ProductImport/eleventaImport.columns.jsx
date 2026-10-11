import { formatCurrency } from "../../../utils/currency";

const money = (value) => (value == null ? "" : formatCurrency(value));

export const ERROR_COLUMNS = [
  { name: "Número de fila", selector: (row) => row.excel_row },
  { name: "Código", selector: (row) => row.code },
  { name: "Nombre", selector: (row) => row.name },
  { name: "Departamento", selector: (row) => row.department },
  { name: "Costo", selector: (row) => money(row.cost) },
  { name: "Precio unitario", selector: (row) => money(row.unit_price) },
  { name: "Precio mayoreo", selector: (row) => money(row.wholesale_price) },
  { name: "Cantidad mínima mayoreo", selector: (row) => row.min_wholesale_quantity ?? "" },
  { name: "Inventario", selector: (row) => row.quantity },
];

export const ZERO_STOCK_COLUMNS = [
  { name: "Código", selector: (row) => row.code, minWidth: 140 },
  { name: "Nombre", selector: (row) => row.name, minWidth: 220 },
  { name: "Departamento", selector: (row) => row.department || "Sin departamento", minWidth: 140 },
  { name: "Costo", selector: (row) => money(row.cost), minWidth: 100 },
  { name: "Precio unitario", selector: (row) => money(row.unit_price), minWidth: 120 },
];
