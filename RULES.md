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

- Componentes en `src/components/{dominio}/{NombreComponente}/{NombreComponente}.jsx`
- Dominios: `admin`, `catalog`, `clients`, `finance`, `inventory`, `layout`, `products`, `sales`, `ui`
- API en `src/api/{recurso}.js`
- Hooks en `src/hooks/`
- Constantes en `src/constants/`
- Utilidades en `src/utils/`
- Tema y colores en `src/theme/`
- Redux solo en `src/redux/` (carritos)

## Stack y dependencias

- React 18 con Create React App
- Material UI (MUI) — no usar Bootstrap ni react-bootstrap
- Redux para carritos multi-pestaña (`multiCartReducer`)
- React Query (@tanstack/react-query) para estado del servidor
- React Router v6 con lazy loading (`lazyRetry` + `Suspense`)
- Axios centralizado en `api/httpClient.js`
- SweetAlert2 para confirmaciones personalizadas
- Chart.js / MUI X Charts para gráficas

## Componentes UI reutilizables

- `CustomModal` — Todos los modales usan este wrapper con estructura: `Grid container` con `padding: '1rem'` y `backgroundColor: 'rgba(4, 53, 107, 0.2)'`, dentro `Grid item xs={12} className="card"`.
- `CustomButton` — Wrapper de MUI Button con `variant="contained"`, `size="small"` y `minWidth: 0`.
- `CustomTooltip` — Wrapper de MUI Tooltip. Soporta prop `fullWidth`. Usar siempre en botones de solo ícono.
- `DataTable` — Wrapper de MUI DataGrid. No soporta `omit` en columnas; usar spread condicional `...(condicion ? [columna] : [])` para ocultar columnas.
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
- API: usar `getApiUrl()` y `getHeaders()` de `api/utils.js`. Para query params usar `buildUrlWithParams()`.
- Alertas: `showSuccess()`, `showError()`, `showWarning()` de `utils/alerts.js`. Para confirmaciones personalizadas usar Swal directo (el `showConfirm` genérico dice "Eliminar").
- Estado global: Redux solo para carritos (`multiCartReducer`). El resto es estado local o React Query.
- Lazy loading: todas las rutas usan `lazyRetry()` + `Suspense` con auto-reload en `ChunkLoadError`.
- Memoización: usar `memo()` en componentes puros, `useMemo` para cálculos costosos, `useCallback` para funciones estables.

## Tablas (DataTable)

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

- `REACT_APP_API_URL` — URL del backend.
- `REACT_APP_PRINTER_URL` — URL del servicio de impresión.
- `REACT_APP_WHATSAPP_NUMBER` — Número de soporte WhatsApp.

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
