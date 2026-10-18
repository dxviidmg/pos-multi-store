# Importar productos desde Eleventa — Diseño

## Decisión principal

El **backend** procesa el reporte de Eleventa con **dos endpoints nuevos**. El frontend es delgado: sube el archivo, pinta el resultado y manda la lista de productos con inventario 0 que el usuario decidió no importar. Los endpoints actuales (`products/import-validation`, `products/import`) no cambian.

```
archivo Eleventa ─▶ POST products/eleventa/import-validation ─┬─ errores ─▶ tabla de errores
                                                              └─ sin errores ─▶ ZeroStockSelector (R6)
                                                                                    │ excluded_codes
                                                                                    ▼
                                                              POST products/eleventa/import ─▶ "Productos importados"
```

## Contrato del backend (pendiente de implementar)

Ambos: `multipart/form-data`, mismos permisos que `products/import`, cabecera `store-id` como hoy.

### `POST products/eleventa/import-validation`
| Campo | Tipo | Notas |
|---|---|---|
| `file` | archivo | Texto con tabuladores (Latin-1 o UTF-8) o Excel (`.xls`/`.xlsx`) |
| `brand` | texto | Marca para todos los productos (1–100 caracteres) |
| `wholesale_mode` | `"quantity"`/`"ignore"` | Obligatorio. `quantity` aplica `min_wholesale_quantity` a los productos con precio mayoreo > 0; `ignore` no importa mayoreo |
| `min_wholesale_quantity` | entero ≥ 2 | Obligatorio con `wholesale_mode = quantity` |
| `import_stock` | `"Y"`/`"N"` | Solo `"Y"` si `store-products/import/can-include-quantity` es verdadero; si no, el backend lo trata como `"N"` |

Respuesta 200: arreglo en orden del archivo, una entrada por fila de datos:

```json
{ "excel_row": 2, "code": "7892022003489", "name": "Mochila…", "cost": 280, "unit_price": 395,
  "wholesale_price": null, "quantity": 6, "department": "MOCHILAS mujer y hom", "status": "Exitoso" }
```

`status` es `"Exitoso"` o el motivo (textos de R4). `excel_row` es el número de fila del archivo original. `department` sale vacío (`null`) si el texto era `- Sin Departamento -`. `quantity` es `null` si no hay columna `Inventario`. `min_wholesale_quantity` trae la cantidad mínima aplicada o `null`.
Respuesta 400 `{ "error": "<motivo>" }`: archivo ilegible, faltan columnas (`Codigo`, `Descripcion`, `Precio Costo`, `Precio Venta`), vacío, más de 10,000 filas, marca vacía.

### `POST products/eleventa/import`
Campos de la validación más `excluded_codes`: texto JSON con arreglo de códigos a omitir (`'["ABC","123"]'`; vacío = ninguno).
El backend vuelve a validar. Si hay errores responde 400 `{ "error": "El archivo tiene errores" }` y no importa nada. Si no, crea marcas y departamentos faltantes, omite `excluded_codes` y crea los productos (unidad `PZ`, sin mayoreo). Con `import_stock = "Y"` carga `quantity` como stock inicial. Respuesta 200 `{}`.

### Reglas del backend
Las de R2 (lectura, encabezados sin acentos ni mayúsculas, `Inv. Minimo` ignorado, recortes, `�` → `ñ`), R3 (valores fijos) y R4 (R4.1–R4.9). Dinero `"$1,234.00"` → número. Nombre a 100 caracteres. Códigos con ceros a la izquierda se conservan como texto. Reutiliza las validaciones de `ProductImportValidationView`.

## Frontend

```
src/api/products.js                 # re-exporta importEleventaValidation, importEleventa
src/api/catalog-products.js         # las dos funciones nuevas (getApiUrl + toFormData)
src/components/products/ProductImport/
├── ProductImport.jsx            # Shell: selector de modo (R1)
├── TraditionalImport.jsx         # Contenido actual, sin cambios de comportamiento
├── EleventaImport.jsx           # Pantalla del modo Eleventa
├── ZeroStockSelector.jsx        # Aviso + DataTable seleccionable (R6)
├── useEleventaImport.js         # useImportFlow + selección de ceros
└── eleventaImport.columns.jsx   # Columnas de errores y de ceros
src/components/ui/DataTable/DataTable.jsx   # nueva prop opcional `selectedIds`
```

### API
`toFormData` omite valores vacíos y no maneja arreglos; `excluded_codes` se manda con `JSON.stringify` y `""` si no hay exclusiones. Las funciones no mutan sus argumentos.

### useEleventaImport
Envuelve `useImportFlow` sin modificarlo:
- `initialForm`: `{ file: "", brand: "Sin marca", import_stock: canIncludeQuantity ? "" : "N" }`.
- `validate = importEleventaValidation` (recibe `formData`). Tras una validación sin errores, las filas con `quantity` vacío o 0 son los "ceros".
- `importFile = (form) => importEleventa({ ...form, excluded_codes })`.
- `canIncludeQuantity` con `useQuery` y `refetchOnMount: "always"` (`getImportCanIncludeQuantity`).
- Para leer las filas validadas, `validate` se envuelve y las guarda en estado (la respuesta de `useImportFlow` solo expone filas con error). Los ceros solo se calculan con `import_stock === "Y"` (R6.5).
- Selección: `selectedIds` (código) inicia con todos los ceros (R6.3); al cambiar el archivo se reinicia. `excluded_codes` = ceros no seleccionados. `canImport` = `flow.canImport` y al menos un producto a importar (R7.1). `summary` para R6.6.

### DataTable
Prop opcional `selectedIds` (arreglo de `id`) que se pasa a `rowSelectionModel`; sin ella, el comportamiento es el de hoy. Las filas de ceros llevan `id = code`.

### ZeroStockSelector
Presentacional: `rows`, `selectedIds`, `onChange`. `Alert info` con texto de R6.2 y conteo, botones "Seleccionar todos" / "Quitar todos", `DataTable` con `setSelectedRows`.

### EleventaImport
Misma disposición que el modo actual. Campos: `Marca` y, si `canIncludeQuantity`, `¿Agregar inventario?`. Sin `canIncludeQuantity`: `Alert info` ("Tu negocio tiene varias sucursales o ya tiene inventario: el inventario del reporte se ignora"). `ImportStepper withConfig` con `configured = brand.trim() !== "" && import_stock !== ""`. Un solo indicador de carga (`CustomSpinner` + `LinearProgress`, como hoy). `ImportFileDrop` no tiene `accept`, no requiere cambios. Columnas de errores: fila, código, nombre, costo, precio unitario, precio mayoreo, inventario, departamento.

### Selector de modo
`Tabs` de MUI ("Tradicional" / "Especial") arriba de la página, con un texto de apoyo debajo; cambiar de modo remonta el modo (`key`), lo que reinicia estado (R1.3).

## Riesgos
| Riesgo | Mitigación |
|---|---|
| El backend aún no existe | La pantalla no se puede probar de punta a punta hasta que se implemente; ver `pendientes.md` |
| Códigos en `excluded_codes` con comas o comillas | JSON, no lista separada por comas |
| Cambio de archivo tras elegir ceros | `useImportFlow` ya invalida al cambiar archivo; la selección se reinicia |
| Departamentos que difieren solo en mayúsculas | Backend los respeta como vienen; decidir si se unifican |

## Verificación
No hay pruebas automatizadas. Manual en `/importar-productos/` con `inventario jugueteria.xls` en tienda única y en multi-sucursal (conteos esperados en `requirements.md`), cuando el backend esté disponible. `npx eslint --ext .js,.jsx src` y `npm run build` sin errores.
