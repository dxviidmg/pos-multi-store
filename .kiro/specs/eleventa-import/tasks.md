# Importar productos desde Eleventa — Tareas

**Backend (`~/pos_multi_store`: `products/eleventa_import.py`, vistas en `products/views.py`, pruebas en `products/test_eleventa_import.py`)**
- [x] B1. `POST products/eleventa/import-validation` según el contrato de `design.md` (registrado en `pendientes.md`)
- [x] B2. `POST products/eleventa/import` con `excluded_codes`

**Frontend**
- [x] 1. Revisar `ImportFileDrop` (sin `accept`, sin cambios) y `DataTable` (falta `selectedIds`)
- [x] 2. `DataTable`: prop opcional `selectedIds` → `rowSelectionModel`
- [x] 3. API: `importEleventaValidation` e `importEleventa` en `catalog-products.js` y re-export en `products.js`
- [x] 4. Partir `ProductImport.jsx`: mover el contenido actual a `TraditionalImport.jsx` sin cambios de comportamiento
- [x] 5. Shell `ProductImport.jsx` con pestañas (`Tabs`) de modo (R1)
- [x] 6. `useEleventaImport.js` (selección de ceros, `excluded_codes`, resumen)
- [x] 7. `ZeroStockSelector.jsx` (R6)
- [x] 8. `EleventaImport.jsx` y `eleventaImport.columns.jsx` (R3, R5)
- [x] 9. Actualizar `helpTexts.js`, `pageMeta.js` (R8)
- [x] 10a. `AGENTS.md` (DataTable `selectedIds`, patrón de referencia)
- [x] 10b. `README.md`
- [x] 11. `npx eslint --ext .js,.jsx src` y `npm run build`
- [ ] 12. Prueba manual con `inventario jugueteria.xls` en tienda única y multi-sucursal (requiere B1 y B2)
