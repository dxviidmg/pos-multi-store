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

## Deuda técnica restante (frontend)

- **`SaleList`:** el select "Tipo" tiene una sola opción (`Ventas`) y sigue visible. ¿Se quita o se reactiva el filtro de apartados?
- **`NotificationsMenu` montado dos veces** en `MainLayout` (cajas de escritorio y móvil), así que abre dos WebSocket. Dejar una sola instancia.
- **`PasswordField` + `UserInfoFields`:** `admin/Profile/PasswordSection.jsx` y `ui/UserModals/*` repiten campos de contraseña y datos de usuario.
- **Modales con `Box p:3` en lugar de `ModalBody`:** `CashFlowModal`, `ConversionModal`, `DiscountModal`. Cambiarlos modifica su fondo; decidir si se unifican.
- **`App.css`:** `.status-dot--danger` e `.icon-danger` tienen `#dc2626` fijo (mismo valor que `colors.error`); pasarlo a variable CSS.
- **`useProductSearch`:** en modo texto `fetchData` solo limpia resultados; `SearchProduct` podría llamar `setData([])` directo.
- **`eslint-disable` justificados:** `hooks/useFetch.js` (deps del llamador) y `hooks/usePrinterStatus.js` (cambiar deps altera la reconexión).
