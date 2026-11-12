# Corregir errores de importación en la tabla — Diseño

## Decisión principal

El backend sigue sin guardar estado. Cada validación o importación recibe el mismo archivo **más** las correcciones del usuario, y las aplica sobre lo que leyó del archivo antes de validar:

- `edits`: JSON `{ "<excel_row>": { "<campo>": <valor> } }`. Campos: `code`, `cost`, `unit_price`, `wholesale_price`. Los numéricos aceptan texto (`"$15.50"`, `""` = vacío).
- `removed_rows`: JSON con la lista de `excel_row` quitados.

Se descartó mandar las filas como JSON sin archivo: obligaría a cambiar de contrato la importación y a duplicar la lectura. Reenviar el archivo (≈400 KB) por cada guardado es aceptable.

```
tabla de errores ─ guardar / quitar ─▶ edits, removed_rows (estado en el frontend)
                                    └▶ POST products/eleventa/import-validation  (file + edits + removed_rows)
                                         └▶ filas con status ─▶ la fila corregida sale de la tabla
importar ─▶ POST products/eleventa/import  (file + edits + removed_rows + excluded_codes)
```

## Backend (`~/pos_multi_store/products/eleventa_import.py`, `views.py`)

Orden en `_load_eleventa_rows`: leer archivo → `apply_edits(rows, edits, removed)` → `apply_wholesale_options` → `validate_eleventa_rows` → código existente en el sistema.

- `parse_edits(value)` → `{int: {campo: valor}}`; JSON inválido o campo no editable → `ValueError` (400).
- `parse_removed_rows(value)` → `set[int]`.
- `apply_edits(rows, edits, removed)`: omite filas quitadas; aplica los campos (numéricos con `parse_money`; código con limpieza). `excel_row` no cambia.
- Las dos vistas leen `edits` y `removed_rows` con los mismos nombres. Sin filas restantes, la validación devuelve `[]` y la importación responde 400 "No hay productos para importar".

## Frontend

- `useImportFlow.handleValidation({ silent })`: con `silent` no muestra la advertencia de errores ni hace scroll; solo muestra el éxito cuando ya no hay errores. Sin argumento, igual que hoy.
- `useEleventaImport`: estado `edits` y `removedRows` (con refs para que `validate` e `importFile` lean lo último). Expone `saveRowEdit(excelRow, changes)`, `removeRow(excelRow)`, `removeAllErrorRows()`; cada uno actualiza el estado y llama `handleValidation({ silent: true })`. Se limpian al cambiar de archivo y al importar.
- `EleventaErrorRows.jsx`: envuelve `ImportErrorRows`; guarda los borradores por fila (`drafts[excel_row][campo]`), construye las columnas con `getEditableErrorColumns` (en `eleventaImport.columns.jsx`) y las acciones Guardar / Quitar con `CustomTooltip`.
- `ImportErrorRows`: dos props opcionales, `actions` (botones en el encabezado) y `keepPage` (en vez de volver a la primera página, solo retrocede si la actual queda vacía).
- Los campos numéricos se editan como texto; el backend los interpreta.
- Mientras corre una revalidación, los botones de la tabla se deshabilitan (`loading`).

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Muchas revalidaciones seguidas | "Quitar todas" resuelve el caso masivo en una sola; guardar/quitar se deshabilitan mientras carga |
| `excel_row` como identidad | Es estable: viene del archivo y las ediciones no lo cambian |
| Selección de inventario 0 se reinicia al revalidar | Solo aparece cuando no quedan errores, antes de elegir; no hay pérdida |

## Verificación
Pruebas unitarias del backend para `parse_edits`, `parse_removed_rows` y `apply_edits`. Manual en `/importar-productos/` con `inventario jugueteria (2).xls`: corregir un costo, quitar una fila, quitar todas, resolver un código repetido quitando la otra fila, paginar con borradores. `npx eslint --ext .js,.jsx src` y `npm run build`.
