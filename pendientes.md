# Pendientes

> Última revisión: 10 de octubre de 2026. Formato: archivo:línea, qué pasa, corrección sugerida. Al corregir algo, quítalo de aquí.

## Refactorización completada ✅ (octubre 2026)

**Estado:** 14/14 refactores completados
- Redux modularizado (3 módulos)
- Tema modularizado (4 módulos)
- API Products dividida (3 módulos)
- Constants separadas (2 módulos)
- API Utils repartidas (3 módulos)
- Menu dividido (2 módulos)
- Hooks documentados (30+)
- Componentes documentados (100+)
- Auditoría limpia (0 código muerto)

**Documentación:**
- `REFACTOR_PROGRESS_FINAL.md` — Resumen ejecutivo
- `REFACTOR_13_AUDIT_REPORT.md` — Auditoría
- `HOOKS_DOCUMENTATION.md` — 30+ hooks
- `COMPONENTS_REFACTOR_GUIDE.md` — 100+ componentes
- `src/hooks/README.md` — Guía de hooks
- `src/components/README.md` — Estructura componentes

**Garantías:**
- ✅ 100% backward compatible
- ✅ 0 breaking changes
- ✅ ESLint: 0 errores
- ✅ Build: sin errores nuevos
- ✅ 13 commits documentados

---

## Requiere backend (`pos_multi_store`)

| # | Qué pasa | Corrección sugerida |
|---|---|---|
| 1 | **Los permisos solo se aplican en el frontend.** `src/constants/routeAccess.js` bloquea rutas y menú por rol y tipo de sucursal, pero la API acepta cualquier llamada con token válido (por ejemplo, un vendedor puede pedir `products/update-prices` o los tableros con una herramienta HTTP). | Replicar la matriz de `ROUTE_ACCESS` como permisos DRF por endpoint. |
| 2 | **Devolución parcial fraccionada falla.** El frontend ya permite devolver 0.5 kg (`SaleModal`), pero `SaleCancelView._return_partial` (`sales/views.py:626`) hace `ps.quantity -= qty` con un float → `TypeError` Decimal − float → 500. | Usar `Decimal(str(qty))` en la resta y en `sp.stock += qty`. |
| 3 | **No existe `GET /api/audit/notifications/`.** El respaldo por polling de `NotificationsMenu` (`src/api/notifications.js:20`) recibe 404 y se detiene. | Crear el endpoint con `[{id, event, message, store_id, store_name, created_at}]`, con el mismo alcance que el consumer. Devolver solo no leídas o recientes para no marcar todo el historial como nuevo. |
| 4 | **Impresora al cambiar de sucursal.** `getStores()` (`StoreBaseSerializer`) no incluye `printer`, así que `MainLayout.handleSelectStore` deja `store_printer = null` y no se imprimen tickets hasta volver a entrar desde la lista de Tiendas. | Agregar `printer: {id, …}` al serializer de la lista de sucursales. |
| 5 | **Editar vendedor.** `StoreWorkerSerializer` tiene `worker = UserSerializer()` anidado y escribible sin `update()`, y el campo es `store` (write-only), no `store_id`. Un `PATCH store-worker/{id}/` falla con 400/500. | Implementar `update()` o aceptar un payload plano. |

## Decisiones de producto abiertas

- **Usuarios sin sucursal que no son dueños** (rol `manager` o "Sin definir" en vista general) aterrizan en `/perfil/` con el menú vacío.

---

## Frontend Polish — Mejoras opcionales (sin impacto en backend)

**⚠️ IMPORTANTE:** Estos cambios son SOLO frontend, NO afectan API ni backend.  
**Cuándo hacer:** Al final, próxima sprint. El proyecto funciona perfectamente sin ellos.

| # | Qué pasa | Archivo | Tipo | Impacto |
|---|---|---|---|---|
| 1 | **`NotificationsMenu` montado 2x** en `MainLayout` (cajas escritorio + móvil) → abre dos WebSocket | `src/components/layout/MainLayout/MainLayout.jsx` | Consolidación | Rendimiento |
| 2 | **`SaleList` select "Tipo" con 1 opción** (`Ventas`). ¿Quitar o reactivar filtro apartados? | `src/components/sales/SaleList/SaleList.jsx` | UI/UX | Visual |
| 3 | **`PasswordField` + `UserInfoFields` repetidas** en `admin/Profile/PasswordSection.jsx` + `ui/UserModals/*` | Consolidar en `src/components/ui/UserModals/` | DRY | Mantenibilidad |
| 4 | **Modales con `Box p:3`** en lugar de `ModalBody` (`CashFlowModal`, `ConversionModal`, `DiscountModal`) | Migrar a `ModalBody` para consistencia | Refactor UI | Consistencia |
| 5 | **`App.css` hardcoded `#dc2626`** en `.status-dot--danger` e `.icon-danger` | Pasar a variable CSS `--color-error` | CSS | Mantenibilidad |
| 6 | **`useProductSearch` limpieza manual** en modo texto (podría optimizarse) | `src/components/products/SearchProduct/useProductSearch.js` | Optimización | Pequeña |

### `eslint-disable` justificados (no tocar)

- **`hooks/useFetch.js`:** deps del llamador (necesario para refetch manual)
- **`hooks/usePrinterStatus.js`:** cambiar deps altera la reconexión WebSocket
