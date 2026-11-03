# Auditoría de consistencia visual — SmartVenta frontend

> Fecha: 3 de noviembre de 2026
> Alcance: `src/components/` (todos los dominios, incluido `tenant/`)
> Estándar de referencia: `AGENTS.md`
> Naturaleza: **reporte, sin cambios de código**

---

## Resumen

El codebase está **muy limpio** en los vectores más graves:

- **0** hex/rgba hardcodeados en componentes. Los únicos literales de color son `catalogPdf.js` (canvas) y `AuthLayout` (patrón de puntos), ambos legítimos.
- **0** `<h1>`/`<h2>` escritos a mano (todo vía `PageHeader`).
- **1** solo `style={{}}` inline en todo `src/components` (y es SVG de gráfica, legítimo).
- `TextField` siempre viene de `ui/Field/Field` (0 excepciones).
- Inputs: ninguno usa `#fff` fijo; el único caso usa el token `colors.white` y está documentado.

La inconsistencia **real y repetida** es el uso de `<Button>` crudo de `@mui/material` en vez de `CustomButton`, y la **ausencia de una variante secundaria/outlined estandarizada**.

---

## ~~🔴 Alta prioridad — Botones que rompen el estándar de altura/variante~~ ✅ RESUELTO

> Ver la sección "Resuelto" más abajo. Se mantiene el detalle original como referencia.

`CustomButton` fija `variant="contained"`, `size="small"` y altura 40/44px. Estos usan `<Button>` crudo de `@mui/material`, por lo que su altura y estilo no son consistentes con el resto del sistema.

| Archivo:línea | Problema | Debería ser |
|---|---|---|
| `admin/Profile/UserSection.jsx:50` | `<Button variant="contained" startIcon={<Save/>}>` | `CustomButton` con `startIcon` |
| `admin/Profile/TenantSection.jsx:81` | Igual (idéntico patrón "Guardar cambios") | `CustomButton` |
| `admin/Profile/PasswordSection.jsx:75` | `<Button variant="contained">` "Cambiar contraseña" | `CustomButton` |
| `admin/StoreList/StoreList.jsx:156` | `<Button variant="contained">` "Crear mi primera tienda" | `CustomButton` (el mismo archivo ya usa `CustomButton` en `StoreHeader`) |
| `tenant/MyCurrentPlan/CancelSubscriptionModal.jsx:98` | `<Button variant="contained" color="error">` junto a un `CustomButton` outlined en el mismo `Stack` | `CustomButton` (mezcla crudo + Custom en la misma fila de acciones) |

Estos cinco son el núcleo: la misma acción (guardar/confirmar) implementada de dos formas distintas según la pantalla.

---

## ✅ Resuelto — Alta prioridad: botones migrados a `CustomButton` (3 nov 2026)

Los 5 botones primarios que usaban `<Button>` crudo de `@mui/material` se migraron a `CustomButton` (quitando `variant="contained"`/`size="small"` redundantes y el import de `Button`). Cambio solo de estandarización de altura, sin alterar diseño ni comportamiento. ESLint y `npm run build` limpios.

| Archivo:línea | Antes | Ahora |
|---|---|---|
| `admin/Profile/UserSection.jsx` | `<Button variant="contained" startIcon={<Save/>}>` "Guardar cambios" | `CustomButton` |
| `admin/Profile/TenantSection.jsx` | `<Button variant="contained" startIcon={<Save/>}>` "Guardar datos del negocio" | `CustomButton` |
| `admin/Profile/PasswordSection.jsx` | `<Button variant="contained">` "Cambiar contraseña" | `CustomButton` |
| `admin/StoreList/StoreList.jsx` | `<Button variant="contained">` "Crear mi primera tienda" | `CustomButton` |
| `tenant/MyCurrentPlan/CancelSubscriptionModal.jsx` | `<Button variant="contained" color="error">` "Sí, cancelar" | `CustomButton color="error"` |

---

## ~~🟠 Media prioridad — Inconsistencias de variante/color para la misma intención~~ ✅ RESUELTO (3 nov 2026)

**Decisión tomada:** se formalizó `variant` como prop de `CustomButton` (default `"contained"`, acepta `"outlined"` y `"text"`). Todos los botones de la app usan ahora `CustomButton`; `<Button>` crudo de `@mui/material` solo queda en `ui/Button/Button.jsx` (el propio componente) y en `ui/ErrorBoundary.jsx` (excepción intencional, ver 🟡).

Botones migrados en este paso:

| Archivo | Botón | variant |
|---|---|---|
| `admin/StoreList/StoreHeader.jsx` | "Ampliar plan" | `outlined` |
| `layout/Login/LoginForm.jsx` | "Crear mi negocio" | `outlined` |
| `tenant/MyCurrentPlan/MyCurrentPlan.jsx` | "Cancelar suscripción" | `text` + `color="error"` |
| `tenant/MyCurrentPlan/PlanCard.jsx` | "Domiciliar" | `contained` + `color="success"` |
| `tenant/MyCurrentPlan/PlanCard.jsx` | "Cambiar tarjeta" | `contained` (gradiente de marca) |
| `tenant/MyCurrentPlan/PlanCard.jsx` | "Actualizar tarjeta", "Reactivar" | `text` + `color="inherit"` (dentro de `Alert`) |
| `ui/NotificationsMenu/NotificationsMenu.jsx` | "Limpiar" | `text` |
| `sales/SaleList/PaymentsCell.jsx` | enlace de métodos de pago | `text` + `height: "auto"` |

### Detalle original (referencia)

- **`admin/StoreList/StoreHeader.jsx:31`** — "Ampliar plan" es `<Button variant="outlined">` con `sx={{ height: 40, bgcolor: "background.paper", color: "text.primary", borderColor: "divider" }}`. Replica a mano lo que debería ser un `CustomButton` o un estilo tokenizado reutilizable; convive con `CustomButton` en el mismo componente. Botón secundario sin patrón compartido.
- **`tenant/MyCurrentPlan/PlanCard.jsx:52,106,138,156`** — 4 botones crudos con colores/variantes dispares: uno `color="success"` con `sx={{ bgcolor: "success.main" }}`, otro con `background: colors.gradient.brand`, y dos `color="inherit"` dentro de `Alert`. Los botones dentro de `Alert` (acción de alerta) son un caso aceptable de MUI, pero los dos primeros (`:52` domiciliar, `:106` cambiar tarjeta) deberían unificarse: hoy "acción primaria" se ve verde en un lado y gradiente de marca en otro.
- **`layout/Login/LoginForm.jsx:71`** — "Crear mi negocio" es `<Button variant="outlined">` mientras el botón primario de al lado sí es `CustomButton`. Botón secundario sin un patrón outlined compartido (mismo caso que `StoreHeader` y `CancelSubscriptionModal`).
- **`tenant/MyCurrentPlan/MyCurrentPlan.jsx:182`** — "Cancelar suscripción" `<Button variant="text" color="error" size="small">`. Acción destructiva sin patrón consistente.

**Patrón de fondo (resuelto):** ya no hay implementaciones ad-hoc del botón secundario. Se optó por formalizar `variant` en `CustomButton` (en vez de crear un `SecondaryButton`), manteniendo un solo componente.

---

## 🟡 Baja prioridad — Casos legítimos pero vale documentar/confirmar

- **`admin/Dashboard/ChartTypeSelect.jsx:2`** — ✅ **Confirmado como excepción.** Usa `Select` crudo de `@mui/material` a propósito: es un control de presentación de la gráfica (líneas/barras), no un campo de formulario, y sin `label` el wrapper `ui/Field/Field` no aportaría ícono ni estilo. Mismo criterio que `ViewModeToggle`. Documentado con un comentario en el archivo.
- **`sales/SaleList/PaymentsCell.jsx:11`** — ✅ **Resuelto.** Migrado a `CustomButton variant="text"` (enlace de texto en celda, con `height: "auto"` para no romper la fila de la tabla).
- **`ui/NotificationsMenu/NotificationsMenu.jsx:145`** — ✅ **Resuelto.** "Limpiar" migrado a `CustomButton variant="text"`.
- **`ui/ErrorBoundary.jsx:23`** — ✅ **Confirmado como excepción.** Se mantiene con `<Button>` crudo de MUI: es el fallback de errores y no debe depender de componentes de UI compartidos que pudieron ser la causa del fallo.
- **`admin/Dashboard/TodayReferenceLine.jsx`** — ✅ **Confirmado legítimo.** 2 `style={{}}` inline en SVG de gráfica, donde `sx` no aplica.

---

## ✅ Lo que está bien (consistente)

- **Color:** 0 hex/rgba hardcodeados en componentes. Todo sale de `theme/colors.js` o tokens de palette.
- **Inputs:** ninguno usa `#fff` fijo; el único caso (`Login.styles.js`) usa `colors.white` y está documentado para el fondo navy móvil.
- **Campos:** `TextField` siempre viene de `ui/Field/Field` (0 excepciones). Solo `Select` tiene 1 excepción (`ChartTypeSelect`).
- **IconButtons de solo ícono:** los revisados tienen `CustomTooltip` o son botones con texto (`SaleModeButton`). No se encontraron violaciones claras.
- **Modales, `PageHeader`, `EmptyState`:** bien adoptados.

---

## Recomendación de acción (en commits atómicos)

1. ~~**Fix rápido y seguro (🔴):** migrar los 5 botones primarios a `CustomButton`.~~ ✅ **Hecho (3 nov 2026).**
2. ~~**Decisión de diseño (🟠):** definir la variante secundaria/outlined estándar.~~ ✅ **Hecho (3 nov 2026).** Se formalizó `variant` en `CustomButton` y se migraron todos los botones restantes.
3. ~~**Confirmar excepciones (🟡):**~~ ✅ **Hecho (3 nov 2026).** `PaymentsCell` y `NotificationsMenu` migrados; `ChartTypeSelect`, `ErrorBoundary` y `TodayReferenceLine` confirmados como excepciones documentadas.

**Auditoría cerrada:** todos los puntos (🔴/🟠/🟡) están resueltos o confirmados como excepción.

---

## Ajustes de layout aplicados (3 nov 2026)

Junto con la estandarización de botones se hicieron dos ajustes de presentación solicitados:

- **`/perfil/`** — los tres botones de acción (`UserSection`, `TenantSection`, `PasswordSection`) ahora usan `fullWidth` (ancho completo en todas las resoluciones, no solo móvil).
- **`/tiendas/` (`StoreHeader`)** — reestructurado a `Grid container`: título + saludo + chips de avisos en `xs=12 md=6`; "Ampliar plan" y "Crear tienda" en `xs=6 md=3` cada uno (1/4 del ancho en escritorio, mitad en móvil), ambos con `fullWidth`.
