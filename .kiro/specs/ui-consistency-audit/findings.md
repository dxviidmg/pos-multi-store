# Auditoría de consistencia visual — SmartVenta frontend

> Última actualización: 3 de noviembre de 2026
> Alcance: `src/components/` (todos los dominios, incluido `tenant/`)
> Estándar de referencia: `AGENTS.md`
> Naturaleza: **reporte**. Los cambios de código se hacen solo tras confirmación.

Este documento acumula las auditorías de consistencia visual del frontend:

1. [Auditoría de botones](#1-auditoría-de-botones--cerrada) — ✅ cerrada (3 nov 2026)
2. [Auditoría de avisos (chips, alerts, cajas de aviso)](#2-auditoría-de-avisos--abierta) — 🔎 abierta

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

## 🟡 Media-baja — `variant` de Alert sin criterio consistente — PENDIENTE

> La parte de chips ya se resolvió (arriba). Queda la convención de **Alerts**.

- **Alerts:** mezcla de `variant="filled"` en muchos (`PaymentModal`, `ProductCatalog`, `EleventaImport`…) y sin variant en otros (modales de `tenant`, `RequireAccess`, `Profile`). El radio también varía: unos `borderRadius: 2`, otros `"10px"`, otros nada (heredan del tema).

## ✅ Lo que está bien

- `EmptyState`, `ConnectionStatusBanner`, `StockRequestAlert`, `StockVerificationSnackbar`, `AuditCard` son componentes de aviso bien encapsulados y reutilizables.
- Casi no hay colores hardcodeados (solo `admin/StoreList/StoreList.jsx:145` usa `info.light` en un `conditionalRowStyle`, legítimo).
- Los `Alert` usan `severity` correctamente (no inventan colores).

## Recomendación de acción

1. ~~**🔴 Rehacer `StatusChip`**~~ ✅ **Hecho (3 nov 2026).** Recibe `tone` + `label`, variante filled, con `STATUS_TONES`.
2. ~~**🟠 Crear un mapa único de tono de estado**~~ ✅ **Hecho (3 nov 2026).** `STATUS_TONES` en `constants/enums.js`; `statusMap`/`NOTICE_TONES` lo consumen; chips migrados a `StatusChip`.
3. **🟡 Definir la convención de Alerts** (filled + radio uniforme) y aplicarla. ⏳ **Pendiente.**

### Inventario de referencia

- **Chips (`<Chip>`):** `ui/Import/ImportActions.jsx`, `products/SearchProduct/SearchProduct.jsx`, `sales/shared/PaymentSubmitPanel.jsx`, `ui/Import/ImportFileDrop.jsx`, `ui/AuditCard/AuditCard.jsx`, `ui/StatusChip.jsx`, `inventory/StockUpdateRequestList/StockUpdateRequestList.jsx`, `inventory/StockModal/StockModal.jsx`, `tenant/MyCurrentPlan/PlanCard.jsx`, `tenant/SubscriptionList/SubscriptionList.jsx`, `admin/ServiceList/ServiceCard.jsx`, `admin/StoreList/StoreHeader.jsx`, `admin/Profile/ProfileHero.jsx`.
- **Alerts (`<Alert>`):** 22 archivos (tenant, products, inventory, sales, ui, admin, layout). Ver búsqueda `<Alert` en `src/components`.
