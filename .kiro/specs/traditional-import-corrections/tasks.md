# Importación Tradicional: correcciones en tabla e inventario 0 — Tareas

**Backend**
- [x] B1. `import_corrections.py` (genérico) y que `eleventa_import.py` lo use
- [x] B2. `product_import.py`: lectura de filas, edición, validación pura + pruebas
- [x] B3. Vistas Tradicional: `edits`, `removed_rows`, `excluded_codes`, revalidar al importar
- [x] B4. Documentar en `BENCHMARK_FEATURES_API.md`

**Frontend**
- [x] 1. `editableColumns.jsx` y `EditableErrorRows.jsx` genéricos (renombrar) con tipos de campo
- [x] 2. `importFields.js`
- [x] 3. `useEditableImport.js`; `useEleventaImport.js` lo usa
- [x] 4. (se resolvió en `useEditableImport`; no hay `useTraditionalImport`)
- [x] 5. `TraditionalImport.jsx`: tabla editable, ceros, avisos rellenos
- [x] 6. README, ayuda de la ruta, `AGENTS.md`
- [x] 7. `npx eslint --ext .js,.jsx src` y `npm run build`
- [ ] 8. Prueba manual de ambos modos
