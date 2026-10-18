# Corregir errores de importación en la tabla — Tareas

**Backend (`~/pos_multi_store`)**
- [x] B1. `parse_edits`, `parse_removed_rows`, `apply_edits` en `products/eleventa_import.py` + pruebas
- [x] B2. Vistas: leer `edits` y `removed_rows` en validación e importación
- [x] B3. Documentar en `BENCHMARK_FEATURES_API.md`

**Frontend**
- [x] 1. `useImportFlow.handleValidation({ silent })`
- [x] 2. `ImportErrorRows`: props `actions` y `keepPage`
- [x] 3. `useEleventaImport`: `edits`, `removedRows`, `saveRowEdit`, `removeRow`, `removeAllErrorRows`; limpieza al cambiar archivo e importar
- [x] 4. `getEditableErrorColumns` en `eleventaImport.columns.jsx`
- [x] 5. `EleventaErrorRows.jsx` (borradores, Guardar, Quitar, Quitar todas con confirmación)
- [x] 6. `EleventaImport.jsx` usa `EleventaErrorRows`
- [x] 7. README (lenguaje de cliente), ayuda de la ruta, `AGENTS.md` si cambia la estructura
- [x] 8. `npx eslint --ext .js,.jsx src` y `npm run build`
- [ ] 9. Prueba manual en el navegador (ver `design.md`; las vistas del backend no se han ejecutado contra Django)
