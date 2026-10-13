# Menú con secciones y pestañas — Tareas

- [x] 1. `menu-sections.js`: `SECTIONS`, `getSectionByPath`, `getAccessibleTabs`
- [x] 2. `ui/SectionTabs.jsx`, dibujada por `PageHeader`
- [x] 3. `menu-config.js` y `menu-builders.js`: entradas por sección, enlace directo con `fullLabel`, quitar duplicados por rol
- [x] 4. Estado activo del sidebar y del panel móvil por sección
- [x] 5. `ProductImport.jsx`: `ToggleButtonGroup` en lugar de `Tabs`
- [ ] 6. Revisar con `access_blocked`: hoy el menú no se restringe en ese modo (comportamiento previo); decidir si se limita a Facturación y Perfil
- [ ] 7. `helpTexts.js`: faltan ayudas (ya faltaban antes) de `/apartados/`, `/conversiones/`, `/solicitudes-ajustes-stock/`, `/auditoria-inventario/`, `/historial-precios/` y `/mi-plan-actual/`
- [x] 8. `README.md` (navegación) y `AGENTS.md` (§5, §6 y §8: `menu-sections.js`, `SectionTabs`)
- [x] 9. `npx eslint --ext .js,.jsx src` y `npm run build`
- [ ] 10. Prueba manual: tienda, almacén, vista general, vendedor, móvil y tema oscuro
