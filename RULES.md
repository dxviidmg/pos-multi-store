# Reglas del Proyecto — SmartVenta Frontend

## Idioma

- La UI debe estar completamente en español. Evitar anglicismos cuando exista un equivalente claro.
  - Dashboard → Tablero
  - Logs → Historial de stock
  - Stock se permite por ser término común en comercio.
- Nombres de variables, componentes y archivos en inglés.
- Mensajes de commit en inglés, formato convencional: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `perf:`, `chore:`.
- Al generar un mensaje de commit, actualizar el README si los cambios afectan funcionalidades, stack o arquitectura documentados.

## Estructura de archivos

El proyecto usa **Next.js 14 (App Router)** con organización **por feature**. La regla
mental: todo lo de un dominio (componentes, hooks y capa API) vive junto en su feature;
lo verdaderamente transversal vive en `shared`.

### `app/` — Rutas (App Router)
- Cada segmento de ruta es una carpeta con `page.tsx`. Las rutas protegidas van bajo
  `app/(protected)/` (route group con layout que valida sesión).
- `page.tsx` es un wrapper delgado: `'use client'` + import directo del componente de la
  feature. **No** usar `lazy()`/`Suspense`/`ErrorBoundary` manuales en las páginas.
- Estados de carga y error por segmento: usar `loading.tsx` y `error.tsx`
  (ej. `app/(protected)/loading.tsx`, `app/(protected)/error.tsx`), no wrappers propios.
- Las páginas se generan con `scripts/generate-routes.js`; al agregar una ruta, añadirla
  ahí (con `componentPath` apuntando a `features/...`) y regenerar.

### `src/features/{dominio}/` — Lógica por dominio
- Dominios actuales: `admin`, `catalog`, `cashflow`, `clients`, `inventory`, `products`,
  `sales`, `tenant`.
- Estructura interna de cada feature:
  - `components/{NombreComponente}/{NombreComponente}.jsx`
  - `hooks/` — hooks propios del dominio (queries, mutations, lógica)
  - `api/` — servicios API del dominio (creados con `apiFactory`)
  - `index.js` — barril que expone la API pública de la feature (componentes + hooks + api)
- Un componente/hook/servicio usado por **una sola** feature vive dentro de esa feature.

### `src/shared/` — Transversal (usado por 2+ features)
- `ui/` — componentes reutilizables (`DataTable`, `Modal`, `Button`, `PageHeader`,
  menús, `UserModals`, etc.)
- `layout/` — `MainLayout`, `Login`
- `hooks/` — hooks genéricos (`useFetch`, `useCrudMutation`, `useModal`, `useForm`,
  `usePrinterStatus`, ...)
- `api/` — `httpClient`, `apiFactory`, `utils`, `queryClient`, y servicios transversales
  de auth (`login`, `users`) e impresión (`printers`)
- `theme/`, `utils/`, `constants/`, `assets/`

### Raíz de `src/`
- `context/` — `UserContext`, `WebSocketContext`
- `redux/`, `store.js`, `rootReducer.js` — Redux (solo carritos)
- `providers.tsx` — árbol de providers (Redux, React Query, MUI, User, WebSocket)

### Reglas de colocación
- ¿Lo usa una sola feature? → dentro de `features/{esa}/`.
- ¿Lo usan 2+ features, o es infraestructura? → `shared/`.
- **No** reintroducir `src/components/`, `src/api/` ni `src/hooks/` en la raíz: esa era
  la estructura legacy previa a la migración y ya no debe usarse.
- Preferir imports vía el barril de la feature (`@/src/features/{dominio}`) para su API
  pública; los internos de la feature pueden importar por ruta directa.

## Stack y dependencias

- Next.js 14 (App Router) con React 18
- Material UI (MUI) — no usar Bootstrap ni react-bootstrap
- Redux para carritos multi-pestaña (`multiCartReducer`)
- React Query (@tanstack/react-query) para estado del servidor
- Enrutado: App Router de Next (no usar `react-router-dom`)
- Code-splitting automático por ruta de Next (no `lazyRetry` manual)
- Axios centralizado en `shared/api/httpClient.js`
- SweetAlert2 para confirmaciones personalizadas
- Chart.js / MUI X Charts para gráficas
- Requiere Node.js ≥ 18.17 para `next build`/`next dev`

## Componentes UI reutilizables

- `CustomModal` — Todos los modales usan este wrapper con estructura: `Grid container` con `padding: '1rem'` y `backgroundColor: 'rgba(4, 53, 107, 0.2)'`, dentro `Grid item xs={12} className="card"`.
- `CustomButton` — Wrapper de MUI Button con `variant="contained"`, `size="small"` y `minWidth: 0`.
- `CustomTooltip` — Wrapper de MUI Tooltip. Soporta prop `fullWidth`. Usar siempre en botones de solo ícono.
- `DataTable` — Wrapper de MUI DataGrid. Para tablas con ordenamiento, búsqueda, paginación, selección o loading.
- `SimpleTable` — Tabla HTML nativa. Para tablas de solo lectura sin interacción (modales, búsquedas, importaciones).
- `PageHeader` — Título + botones alineados. Usar en vez de `Stack direction="row" justifyContent="space-between"` manual.
- `DropZone` — Área de arrastrar y soltar archivos. Usar en páginas de importación.
- `VisuallyHiddenInput` — Input oculto para file uploads. No duplicar en cada archivo.
- `StatusChip` — Chip de estado Exitoso/Error. Usar en tablas de validación de importaciones.
- `CustomSpinner` — Indicador de carga.
- `AuditCard` — Card para tareas asíncronas con polling de progreso.

## Roles y permisos

- Tres roles: `owner`, `admin` (manager), `seller`.
- Ocultar columnas/acciones por rol con spread condicional, no con `omit`.
- Solo el owner puede: editar productos, ajustar stock, eliminar productos, ver costos, acceder al tablero, vaciar stock de tiendas.
- El header HTTP `store-id` solo se envía cuando tiene un valor numérico.
- Al volver a vista general, `store_id` se pone como `null` (no string vacío).

## Patrones de código

- Hooks: `useModal()` para abrir/cerrar modales con datos. `useFetch`, `useFetchWithRetry`, `useCrudMutation` para datos del servidor.
- API: usar `getApiUrl()` de `shared/api/utils.js`. Para query params usar `buildUrlWithParams()`. El token se agrega automáticamente en el interceptor de `httpClient`.
- Alertas: `showSuccess()`, `showError()`, `showWarning()`, `showAlert()` de `shared/utils/alerts.js`. Nunca usar `Swal.fire` directo. Para confirmaciones personalizadas usar `showConfirm()` o Swal directo solo si se necesita input/configuración especial.
- Estado global: Redux solo para carritos (`multiCartReducer`). El resto es estado local o React Query.
- Rutas y carga: Next hace code-splitting por ruta automáticamente. Usar `loading.tsx`/`error.tsx` del segmento para estados de carga/error; no `lazyRetry()` + `Suspense` manuales.
- Memoización: usar `memo()` en componentes puros, `useMemo` para cálculos costosos, `useCallback` para funciones estables.

## Tablas (DataTable y SimpleTable)

- Siempre pasar `noDataComponent` con mensaje descriptivo en español.
- Siempre pasar `progressPending` en DataTable cuando haya estado de carga disponible.
- Columnas con inputs (TextField) deben tener `width: 100`.
- No pasar props que ya son el default del componente.
- Si un prop no lo usa ningún consumidor, eliminarlo del componente.
- Botones de solo ícono con `CustomTooltip`.
- Columnas de acciones con `width` fijo si hay 3+ botones (ej: `width: 180`).
- Columnas condicionales por rol con spread: `...(user.role === "owner" ? [{...}] : [])`.
- Usar `cell` para renderizado custom, `selector` para valores simples.

## Notificaciones

- WebSocket a `ws://{host}/ws/notifications/?token=xxx&store_id=xxx`.
- Fetch HTTP inicial a `/api/notifications/` al montar y al cambiar de tienda.
- Reconexión automática cada 5 segundos.
- Al hacer click en notificación, se guarda el `store_id` en localStorage y se navega.

## Navegación y sidebar

- Tres tipos de vista: Tienda (T), Almacén (A) y General/Admin (G).
- Cada vista tiene su propio menú con items y dropdowns.
- Items pueden ocultarse por rol con `hidden: user.role === "seller"`.
- Al cambiar de tienda se dispara evento `store-changed` y se actualiza localStorage.
- Botón de WhatsApp de soporte al final del sidebar.

## Variables de entorno

- Next.js solo inyecta en el bundle variables con prefijo `NEXT_PUBLIC_*`. Usar ese
  prefijo (se mantiene un fallback a `REACT_APP_*` en algunos módulos por compatibilidad,
  pero las nuevas deben ser `NEXT_PUBLIC_*`).
- `NEXT_PUBLIC_API_URL` — URL del backend.
- `NEXT_PUBLIC_PRINTER_URL` — URL del servicio de impresión.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — Número de soporte WhatsApp.

## Monitoreo

- Tiempos de búsqueda por código se registran en localStorage key `search_timing_stats`.
- Estructura: `{ tiempos: { "0": N, "1": N, ... }, mas_de_8s: ["codigo1", "codigo2"] }`.
- Bucket 0 = ≤500ms, bucket 1 = 501-1500ms, bucket 2 = 1501-2500ms, etc.

## Tareas asíncronas

- Operaciones pesadas (auditoría, exportaciones) se ejecutan como tareas Celery.
- El backend devuelve un `task_id`, el frontend hace polling a `/api/task-result/{id}/`.
- El componente `AuditCard` maneja el polling con intervalo de 7.5 segundos.

## Git

- Ramas: `develop` → `staging` → `main`.
- Commits descriptivos en inglés con prefijo convencional.
- No commitear `.env` con valores reales (usar `.env.template`).
- No commitear `console.log` ni variables sin usar.

## Código limpio

- No dejar imports, variables ni exports sin usar.
- No dejar código comentado (bloques `{/* ... */}` con JSX muerto).
- No duplicar styled components entre archivos — extraer a `shared/ui/`.
- No pasar props que ya son el default del componente receptor.
- Si un prop/export no se usa en ningún archivo, eliminarlo.
- Usar `try/catch/finally` en llamadas async para garantizar que loading se desactive.

## Estilo visual y componentes

- **Design tokens para colores**: Nunca usar valores hexadecimales hardcodeados. Usar tokens del tema: `text.primary`, `text.secondary`, `primary`, `accent`.
- **Clases CSS utilitarias**: Extraer patrones de estilo inline repetidos (ej: ajuste de texto en celdas) a clases CSS en `src/index.css`.
- **Componente PageHeader**: Usar siempre en lugar de layouts manuales con `<h1>` + botones. Envolver título y acciones en `<PageHeader title="...">`.
- **Box de MUI para layouts**: Usar `Box` con `sx` en lugar de `style` inline para flex layouts. Ej: `<Box sx={{ display: 'flex', gap: 0.5 }}>`.
- **Clases semánticas para estados**: Usar `text-success`, `text-danger`, `text-warning` en lugar de colores hardcodeados.
- **Iconos de alerta**: Usar tokens del tema (`accent`) en lugar de valores hex.

## README

- En "Funcionalidades principales" usar lenguaje de usuario, nunca términos técnicos (no Stepper, WebSocket, badge, popover, drag & drop, etc.).
- Mantener fecha de última actualización al hacer cambios.
- Actualizar si los cambios afectan funcionalidades, stack o arquitectura documentados.
