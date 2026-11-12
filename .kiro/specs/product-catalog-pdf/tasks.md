# Catálogo de productos para clientes — Tareas

- [x] 1. Confirmar con el API (resultado en `design.md` §Verificación del API). Pendiente de prueba manual: CORS del bucket S3 con `Origin: http://localhost:3000`
- [x] 2. Agregar dependencias `jspdf` y `jspdf-autotable` (versiones fijas)
- [x] 3. `routeAccess.js`: `/catalogo/` solo dueño en vista general
- [x] 4. `menu-sections.js`: pestaña "Catálogo" en la sección `products`
- [x] 5. `App.js`: ruta `/catalogo/` con `lazyRetry`
- [x] 6. `catalogData.js` + `catalogPdf.js` + `catalogData.test.js` (nombre de archivo, filas, sin/con imagen)
- [x] 7. `useCatalogPdf.js`: import dinámico, estado de carga, `showRequestError`
- [x] 8. `ProductCatalog.columns.jsx` y `ProductCatalog.jsx` (filtros, tabla, interruptor de imágenes, botón)
- [x] 9. `ProductCatalog.test.jsx`
- [x] 10. `helpTexts.js`: ayuda de `/catalogo/`
- [x] 11. `README.md` (lenguaje de cliente, fecha) y `AGENTS.md` (§5 estructura, §13 si aplica)
- [x] 12. `npx eslint --ext .js,.jsx src`, `CI=true npm test -- --watchAll=false`, `npm run build`
- [ ] 13. (bloqueado por CORS del bucket S3, ver `pendientes.md`)  Prueba manual: marca, departamento, con y sin imagen, móvil, tema oscuro, rol no dueño
