import { formatCurrency } from "../../../utils/utils";
import { formatWholesaleMin, formatWholesalePrice } from "./catalogData";

const BASE_COLUMNS = [
  { name: "Código", selector: (row) => row.code },
  { name: "Nombre", selector: (row) => row.name },
  { name: "Precio unitario", selector: (row) => formatCurrency(row.unit_price) },
];

const WHOLESALE_COLUMNS = [
  { name: "Precio mayoreo", selector: formatWholesalePrice },
  { name: "Cantidad mínima mayoreo", selector: formatWholesaleMin },
];

export const getCatalogColumns = (withWholesale) =>
  withWholesale ? [...BASE_COLUMNS, ...WHOLESALE_COLUMNS] : BASE_COLUMNS;
