# Importación Tradicional: correcciones en tabla e inventario 0 — Diseño

## Decisión principal

Se generaliza lo hecho para el modo Especial en vez de copiarlo: una pieza compartida en el frontend y otra en el backend, y cada modo solo aporta su configuración.

## Backend (`~/pos_multi_store/products`)

Nuevo módulo `import_corrections.py` (también con `SUCCESS_STATUS`, `clean_text`, `parse_money`, `to_decimal`) con lo genérico que hoy vive en `eleventa_import.py`: `parse_edits(value, editable_fields)`, `parse_removed_rows`, `parse_excluded_codes`, `apply_edits(rows, edits, removed, converters)` y `serialize_rows`. `eleventa_import.py` los importa y conserva su API y sus pruebas.

Nuevo módulo `product_import.py` (Tradicional):
- `read_template_rows(df)`: convierte el DataFrame renombrado en filas `{excel_row, code, brand, department, name, cost, unit_price, wholesale_price, min_wholesale_quantity, wholesale_price_on_client_discount, unit, quantity}`. Código, marca, departamento y nombre se normalizan a texto sin espacios (un código numérico `123.0` queda `123`).
- `EDITABLE_FIELDS` y convertidores por campo (texto, dinero con `parse_money`, entero, Sí/No, unidad en mayúsculas).
- `validate_product_rows(rows, lookups, options)`: puro (sin ORM). Replica, en el mismo orden y con los mismos mensajes, las reglas de `ProductImportValidationView` (la última que falla gana). `lookups` trae los conjuntos que consulta la vista: códigos existentes, marcas y departamentos del tenant. `options`: `create_brands`, `create_departments`, `departments_mandatory`, `import_stock`.
- Correcciones sobre el comportamiento previo: costo/precio vacío es error; `department` en lugar del `departament` con error tipográfico; marcas y departamentos se buscan dentro del tenant.

Vistas `ProductImportValidationView` y `ProductImport`:
1. Leen `edits`, `removed_rows` y (importación) `excluded_codes`; los aplican sobre las filas del archivo antes de validar.
2. La validación devuelve todas las filas con `status` (sin las quitadas).
3. La importación vuelve a validar, responde 400 "El archivo tiene errores" si hay alguno, omite `excluded_codes`, y crea los productos con la misma lógica de hoy (marcas y departamentos `get_or_create`, stock inicial con log de importación) dentro de `transaction.atomic`.

Contrato nuevo (ambos endpoints, campos opcionales además de los actuales): `edits` JSON `{ "<fila>": { "<campo>": valor } }` con los campos de R1.2 (`code`, `brand`, `department`, `name`, `cost`, `unit_price`, `wholesale_price`, `min_wholesale_quantity`, `wholesale_price_on_client_discount`, `unit`, `quantity`); `removed_rows` JSON con filas; en la importación `excluded_codes` JSON con códigos.

## Frontend (`src/components/products/ProductImport/`)

| Pieza | Cambio |
|---|---|
| `useEditableImport.js` (nuevo) | Núcleo de `useEleventaImport`: bandera de inventario (`can-include-quantity`), correcciones (`edits`, `removed_rows`), `saveRowEdit`, `removeRows`, ceros, selección, conteos y resumen. Recibe `{ baseForm, validateApi, importApi }` |
| `useEleventaImport.js` | Queda como configuración sobre `useEditableImport` (marca, opciones de mayoreo e `isFormIncomplete`) |
| `EditableErrorRows.jsx` (antes `EleventaErrorRows`) | Recibe `fields` (definición de campos) en lugar de tenerlos fijos |
| `editableColumns.jsx` (antes `eleventaImport.columns.jsx`) | Fábrica de columnas por tipo de campo: texto, dinero, entero, decimal, selección; acciones; columnas de ceros |
| `importFields.js` (nuevo) | Lista de campos de cada modo (`getEleventaFields`, `getTemplateFields`) |
| `ZeroStockSelector.jsx` | Sin cambios (ya es genérico) |
| `TraditionalImport.jsx` | Usa `useEditableImport` (con su `isFormIncomplete` de siempre), `EditableErrorRows` y `ZeroStockSelector`; avisos rellenos |

Tipos de campo: `text` (texto libre), `money` (`^\d*\.?\d{0,2}$`), `integer` (`^\d*$`), `decimal` (`^\d*\.?\d{0,3}$`), `select` (con opciones; Sí/No y unidades). Las opciones de unidad salen de `UNIT_LABELS`.

Valores de los campos Sí/No: la fila trae un valor booleano; el selector muestra Sí/No y envía `"true"`/`"false"`.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| Cambiar la validación Tradicional rompe casos existentes | Mismas reglas, orden y mensajes; pruebas unitarias del módulo puro con casos de cada mensaje |
| La importación ahora rechaza con errores | El frontend ya solo permite importar tras validar sin errores |
| Refactor de `useEleventaImport` | Se verifica con lint, build y prueba manual de ambos modos |

## Verificación
Pruebas unitarias del backend (`product_import.py`, `import_corrections.py`). `npx eslint --ext .js,.jsx src`, `npm run build`. Manual: ambos modos con `inventario jugueteria (2).xls` y con la plantilla de productos (errores de marca, unidad, cantidad mínima y mayoreo; inventario 0).
