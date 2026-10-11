import React from "react";
import { Box, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { formatCurrency } from "../../../utils/currency";

const money = (value) => (value == null ? "" : formatCurrency(value));

/** Campos que el usuario puede corregir en la tabla de errores, con el ancho de su campo. */
const EDITABLE_FIELDS = [
  { field: "code", name: "Código", width: 140 },
  { field: "cost", name: "Costo", width: 100, numeric: true },
  { field: "unit_price", name: "Precio unitario", width: 110, numeric: true },
  { field: "wholesale_price", name: "Precio mayoreo", width: 110, numeric: true },
];

/** Importe de cero o más con hasta dos decimales (o vacío). */
const MONEY_INPUT_PATTERN = /^\d*\.?\d{0,2}$/;

/** Valor de una celda editable como texto de campo (vacío si no hay valor). */
export const toFieldValue = (value) => (value == null ? "" : String(value));

const ROW_COLUMN = { name: "Número de fila", selector: (row) => row.excel_row };
const NAME_COLUMN = { name: "Nombre", selector: (row) => row.name };
const DEPARTMENT_COLUMN = { name: "Departamento", selector: (row) => row.department || "Sin departamento" };

/**
 * Columnas de la tabla de errores con campos editables.
 * @param {Object} config
 * @param {Object} config.drafts - Valores en edición: `{ [excel_row]: { [campo]: texto } }`
 * @param {Function} config.onChange - `(excelRow, field, text)`
 * @param {boolean} config.showWholesale - Muestra el precio mayoreo (solo con cantidad mínima por defecto)
 * @param {boolean} config.disabled - Bloquea los campos (revalidando)
 */
export const getEditableErrorColumns = ({ drafts, onChange, showWholesale, disabled }) => {
  const input = ({ field, name, width, numeric }) => ({
    name,
    cell: (row) => (
      <TextField
        size="small"
        value={drafts[row.excel_row]?.[field] ?? toFieldValue(row[field])}
        onChange={(event) => {
          if (!numeric || MONEY_INPUT_PATTERN.test(event.target.value)) onChange(row.excel_row, field, event.target.value);
        }}
        disabled={disabled}
        inputProps={{ "aria-label": `${name} fila ${row.excel_row}`, ...(numeric && { inputMode: "decimal" }) }}
        sx={{ width }}
      />
    ),
  });

  const [codeField, ...priceFields] = EDITABLE_FIELDS;
  return [
    ROW_COLUMN,
    input(codeField),
    NAME_COLUMN,
    DEPARTMENT_COLUMN,
    ...priceFields.filter(({ field }) => showWholesale || field !== "wholesale_price").map(input),
  ];
};

/**
 * Columna de acciones (la última de la tabla): Guardar (solo con cambios) y Quitar.
 * `onSave(row)` y `onRemove(row)` reciben la fila.
 */
export const getRowActionsColumn = ({ drafts, onSave, onRemove, disabled }) => ({
  name: "Acciones",
  width: 100,
  cell: (row) => (
    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
      <CustomTooltip text="Guardar cambios">
        <CustomButton disabled={disabled || !drafts[row.excel_row]} onClick={() => onSave(row)}>
          <SaveIcon />
        </CustomButton>
      </CustomTooltip>
      <CustomTooltip text="Quitar producto">
        <CustomButton disabled={disabled} onClick={() => onRemove(row)}>
          <DeleteIcon />
        </CustomButton>
      </CustomTooltip>
    </Box>
  ),
});

export const ZERO_STOCK_COLUMNS = [
  { name: "Código", selector: (row) => row.code, minWidth: 140 },
  { name: "Nombre", selector: (row) => row.name, minWidth: 220 },
  { name: "Departamento", selector: (row) => row.department || "Sin departamento", minWidth: 140 },
  { name: "Costo", selector: (row) => money(row.cost), minWidth: 100 },
  { name: "Precio unitario", selector: (row) => money(row.unit_price), minWidth: 120 },
];
