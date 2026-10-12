import React from "react";
import { Box, MenuItem, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { formatCurrency } from "../../../utils/currency";

const money = (value) => (value == null ? "" : formatCurrency(value));

/** Qué texto acepta cada tipo de campo al escribir (los importes y cantidades, solo números de 0 o más). */
const INPUT_PATTERNS = {
  money: /^\d*\.?\d{0,2}$/,
  integer: /^\d*$/,
  decimal: /^\d*\.?\d{0,3}$/,
};
const INPUT_MODES = { money: "decimal", decimal: "decimal", integer: "numeric" };

/** Valor de una celda editable como texto de campo (vacío si no hay valor; los booleanos, "true"/"false"). */
export const toFieldValue = (value) => (value == null ? "" : String(value));

const ROW_COLUMN = { name: "Número de fila", selector: (row) => row.excel_row };

/**
 * Columnas de la tabla de errores a partir de la definición de campos de cada modo.
 * Un campo es `{ field, name, type, width, options }`: `type` es "text", "money", "integer", "decimal"
 * o "select" (con `options: [{ value, label }]`); con `type: "readonly"` lleva `selector(row)` y no se edita.
 * @param {Object} config
 * @param {Array} config.fields - Campos en el orden de las columnas
 * @param {Object} config.drafts - Valores en edición: `{ [excel_row]: { [campo]: texto } }`
 * @param {Function} config.onChange - `(excelRow, field, text)`
 * @param {boolean} config.disabled - Bloquea los campos (revalidando)
 */
export const getEditableColumns = ({ fields, drafts, onChange, disabled }) => {
  const toColumn = ({ field, name, type = "text", width, options, selector }) => {
    if (type === "readonly") return { name, selector };
    const pattern = INPUT_PATTERNS[type];
    return {
      name,
      cell: (row) => (
        <TextField
          size="small"
          select={type === "select"}
          value={drafts[row.excel_row]?.[field] ?? toFieldValue(row[field])}
          onChange={(event) => {
            if (!pattern || pattern.test(event.target.value)) onChange(row.excel_row, field, event.target.value);
          }}
          disabled={disabled}
          inputProps={{ "aria-label": `${name} fila ${row.excel_row}`, ...(INPUT_MODES[type] && { inputMode: INPUT_MODES[type] }) }}
          sx={{ width }}
        >
          {type === "select" && options.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
      ),
    };
  };
  return [ROW_COLUMN, ...fields.map(toColumn)];
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
