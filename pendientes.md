# Pendientes

## Alertas que no aparecen cuando falla el servidor

**Problema:** `httpClient` rechaza la petición ante cualquier error HTTP (4xx, 5xx o sin conexión). Los flujos siguientes validan `if (response.status === …) … else showRequestError(…)` sin `try/catch`. Por eso, cuando algo falla, la ejecución se detiene en el `await` y el `else` nunca corre.

**Lo que ve el usuario:** hace clic (por ejemplo en "Eliminar") y no pasa nada. No aparece ningún mensaje, así que no sabe si la acción se hizo o no. En los flujos marcados con ⏳ la barra de carga además se queda encendida.

**Corrección:** envolver cada flujo en `try/catch/finally`, como pide `RULES.md` ("Usar `try/catch/finally` en llamadas async para garantizar que loading se desactive"):

```js
// Antes
const response = await deleteBrands(ids);
if (response.status === 200) {
  showSuccess("Marcas eliminadas");
} else {
  showRequestError("eliminar las marcas", response);
}

// Después
try {
  await deleteBrands(ids);
  showSuccess("Marcas eliminadas");
} catch (error) {
  showRequestError("eliminar las marcas", error);
} finally {
  setLoading(false); // solo donde hay estado de carga
}
```

Cuando la acción sale bien, el comportamiento no cambia. Cuando falla, el usuario ve el aviso correspondiente y la carga se apaga.

### Flujos afectados (15)

| # | Archivo | Función | Acción |
|---|---|---|---|
| 1 | `src/components/catalog/CatalogList/CatalogList.jsx` | `handleDelete` | Eliminar marcas / departamentos |
| 2 | `src/components/products/ProductList/ProductList.jsx` | `handleDeleteProducts` | Eliminar productos |
| 3 | `src/components/products/ProductList/ProductList.jsx` | `handleUpperCodeProducts` | Pasar códigos a mayúsculas |
| 4 | `src/components/products/PriceUpdateModal/PriceUpdateModal.jsx` | `handleSubmit` ⏳ | Actualizar precios |
| 5 | `src/components/products/ProductReassign/ProductReassign.jsx` | `handleReassignProducts` | Reasignar productos |
| 6 | `src/components/products/StoreProductLogsModal/StoreProductLogsModal.jsx` | `handleCreateAdjustStock` | Ajustar stock |
| 7 | `src/components/inventory/DistributionList/DistributionList.jsx` | `handleSubmit` ⏳ | Confirmar distribución |
| 8 | `src/components/inventory/DistributionList/DistributionList.jsx` | `handleSaveClick` | Editar cantidad |
| 9 | `src/components/inventory/DistributionList/DistributionList.jsx` | `handleDeleteTransfer` | Eliminar producto de la distribución |
| 10 | `src/components/inventory/DistributionList/DistributionList.jsx` | `handleDeleteDistribution` | Eliminar distribución |
| 11 | `src/components/cashflow/CashFlowList/CashFlowList.jsx` | `handleDelete` | Eliminar movimiento de caja |
| 12 | `src/components/cashflow/CashFlowModal/CashFlowModal.jsx` | `handleSubmit` ⏳ | Crear / editar movimiento de caja |
| 13 | `src/components/admin/StoreList/CreateStoreModal.jsx` | `handleSubmit` ⏳ | Crear tienda |
| 14 | `src/components/clients/DiscountModal/DiscountModal.jsx` | `handleSave` | Crear descuento |

⏳ = además deja la carga encendida si falla.

En `DiscountModal`, el caso "Ese descuento ya existe" hoy revisa `response.response?.status === 400`, lo cual nunca se cumple porque la petición se rechaza antes. Al moverlo al `catch` hay que leerlo de `error.response`.

**Caso relacionado (15):** `src/components/inventory/Cart/Cart.jsx` → `handleAddToStock`. Este sí tiene `try/catch`, pero el `catch` no llama a `setLoading(false)`, así que la carga se queda encendida si falla.

---

## Bugs encontrados (no corregidos porque cambian comportamiento)

| # | Dónde | Qué pasa | Corrección sugerida |
|---|---|---|---|
| 1 | `src/components/catalog/SellerModal/SellerModal.jsx` → `handleSubmit` | Al **editar** un vendedor se llama a `updateProduct` (API de productos) en vez de la API de vendedores. | Usar la función de actualizar vendedor de `api/sellers.js` (crearla si no existe). |
| 2 | `src/components/products/SearchProduct/SearchProduct.jsx` → botón con `onClick={handleBarcodeSearch}` | `handleBarcodeSearch` solo actúa si `event.key === "Enter"`, y un clic no tiene tecla, así que **el botón de buscar código no hace nada**. | Separar un handler para el clic que ejecute la búsqueda directamente. |
| 3 | `src/components/admin/StoreList/StoreList.columns.jsx` → columna "Vaciar stock" | No revisa el rol. RULES dice que **solo el owner** puede vaciar stock, y la ruta `/tiendas/` no está restringida por rol. | Mostrar la columna solo con `user.role === "owner"` (spread condicional) y confirmar qué roles entran a `/tiendas/`. |
| 4 | `src/components/admin/StoreList/StoreList.jsx` → `conditionalRowStyles` | `DataTable` no soporta ese prop, así que **el resaltado de la tienda actual nunca se ve**. | Agregar soporte en `DataTable` (vía `getRowClassName` de DataGrid) o quitar el prop. |
| 5 | `src/components/layout/MainLayout/MainLayout.jsx` → menú móvil | En móvil, "Regresar" navega a `undefined` y "Tienda" no carga la lista de tiendas. Solo el menú de escritorio maneja `go-back` y `store-selector`. | Unificar el render del menú (ver fusiones abajo) para que móvil use la misma lógica. |
| 6 | `src/components/admin/Dashboard/Dashboard.jsx` → `periodLabel` | Con "Todo el año" (mes 0) muestra **"Enero"** (`MONTH_NAMES[0]`). Los otros tableros muestran "Todo el año". | Usar `"Todo el año"` como en `ProductsDashboard` y `CancellationsDashboard`. |
| 7 | `src/components/admin/Profile/Profile.jsx` | `<CustomSpinner />` sin `isLoading`, así que **no se ve nada mientras carga**. | `<PageSkeleton />` o `<CustomSpinner isLoading />`. |
| 8 | `src/components/ui/Button/Button.jsx` | `sx={{ minWidth: 0, ...props.sx }}` y luego `{...props}` sobrescribe `sx`; cuando alguien pasa `sx`, se pierde `minWidth: 0`. | Sacar `sx` del spread: `({ sx, ...props })` y `sx={{ minWidth: 0, ...sx }}`. |
| 9 | `src/components/products/StoreProductList/StoreProductList.jsx` → `handleSearchFieldChange` | Al cambiar de "Nombre" a "Código" borra `params.name`, pero el nombre se guarda en `params.q`, así que la búsqueda anterior queda activa. | Borrar `q` en vez de `name`. |
| 10 | `src/api/plans.js` → `getPlanEquivalent(id)` | Recibe `id` pero no lo usa en la URL. | Confirmar con backend si el endpoint necesita el id. |
| 11 | `src/components/ui/NotificationsMenu/NotificationsMenu.jsx` | La reconexión del WebSocket usa un `store_id` viejo (callback con deps `[]`), `reconnectAttempts` nunca se reinicia y el respaldo usa `fetch` directo en vez de `httpClient`. | Revisar contra la sección "Notificaciones" de RULES. |
| 12 | `StoreProductImport.jsx` y `SaleImport.jsx` → tabla "Filas con error" | Muestra **todas** las filas, no solo las que tienen error (`ProductImport` sí filtra). | Pasar solo las filas con error. |
| 13 | `src/hooks/useClientMutations.js` → `useUpdateClient` | Al **editar** un cliente con teléfono repetido no se usa `clientErrorParser`; el motivo solo se muestra si el backend lo manda como `message`/`error`. | Pasar `errorParser: clientErrorParser` también en la edición. |
| 14 | `src/components/layout/MainLayout/MainLayout.jsx` → `handleSelectStore` | Al cambiar de sucursal desde el menú lateral, `store_printer` se queda con la impresora de la sucursal anterior. `getStores()` usa `StoreBaseSerializer`, que no trae la impresora; solo `stores-cash-summary` la incluye (`printer.id`), y eso es lo que usa la lista de Tiendas. | Agregar la impresora a `StoreBaseSerializer` en el backend (o consultar la sucursal al cambiar) y actualizar `store_printer` en `handleSelectStore`. |

## Código muerto que requiere decisión

- **`SaleList` / reservas:** `TYPE_OPTIONS` tiene una sola opción (`Ventas`), así que las columnas Pagado/Falta, el botón "Editar pago" y `PaymentEditModal` dentro de `SaleList` nunca se usan (~40 líneas). ¿Se va a reactivar el filtro "Tipo" o se elimina?
- **`CashSummary`:** el estado `cashFlow` solo sirve para disparar otra consulta de `getCashSummary`, lo que hace ~3 peticiones al abrir y ~2 al cambiar de fecha. Quitarlo reduce peticiones sin cambiar lo que se muestra.
- **`PriceLogsList` y `TransferList`:** `useEffect(() => refetch(), [refetch])` repite la consulta que React Query ya hace al montar.
- **`MyCurrentPlan`:** `result.success` nunca es verdadero; las ramas que lo revisan no se ejecutan.
- **`StoreList`:** el filtro rápido `"pending"` no se puede seleccionar (no hay botón), así que sus ramas y varias columnas (Distribuciones, Traspasos, Acciones) no se muestran nunca.
- **Carpetas vacías sin versionar:** `src/application/sales`, `src/infrastructure/sales` y `src/domain/sales/__tests__`. ¿Son para una reestructura planeada?

## Fusiones sugeridas (reducen duplicación sin cambiar funcionalidad)

| Propuesta | Archivos | Ahorro aprox. |
|---|---|---|
| Hook `useFileImport` + componentes `ImportStepper` / `ImportActions` | `ProductImport`, `StoreProductImport`, `SaleImport` | ~150–200 líneas |
| Componente `SidebarNav` compartido entre menú móvil y escritorio (arregla el bug 5) | `MainLayout.jsx` | ~250 líneas |
| `DashboardLoading`, `DashboardEmpty`, `PeriodFilters`, `StoreBarChart`, `StatTile` | 5 tableros de `admin/Dashboard` | ~350 líneas |
| Fábricas de columnas (`cashCol`, `countCol`, columnas de administrador) y un mapa de filtros | `StoreList.columns.jsx` | ~150 líneas |
| `HeaderPopoverMenu` + hook `useStoreScopedList` | `PendingMenu`, `DuplicateSalesMenu`, `StockRequestMenu`, `NotificationsMenu` | ~130 líneas |
| `GridCardBase` para tarjetas de producto | `ProductGridCard`, `StoreProductGridCard` | ~90 líneas |
| `CountAutocomplete` para selector de marca/departamento con conteo | `ProductList`, `StoreProductList`, `StoreProductAuditList`, `ProductModal` | ~60 líneas |
| `PasswordField` + `UserInfoFields` | `Profile.jsx`, `UserModals/*` | ~80 líneas |
| `SaleSearchFilters` + `SaleActionsCell` | `SaleList`, `ReservationList` | ~75 líneas |
| `QuantityInput` + `deleteColumn()` | `cartColumns.js` | ~60 líneas |
| `DateRangeFilter` | `SellerList`, `ClientList`, `CashFlowList` | ~30 líneas |
| `showConfirm(title, text, { confirmText, confirmColor })` para no usar `Swal.fire` directo | `ConversionList`, `StockUpdateRequestList`, `StoreList` | — |

## Colores hardcodeados pendientes de pasar a tokens del tema

- `#64748b` en ejes de gráficas (8 veces) → constante `CHART_TICK_STYLE` en `utils/chart.js`.
- `rgba(244, 67, 54, …)`, `rgba(255, 193, 7, …)` y `#fff` en `MainLayout.jsx` → `error.main`, `warning.main`, `common.white`.
- Degradado `#04346b → #065a9e` repetido en `Registration.styles.js` y `MyCurrentPlan.jsx` → `colors.gradient.brand`.
- Campos resaltados de `PaymentModal` (`#04346b`, `#065a9e`, `#11998e`).
