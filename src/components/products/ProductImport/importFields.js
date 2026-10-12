import { UNIT_LABELS } from "../../../constants";

const YES_NO_OPTIONS = [
  { value: "true", label: "Sí" },
  { value: "false", label: "No" },
];

const UNIT_OPTIONS = Object.entries(UNIT_LABELS).map(([value, label]) => ({ value, label }));

const readonly = (name, selector) => ({ type: "readonly", name, selector });

/** Campos de la tabla de errores del modo Especial; el precio mayoreo solo existe con cantidad mínima por defecto. */
export const getEleventaFields = ({ showWholesale }) => [
  { field: "code", name: "Código", width: 140 },
  readonly("Nombre", (row) => row.name),
  readonly("Departamento", (row) => row.department || "Sin departamento"),
  { field: "cost", name: "Costo", type: "money", width: 100 },
  { field: "unit_price", name: "Precio unitario", type: "money", width: 110 },
  ...(showWholesale ? [{ field: "wholesale_price", name: "Precio mayoreo", type: "money", width: 110 }] : []),
];

/** Campos de la tabla de errores del modo Tradicional (todos los de la plantilla); el inventario solo con stock. */
export const getTemplateFields = ({ showStock }) => [
  { field: "code", name: "Código", width: 140 },
  { field: "brand", name: "Marca", width: 140 },
  { field: "department", name: "Departamento", width: 150 },
  { field: "name", name: "Nombre", width: 220 },
  { field: "cost", name: "Costo", type: "money", width: 100 },
  { field: "unit_price", name: "Precio unitario", type: "money", width: 110 },
  { field: "wholesale_price", name: "Precio mayoreo", type: "money", width: 110 },
  { field: "min_wholesale_quantity", name: "Cantidad mínima mayoreo", type: "integer", width: 110 },
  {
    field: "wholesale_price_on_client_discount",
    name: "Mayoreo con descuento de cliente",
    type: "select",
    options: YES_NO_OPTIONS,
    width: 90,
  },
  { field: "unit", name: "Unidad", type: "select", options: UNIT_OPTIONS, width: 130 },
  ...(showStock ? [{ field: "quantity", name: "Inventario", type: "decimal", width: 100 }] : []),
];
