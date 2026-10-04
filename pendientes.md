# Pendientes

> Última revisión: 2026-10-04. Formato: archivo:línea, qué pasa, corrección sugerida. Al corregir algo, quítalo de aquí.

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

## Código muerto que requiere decisión

- **`SaleList` / reservas:** `TYPE_OPTIONS` tiene una sola opción (`Ventas`), así que las columnas Pagado/Falta, el botón "Editar pago" y `PaymentEditModal` dentro de `SaleList` nunca se usan (~40 líneas). ¿Se va a reactivar el filtro "Tipo" o se elimina?
- **`CashSummary`:** el estado `cashFlow` solo sirve para disparar otra consulta de `getCashSummary`, lo que hace ~3 peticiones al abrir y ~2 al cambiar de fecha. Quitarlo reduce peticiones sin cambiar lo que se muestra.
- **`PriceLogsList` y `TransferList`:** `useEffect(() => refetch(), [refetch])` repite la consulta que React Query ya hace al montar.
- **`MyCurrentPlan`:** `result.success` nunca es verdadero; las ramas que lo revisan no se ejecutan.
- **`StoreList`:** el filtro rápido `"pending"` no se puede seleccionar (no hay botón), así que sus ramas y varias columnas (Distribuciones, Traspasos, Acciones) no se muestran nunca.
- **Carpetas vacías sin versionar:** `src/application/sales`, `src/infrastructure/sales` y `src/domain/sales/__tests__`. Vienen de la migración a Next.js (rama `migration-to-next`). ¿Se eliminan?
- **`SellerModal` en modo edición:** `SellerList` edita vendedores con `EditUserModal`, así que la rama de edición de `SellerModal` (`updateSeller`) no se usa. Además el backend no la soporta (ver abajo). ¿Se elimina la rama?

## Fusiones sugeridas (reducen duplicación sin cambiar funcionalidad)

| Propuesta | Archivos | Ahorro aprox. |
|---|---|---|
| Hook `useFileImport` + componentes `ImportStepper` / `ImportActions` | `ProductImport`, `StoreProductImport`, `SaleImport` | ~150–200 líneas |
| `DashboardLoading`, `DashboardEmpty`, `PeriodFilters`, `StoreBarChart`, `StatTile` | 5 tableros de `admin/Dashboard` | ~350 líneas |
| Fábricas de columnas (`cashCol`, `countCol`, columnas de administrador) y un mapa de filtros | `StoreList.columns.jsx` | ~150 líneas |
| `HeaderPopoverMenu` + hook `useStoreScopedList` | `PendingMenu`, `DuplicateSalesMenu`, `StockRequestMenu`, `NotificationsMenu` | ~130 líneas |
| `GridCardBase` para tarjetas de producto | `ProductGridCard`, `StoreProductGridCard` | ~90 líneas |
| `CountAutocomplete` para selector de marca/departamento con conteo | `ProductList`, `StoreProductList`, `StoreProductAuditList`, `ProductModal` | ~60 líneas |
| `PasswordField` + `UserInfoFields` | `Profile.jsx`, `UserModals/*` | ~80 líneas |
| `SaleSearchFilters` + `SaleActionsCell` | `SaleList`, `ReservationList` | ~75 líneas |
| `QuantityInput` + `deleteColumn()` | `cartColumns.js` | ~60 líneas |
| `DateRangeFilter` | `SellerList`, `ClientList`, `CashFlowList` | ~30 líneas |

## Colores hardcodeados pendientes de pasar a tokens del tema

- `#64748b` en ejes de gráficas (8 veces) → constante `CHART_TICK_STYLE` en `utils/chart.js`.
- `rgba(244, 67, 54, …)`, `rgba(255, 193, 7, …)` y `#fff` en `MainLayout.jsx` → `error.main`, `warning.main`, `common.white`.
- Degradado `#04346b → #065a9e` repetido en `Registration.styles.js` y `MyCurrentPlan.jsx` → `colors.gradient.brand`.
- Campos resaltados de `PaymentModal` (`#04346b`, `#065a9e`, `#11998e`).
