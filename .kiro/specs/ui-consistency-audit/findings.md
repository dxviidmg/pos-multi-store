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
6. [Auditoría de tipografía](#6-auditoría-de-tipografía--cerrada) — ✅ cerrada (3 nov 2026)
7. [Auditoría de espaciados / sx repetidos](#7-auditoría-de-espaciados--sx-repetidos--cerrada) — ✅ cerrada (3 nov 2026)
8. [Auditoría de componentes reutilizables](#8-auditoría-de-componentes-reutilizables--cerrada) — ✅ cerrada (4 nov 2026)

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

---

# 6. Auditoría de tipografía — CERRADA

Objetivo: usar los `variant` de `Typography` en vez de `fontSize`/`fontWeight` a mano. Escala del tema (`theme/typography.js`): h1 1.75/800, h2 1.5/700, h3 1.25/700, h4 1.125/700, h5 1/600, h6 0.875/600, body1 0.875/400, body2 0.8125/400, button 0.8125/600, caption 0.75.

**Diagnóstico:** ~50 `<Typography>` definen tamaño/peso en `sx`. Hay dos grupos:

1. **Coinciden exactamente con la escala** pero reinventan el tamaño a mano → deberían usar `variant`.
2. **Tamaños fuera de escala** (`0.65`, `0.68`, `0.7`, `0.72`, `0.8`, `0.85`, `0.95`, `1.375`, `1.8rem`…) → densidad intencional en sidebar, carrito, menús y KPIs.

Se adoptó la **Opción A (conservadora):** arreglar solo los casos del grupo 1 que coinciden exactamente en tamaño **y** peso **y** sin diferencia de color/lineHeight (cero cambio visual). El grupo 2 se deja como intencional.

## 🟢 Resuelto (3 nov 2026)

| Archivo | Antes | Ahora |
|---|---|---|
| `ui/EmptyState/EmptyState.jsx:42` | `variant="h6"` + `sx={{ fontSize:"1rem", fontWeight:600 }}` | `variant="h5"` (1rem/600 exacto) |
| `tenant/Registration/RegistrationSuccess.jsx:21` | `sx={{ fontSize:"1.25rem", fontWeight:700, … }}` | `variant="h3"` + `sx={{ color, mb }}` (1.25rem/700 exacto) |

## Casos revisados y descartados (no son cambio seguro)

- `CountdownTimer:6` — `variant="body2"` forzado a `0.75rem`: sería `caption`, pero `caption` trae un color terciario distinto de `text.secondary`; cambiaría el color. Se deja.
- `RegistrationSuccess:24` — `0.875rem` = body1 en tamaño, pero usa `lineHeight:1.6` (body1 es 1.5). No es exacto.
- `PaymentModal:286`, `Modal.jsx:40` — `variant="h5"/"h6"` con override a `1.375rem`/`1.0625rem`: tamaños fuera de escala, intencionales para esos títulos.
- Resto de `fontSize` sueltos: densidad intencional (sidebar `0.8rem`, carrito `0.65rem`, KPIs `1.5`/`1.375rem`, menús del header, íconos SVG, PDF, charts).

## Nota

La Opción A es deliberadamente acotada: solo 2 cambios realmente seguros (tamaño+peso+color+lineHeight idénticos a un `variant`). Normalizar los tamaños de densidad fuera de escala (Opción B) cambiaría la apariencia y no se hizo.

---

# 7. Auditoría de espaciados / sx repetidos — CERRADA

Objetivo: detectar `sx` duplicados que valgan como clase de `App.css` o componente compartido.

**Diagnóstico: poco que estandarizar.** `App.css` ya tiene buenas utilidades (`.card`, `.card-interactive`, `.fill-row`, `.text-success/danger/warning`, `.status-dot`, animaciones). Los patrones `sx` tipo "flex centrado" o "space-between" están dispersos **pero con variaciones** (distinto `gap`, `flexWrap`, `flexDirection`); extraerlos a una clase única los volvería rígidos, así que **no se tocaron** (decisión deliberada).

Se encontró **un** candidato de duplicación literal real y se corrigió.

## 🟡 Resuelto — Barra de progreso de importación duplicada (3 nov 2026)

`{loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}` aparecía idéntica en 4 pantallas de importación. Se extrajo a `ui/Import/ImportProgress.jsx` (componente `<ImportProgress loading={…} />`), coherente con las demás piezas de `ui/Import/`.

| Archivo | Antes | Ahora |
|---|---|---|
| `sales/SaleImport/SaleImport.jsx:50` | `{loading && <LinearProgress sx={…} />}` | `<ImportProgress loading={loading} />` |
| `products/StoreProductImport/StoreProductImport.jsx:56` | idem | `<ImportProgress>` |
| `products/ProductImport/TraditionalImport.jsx:51` | idem | `<ImportProgress>` |
| `products/ProductImport/EleventaImport.jsx:43` | idem | `<ImportProgress>` |

## ❌ No tocado (deliberado)

- Patrones `flex center` / `space-between`: dispersos pero con variaciones; una clase única los volvería rígidos. Se dejan como `sx` inline.
- No se encontraron otros `sx` duplicados literalmente que justifiquen una clase o componente.

---

## Estado global de la auditoría de consistencia visual

Las 7 auditorías están cerradas:

1. ✅ Botones — todos usan `CustomButton`
2. ✅ Avisos — `StatusChip` + `STATUS_TONES`, Alerts filled
3. ✅ Tablas — carga unificada, anchos de acción
4. ✅ Modales — todos usan `ModalBody`
5. ✅ Cards — radio 14px unificado
6. ✅ Tipografía — variants de la escala (Opción A)
7. ✅ Espaciados — `ImportProgress` compartido

---

# 8. Auditoría de componentes reutilizables — CERRADA

Objetivo: revisar `ui/` y `shared/`, quitar props que siempre son el mismo valor, fusionar lo fusionable y corregir inconsistencias CSS/MUI (tokens vs valores crudos).

## 🔴 Resuelto — Colores hardcodeados → tokens (3 nov 2026)

| Archivo | Antes | Ahora |
|---|---|---|
| `ui/Icons/Icons.jsx` | `chooseIcon`: `color:"green"` / `color:"red"` | `color:"success.main"` / `color:"error.main"` |
| `admin/Dashboard/DoughnutChart.jsx:65` | `faded: { … color:"gray" }` | `color: CHART_FADED` |
| `admin/Dashboard/DepartmentDashboard.jsx:86` | `faded: { … color:"gray" }` | `color: CHART_FADED` |

Se agregó `CHART_FADED` (`#9ca3af`) a `utils/chart.js` como fuente única del gris de los segmentos atenuados de los PieChart.

## 🟡 Resuelto — Radio inconsistente entre poppers del header (3 nov 2026)

Los dos poppers tenían radios muy distintos. Unificados a `1.5` (12px):

| Archivo | Antes | Ahora |
|---|---|---|
| `ui/HeaderPopoverMenu/HeaderPopoverMenu.jsx` | `borderRadius: 3` (24px) | `borderRadius: 1.5` (12px) |
| `ui/PageHelp/PageHelp.jsx` | `borderRadius: 1.5` (12px) | (ya correcto, referencia) |

## Resueltos / descartados de la auditoría 8

- **#3 `CustomTooltip` `position`** — ❌ **Descartado (4 nov 2026).** Se contaron los usos: 23 pasan `position` explícito (11 `"bottom"`, 9 `"top"`, 1 `"left"`, **0 `"right"`**) y ~140 no lo pasan, usando el default `"right"`. El default es, de lejos, el valor más usado (los tooltips de botones de acción en columnas de tabla); nadie escribe `position="right"` porque ya es el default. Cambiarlo obligaría a añadir `position="right"` en ~140 sitios. El componente queda como está.
- **#5 Fila de menú del header** — ✅ **Resuelto (4 nov 2026).** Se extrajo `ui/HeaderPopoverMenu/HeaderMenuItem.jsx` (fila estándar: título en negrita + borde inferior, con `secondary` o `children`). `MessageGroupsMenu` y `StockRequestMenu` la usan; se eliminó el `ListItem` y los `typographyProps` duplicados en ambos. Test de `MessageGroupsMenu` en verde (3/3).

## 🟡 Resuelto — B3: ícono decorativo de KPICard (4 nov 2026)

`KPICard` mostraba un ícono gris (`text.secondary`) arriba a la derecha, sin color semántico ni información que el título no diera. Se quitó el ícono, la prop `icon` y se aplanó la estructura (ya sin el `Box` flex de dos columnas). Se limpiaron los `icon={…}` y los imports de íconos sin uso en `Dashboard` (4), `CancellationsDashboard` (`BlockIcon`/`UndoIcon`) y `DepartmentDashboard` (3, incl. la propiedad `icon` del array `KPIS`). `StatCard` e `InsightCard` NO se tocaron: ahí el ícono es funcional (color semántico, ancla el dato).

**A2 (jerarquía de indicadores): NO aplicado.** Cambio estético subjetivo y de alto toque visual, no verificable sin navegador. Queda como pendiente consciente a decisión del usuario.

## 🟡 Resuelto — M3: animación de entrada anidada en KPICard (4 nov 2026)

`KPICard` tenía un `Box` interno con `fade-in-up` + `animationDelay: index*60ms`, anidado dentro del `.card`. La página ya anima su entrada con `page-enter` (`MainLayout.jsx:170`, con `key` por ruta+tienda), así que la cascada por tarjeta era una segunda animación anidada. Se quitó el `Box` interno y la prop `index` (ya sin uso), y se limpiaron los `index={…}` en `Dashboard`, `CancellationsDashboard` y `DepartmentDashboard`.

## ✅ Revisado y correcto (sin cambios)

`CustomButton`, `StatusChip`, `ModalBody`, `Field`, `CardGallery`, `EmptyState`, `ViewModeToggle`, `DropZone`, `VisuallyHiddenInput`, `SimpleTable`, `HeaderPopoverMenu` (estructura). Los presets `PendingMenu`/`DuplicateSalesMenu` se dejan separados a propósito (más legibles que fusionados).
