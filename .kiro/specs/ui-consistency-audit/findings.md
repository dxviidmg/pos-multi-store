# Auditoría de consistencia visual — SmartVenta frontend

> Última actualización: 3 de noviembre de 2026
> Alcance: `src/components/` (todos los dominios, incluido `tenant/`)
> Estándar de referencia: `AGENTS.md`
> Naturaleza: **reporte**. Los cambios de código se hacen solo tras confirmación.

Este documento acumula las auditorías de consistencia visual del frontend:

1. [Auditoría de botones](#1-auditoría-de-botones--cerrada) — ✅ cerrada (3 nov 2026)
2. [Auditoría de avisos (chips, alerts, cajas de aviso)](#2-auditoría-de-avisos--abierta) — ✅ cerrada (3 nov 2026)
3. [Auditoría de tablas](#3-auditoría-de-tablas--cerrada) — ✅ cerrada (3 nov 2026)
4. [Auditoría de modales](#4-auditoría-de-modales--cerrada) — ✅ cerrada (3 nov 2026)
5. [Auditoría de cards](#5-auditoría-de-cards--cerrada) — ✅ cerrada (3 nov 2026)

---

# 1. Auditoría de botones — CERRADA

Objetivo: que todos los botones usen `CustomButton` y compartan altura/variante.

**Resultado:** todos los botones de la app usan ahora `CustomButton`. `<Button>` crudo de `@mui/material` solo queda en `ui/Button/Button.jsx` (el propio componente) y en `ui/ErrorBoundary.jsx` (excepción intencional).

### Cambios aplicados

- **`CustomButton`** — se formalizó `variant` como prop (default `"contained"`, acepta `"outlined"` y `"text"`).
- **Botones primarios migrados:** `UserSection`, `TenantSection`, `PasswordSection`, `StoreList` (estado vacío), `CancelSubscriptionModal`.
- **Botones secundarios/terciarios migrados:** `StoreHeader` ("Ampliar plan", outlined), `LoginForm` ("Crear mi negocio", outlined), `MyCurrentPlan` ("Cancelar suscripción", text), `PlanCard` (4 botones), `NotificationsMenu` ("Limpiar", text), `PaymentsCell` (enlace de métodos de pago, text).

### Ajustes de layout

- **`/perfil/`** — los tres botones de acción usan `fullWidth` (ancho completo en todas las resoluciones).
- **`/tiendas/` (`StoreHeader`)** — `Grid container`: título + saludo + chips en `xs=12 md=6`; "Ampliar plan" y "Crear tienda" en `xs=6 md=3` (1/4 cada uno en escritorio), con `fullWidth`.

### Excepciones confirmadas

- **`ui/ErrorBoundary.jsx`** — `<Button>` crudo de MUI: es el fallback de errores y no debe depender de componentes de UI que pudieron causar el fallo.
- **`admin/Dashboard/ChartTypeSelect.jsx`** — `Select` crudo de MUI: control de presentación de la gráfica (líneas/barras), no un campo de formulario. Documentado con comentario en el archivo.
- **`admin/Dashboard/TodayReferenceLine.jsx`** — 2 `style={{}}` inline en SVG de gráfica, donde `sx` no aplica.

---

# 2. Auditoría de avisos — ABIERTA

Objetivo: estandarizar los "avisos" — `Chip` (pastillas de estado), `Alert` (banners) y cajas `Box` con fondo de estado.

**Diagnóstico general:** los avisos funcionan, pero no están estandarizados. Hay un `StatusChip` roto de facto, mapeos estado→color repetidos en cada pantalla con nombres distintos, y mezcla de `variant` en chips y alerts sin criterio.

## ~~🔴 Alta — `StatusChip` es un componente roto de facto~~ ✅ RESUELTO (3 nov 2026)

`ui/StatusChip.jsx` se rehizo como pastilla de estado estándar: recibe `tone` (STATUS_TONES) + `label`, con variante **filled** fija y size small. Deduce el tono del `label` con un mapa interno `LABEL_TONES` cuando no se pasa `tone`, y mantiene compat con la prop legada `status`.

Se creó `STATUS_TONES` en `constants/enums.js` (success/warning/error/info/default) como fuente única de tonos de estado.

### Detalle original (referencia)

`ui/StatusChip.jsx` solo aceptaba `status` y comparaba contra el string literal `"Exitoso"`:

```jsx
color={status === "Exitoso" ? "success" : "error"}
```

- Solo servía para dos estados y acoplado a un texto español exacto. Cualquier otro estado caía en "error".
- Casi nadie lo usaba.

## ~~🟠 Media — Mapeos estado→color duplicados y dispersos~~ ✅ RESUELTO (3 nov 2026)

Los `<Chip>` de estado se migraron a `StatusChip` con `tone`/`label`. Convención adoptada: **filled**.

| Archivo | Antes | Ahora |
|---|---|---|
| `inventory/StockUpdateRequestList/StockUpdateRequestList.jsx` | `<Chip>` + ternario success/warning | `StatusChip tone=…` |
| `inventory/StockModal/StockModal.jsx` | `<Chip variant="outlined">` + ternario | `StatusChip` (filled) |
| `tenant/SubscriptionList/SubscriptionList.jsx` | `statusMap` con `color` + `<Chip>` | `statusMap` con `tone` (STATUS_TONES) + `StatusChip` |
| `tenant/MyCurrentPlan/PlanCard.jsx` | `<Chip variant="filled">` "Domiciliación activada" | `StatusChip` |
| `admin/ServiceList/ServiceCard.jsx` | `<Chip>` "Gratis" | `StatusChip` |
| `admin/StoreList/StoreHeader.jsx` | `NOTICE_COLORS` + `<Chip variant="outlined">` | `NOTICE_TONES` (STATUS_TONES) + `StatusChip` (filled) |

**No migrados (no son avisos de estado):** contadores de resultados (`SearchProduct`), nombre de archivo (`ImportFileDrop`), contadores de importación (`ImportActions`), chip de impresora con sx de punto (`PaymentSubmitPanel`), chip de `AuditCard` (recibe color por prop), rol (`ProfileHero`).

## ~~🟡 Media-baja — `variant` de Alert sin criterio consistente~~ ✅ RESUELTO (3 nov 2026)

Convención adoptada: **`variant="filled"` en todos los Alerts** y radio uniforme (8px del tema, quitando los `borderRadius` locales de los alerts inline). Estandarización in situ (sin componente nuevo: MUI `Alert` + `severity` ya unifica color e ícono).

- **`variant="filled"` agregado** a los que no lo tenían: `PlanCard` (4), `StockModal` (sin stock), `BarcodeScanner`, `RestartService` (2, eran outlined), `ChangePasswordModal`, `RequireAccess`, `MyCurrentPlan`, `SubscribeModal`, `UpdateCardModal`, `CancelSubscriptionModal`, `Profile`, `Registration`, `LoginForm`.
- **Radios locales quitados** (heredan 8px): `RequireAccess`, `Registration`, `LoginForm`, `StockRequestAlert`.
- **Ya eran filled, sin cambios:** `PaymentModal`, `ProductCatalog`, `EleventaImport`, `TraditionalImport`, `StockModal` (otros 2), `PriceUpdateModal`, `ProductFormFields`.

### Excepciones confirmadas

- **Toasts flotantes** `products/SearchProduct/StockVerificationSnackbar.jsx` y `ui/ConnectionStatusBanner.jsx` conservan `borderRadius: "10px"`: son avisos flotantes con sombra, visualmente distintos de los alerts inline.
- **`ui/AuditCard/AuditCard.jsx`** usa `<Card variant="outlined">` (no es un `Alert`), fuera de alcance.

## ✅ Lo que está bien

- `EmptyState`, `ConnectionStatusBanner`, `StockRequestAlert`, `StockVerificationSnackbar`, `AuditCard` son componentes de aviso bien encapsulados y reutilizables.
- Casi no hay colores hardcodeados (solo `admin/StoreList/StoreList.jsx:145` usa `info.light` en un `conditionalRowStyle`, legítimo).
- Los `Alert` usan `severity` correctamente (no inventan colores).

## Recomendación de acción

1. ~~**🔴 Rehacer `StatusChip`**~~ ✅ **Hecho (3 nov 2026).** Recibe `tone` + `label`, variante filled, con `STATUS_TONES`.
2. ~~**🟠 Crear un mapa único de tono de estado**~~ ✅ **Hecho (3 nov 2026).** `STATUS_TONES` en `constants/enums.js`; `statusMap`/`NOTICE_TONES` lo consumen; chips migrados a `StatusChip`.
3. ~~**🟡 Definir la convención de Alerts** (filled + radio uniforme) y aplicarla.~~ ✅ **Hecho (3 nov 2026).** `variant="filled"` en todos los alerts inline, radios locales quitados (heredan 8px), toasts flotantes como excepción.

**Auditoría de avisos cerrada:** chips (`StatusChip` + `STATUS_TONES`) y alerts (filled + radio uniforme) estandarizados.

### Inventario de referencia

- **Chips (`<Chip>`):** `ui/Import/ImportActions.jsx`, `products/SearchProduct/SearchProduct.jsx`, `sales/shared/PaymentSubmitPanel.jsx`, `ui/Import/ImportFileDrop.jsx`, `ui/AuditCard/AuditCard.jsx`, `ui/StatusChip.jsx`, `inventory/StockUpdateRequestList/StockUpdateRequestList.jsx`, `inventory/StockModal/StockModal.jsx`, `tenant/MyCurrentPlan/PlanCard.jsx`, `tenant/SubscriptionList/SubscriptionList.jsx`, `admin/ServiceList/ServiceCard.jsx`, `admin/StoreList/StoreHeader.jsx`, `admin/Profile/ProfileHero.jsx`.
- **Alerts (`<Alert>`):** 22 archivos (tenant, products, inventory, sales, ui, admin, layout). Ver búsqueda `<Alert` en `src/components`.

---

# 3. Auditoría de tablas — CERRADA

Objetivo: estandarizar las tablas. Estándar: `DataTable` (envuelve `@mui/x-data-grid`), `SimpleTable` para tablas de solo lectura, `tableButtonSx` para botones dentro de tablas.

**Diagnóstico general: muy buen estado.** Las tablas están casi completamente estandarizadas:

- **Nadie usa `DataGrid` crudo.** Los 25 usos (24 archivos) pasan por `DataTable`. `DataGrid` solo aparece dentro de `ui/DataTable/DataTable.jsx`.
- **`noDataComponent` siempre presente y en español** en todos los `DataTable` y `SimpleTable`.
- **`DataTable` ya encapsula** header navy, radio 14px, paginación, skeleton de carga y `tableButtonSx` (aplicado globalmente a los botones de celda). Esto evita la mayoría de inconsistencias en origen.

Los hallazgos son menores.

## 🟠 Media — Indicador de carga inconsistente en tablas de modal

Algunos `DataTable` dentro de modales no usan `progressPending` y en su lugar ponen un indicador de carga aparte, lo que contradice la regla de `AGENTS.md` §8 ("un solo indicador de carga por vista: `progressPending` **o** `CustomSpinner`, no ambos") y rompe la consistencia con el resto (que sí usa `progressPending={loading}`).

| Archivo:línea | Qué pasa | Sugerencia |
|---|---|---|
| `products/StoreProductLogsModal/StoreProductLogsModal.jsx:127,138` | `<LinearProgress>` manual arriba + `<DataTable>` sin `progressPending` | Pasar `progressPending={loading}` al `DataTable` y quitar el `LinearProgress` manual |
| `products/PriceLogsModal/PriceLogsModal.jsx:23` | `<CustomSpinner isLoading={isLoading}>` + `<DataTable>` sin `progressPending` | Elegir uno: `progressPending={isLoading}` en el `DataTable` **o** mantener el spinner, no ambos |

## 🟡 Baja — Columnas "Acciones" sin ancho fijo cuando tienen un solo botón

Las columnas de acciones con 3+ botones fijan `width` (correcto, `AGENTS.md`), pero las de un solo botón a veces no lo fijan y quedan con `flex: 1`, estirándose más de lo necesario:

- Con `width`: `ConversionList.jsx:93` (120), `SaleList`, `DistributionList`, etc.
- Sin `width` (un botón, `flex: 1`): `clients/ClientList/ClientList.jsx:99`, `catalog/CatalogList/CatalogList.jsx:87`.

No rompe nada, pero una columna de un solo ícono estirada se ve desbalanceada. Sugerencia: fijar un `width` pequeño (p. ej. 90) a las columnas de acción de un solo botón, o definir un ancho estándar de columna de acciones.

## ✅ Lo que está bien

- Arquitectura de tabla única (`DataTable` / `SimpleTable`), sin `DataGrid` suelto.
- `noDataComponent` en español en el 100% de los casos.
- `tableButtonSx` aplicado centralizadamente; los botones de celda son consistentes (30px, íconos 18px).
- Header, radio, paginación y skeleton viven en `DataTable`, no en cada pantalla.

## Recomendación de acción

1. ~~**🟠 Unificar el indicador de carga** en `StoreProductLogsModal` y `PriceLogsModal`~~ ✅ **Hecho (3 nov 2026).** Ambos usan `progressPending={loading}` en el `DataTable`; se quitó el `LinearProgress` manual y el `CustomSpinner`.
2. ~~**🟡 Definir un ancho estándar** para columnas "Acciones" de un solo botón~~ ✅ **Hecho (3 nov 2026).** `width: 90` en `ClientList` y `CatalogList`.

**Auditoría de tablas cerrada:** sin puntos abiertos.

---

# 4. Auditoría de modales — CERRADA

Objetivo: que todos los modales usen `CustomModal` + `ModalBody` y un `maxWidth` consistente. Estándar: `CustomModal` (props `showOut`, `onClose`, `title`, `maxWidth` numérico en px, default 800) y `ModalBody` (padding responsivo + fondo `modalBody.main` + `modalFieldSx` para los inputs).

**Diagnóstico general: buen estado, con un hueco claro.** 23 modales usan `CustomModal`. Los `Dialog`/`Drawer`/`Popover` crudos son casos legítimos (ver excepciones). El hueco: **7 modales usan `CustomModal` pero arman el cuerpo a mano con `<Box sx={{ p: … }}>` en vez de `ModalBody`.**

## 🟠 Media — Modales que no usan `ModalBody`

Al no usar `ModalBody`, estos modales no aplican el fondo `modalBody.main` (se ven con el fondo del header), ni `modalFieldSx` (estilo de input de modal), y usan padding dispar (`p: 2` vs `p: 3`):

| Archivo:línea | Cuerpo actual | Debería |
|---|---|---|
| `tenant/MyCurrentPlan/SubscribeModal.jsx:11` | `<Box sx={{ p: 3 }}>` | `ModalBody` |
| `tenant/MyCurrentPlan/UpdateCardModal.jsx:16` | `<Box sx={{ p: 3 }}>` | `ModalBody` |
| `tenant/MyCurrentPlan/CancelSubscriptionModal.jsx:63` | `<Box sx={{ p: 3 }}>` | `ModalBody` |
| `admin/StoreList/StorePaymentModal.jsx:30` | `<Box sx={{ p: 3, textAlign: "center" }}>` | `ModalBody sx={{ textAlign: "center" }}` |
| `admin/StoreList/CreateStoreModal.jsx:49` | `<Box sx={{ p: 3, maxWidth: 420, mx: "auto" }}>` | `ModalBody` (+ sx extra) |
| `products/PriceUpdateModal/PriceUpdateModal.jsx:93` | `<Grid container sx={{ p: 2 }}>` | `ModalBody` envolviendo el `Grid` |
| `inventory/StockModal/StockModal.jsx:188` | `<Box sx={{ p: 2, bgcolor: "background.paper" }}>` | `ModalBody` (quita el bgcolor manual) |

Nota: los tres de `tenant` montan el Brick de Mercado Pago (`<div id=…>`); migrar a `ModalBody` solo cambia el wrapper, el contenedor del Brick se conserva.

## 🟡 Baja — `maxWidth` no numérico en `StockModal`

`inventory/StockModal/StockModal.jsx:185` pasa `maxWidth="sm"` a `CustomModal`, pero `CustomModal` espera un número en px (default 800) y lo aplica como `maxWidth` de CSS. El string `"sm"` no corresponde al contrato del componente. Sugerencia: usar un número (p. ej. `maxWidth={600}`).

## ✅ Lo que está bien

- 16 de 23 modales ya usan `CustomModal` + `ModalBody` correctamente.
- El header navy, el botón de cierre, el desenfoque de fondo y la animación `modal-enter` viven en `CustomModal` (no se repiten por pantalla).

## Excepciones confirmadas (no son `CustomModal` a propósito)

- `ui/BarcodeScanner/BarcodeScanner.jsx` — `<Dialog>` del escáner con cámara (necesita comportamiento propio).
- `admin/ServiceList/ConsultDialog.jsx` — `<Dialog>` con input/validador (AGENTS.md permite diálogos especiales fuera de `CustomModal`).
- `ui/PageHelp/PageHelp.jsx`, `ui/HeaderPopoverMenu/HeaderPopoverMenu.jsx` — `<Popover>` (poppers, no modales).
- `layout/MainLayout/SidebarDrawer.jsx` — `<Drawer>` (sidebar, no modal).

## Recomendación de acción

1. ~~**🟠 Migrar los 7 modales a `ModalBody`**~~ ✅ **Hecho (3 nov 2026).** `SubscribeModal`, `UpdateCardModal`, `CancelSubscriptionModal`, `StorePaymentModal`, `CreateStoreModal`, `PriceUpdateModal`, `StockModal` ahora usan `ModalBody`; el `sx` extra (textAlign, maxWidth interno) se movió al cuerpo.
2. ~~**🟡 Corregir `maxWidth`** de `StockModal`~~ ✅ **Hecho (3 nov 2026).** `maxWidth="sm"` → `maxWidth={600}`.

**Auditoría de modales cerrada:** sin puntos abiertos.

---

# 5. Auditoría de cards — CERRADA

Objetivo: radio consistente en las tarjetas. Estándar del tema: `MuiCard`/`MuiPaper` = **14px** (automático), clase `.card` = 16px (`--radius-lg`), `MuiChip` = 999px.

**Diagnóstico:** el tema ya estandariza bien las superficies MUI. El problema eran las **tarjetas de contenido construidas a mano con `Box` + borde + fondo paper**, cada una con un radio distinto (12/14/16) para el mismo concepto.

## 🟠 Media — Tarjetas "a mano" con radios inconsistentes ✅ RESUELTO (3 nov 2026)

Convención adoptada (Opción A): **radio 14px** para las tarjetas de contenido (coincide con `Card`/`Paper` del tema). Se unificó el valor sin cambiar la estructura.

| Archivo | Antes | Ahora |
|---|---|---|
| `products/shared/GridCardBase.jsx:29` | `12px` | `14px` |
| `inventory/Cart/CartItemCard.jsx:137` | `12px` | `14px` |
| `products/ProductCarousel/ProductCard.jsx:42` | `16px` | `14px` |
| `layout/Login/Login.jsx:129` | `16px` | `14px` |
| `admin/StoreList/StoreList.jsx:35` | `14px` | (ya correcto, sin cambio) |

## ✅ Legítimo (no es tarjeta de contenido, sin cambios)

- Íconos en caja (`ProfileCard`, `AuthLayout`, `TenantSection`): `10px`.
- Selects / pills (`StorePeriodFilters`, `StoreQuickFilters`): `10px`, controles.
- Toasts (`ConnectionStatusBanner`, `StockVerificationSnackbar`): `10px`, excepción ya documentada (auditoría de avisos).
- Bloques destacados internos con `action.hover` (`PlanStep`, `RegistrationSuccess`): `10px`/`12px`, no son tarjetas con fondo paper.
- `DashboardLoading`, `DataTable`: `14px`, coinciden con el tema.

## Nota

Se optó por ajustar el valor del radio (no migrar los `Box` a `<Card>` de MUI) para mantener el cambio de bajo riesgo, sin tocar estructura, hover ni props.
