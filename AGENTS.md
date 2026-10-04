# AGENTS.md — SmartVenta Frontend

Instrucciones para cualquier agente de código (Claude Code, Kiro, Codex, Cursor, etc.) y para personas que trabajen en este repositorio. **Este archivo es la única fuente de reglas técnicas.** `CLAUDE.md` y `.kiro/steering/project.md` solo lo importan; no dupliques reglas en ellos.

> Última revisión: 2026-10-04

---

## 1. Mapa de documentos

| Archivo | Qué contiene | Quién lo lee |
|---|---|---|
| `README.md` | Producto: qué hace SmartVenta, para quién, cada funcionalidad. **Alimenta la landing page.** | Clientes, ventas, marketing, equipo |
| `AGENTS.md` | Reglas de código, arquitectura, convenciones y flujo de trabajo | Agentes y desarrolladores |
| `pendientes.md` | Backlog técnico: bugs conocidos, deuda, seguimiento de backend | Equipo |
| `.kiro/specs/{feature}/` | Specs en curso (formato Kiro: `requirements.md`, `design.md`, `tasks.md`) | Agentes y equipo |

Si algo de este archivo contradice al código, **el código es la verdad**: corrige este archivo en el mismo cambio.

---

## 2. Qué es este proyecto

Frontend web de **SmartVenta**, un punto de venta (POS) SaaS multi-sucursal. Cada **negocio** (tenant) tiene **sucursales** de dos tipos:

- **Tienda** (`store_type: "T"`): vende, aparta, cobra y recibe traspasos.
- **Almacén** (`store_type: "A"`): distribuye mercancía a las tiendas; no vende.

La **vista general** (`"G"`, sin `store_id`) es el panel del dueño: tableros, sucursales, catálogo, auditoría y facturación.

`user.multistore` (true si el negocio tiene más de una sucursal) activa los traspasos, las distribuciones, el selector de sucursal y la restricción horaria del tablero de ventas. Con una sola sucursal, esas funciones se ocultan y el producto se crea con stock inicial en un solo paso.

Backend (otro repositorio): API REST Django/DRF, WebSocket con Django Channels y tareas pesadas con Celery.

---

## 3. Comandos

```bash
npm ci                 # instalar dependencias
cp .env.template .env  # y llenar valores
npm start              # desarrollo en http://localhost:3000
npm run build          # build de producción en /build
npx eslint <archivos>  # lint (config react-app en package.json)
```

Todos los scripts usan `react-app-rewired` (`config-overrides.js` solo pone `resolve.fullySpecified = false`). No hay tests automatizados todavía; `npm test` existe pero no hay archivos `*.test.*`.

**Antes de dar un cambio por terminado:** `npx eslint` sobre los archivos tocados sin errores nuevos, y `npm run build` si tocaste rutas, imports compartidos o dependencias.

### Variables de entorno

| Variable | Uso |
|---|---|
| `REACT_APP_API_URL` | URL base de la API; el cliente agrega `/api/`. El WebSocket de notificaciones se deriva cambiando `http` por `ws`. |
| `REACT_APP_PRINTER_URL` | URL HTTP del servicio local de impresión |
| `REACT_APP_PRINTER_WS_URL` | WebSocket del servicio de impresión (opcional; si falta se deriva de `REACT_APP_PRINTER_URL`) |
| `REACT_APP_WHATSAPP_NUMBER` | Número del enlace de soporte |
| `REACT_APP_MERCADO_PAGO_PUBLIC_KEY` | Clave pública del formulario de pago |
| `REACT_APP_API_URL_KEY` | Clave `X-API-Key` para el registro público (planes, alta de negocio) |

Nunca commitear `.env` con valores reales; mantener `.env.template` al día.

---

## 4. Stack

| Capa | Tecnología |
|---|---|
| Framework | React 18.3, Create React App 5 + `react-app-rewired` |
| UI | MUI 5.18 (`@mui/material`, `@mui/icons-material`), Emotion |
| Tablas | `@mui/x-data-grid` 6 (envuelto en `DataTable`) |
| Gráficas | `@mui/x-charts` 6 (no hay Chart.js) |
| Estado del servidor | `@tanstack/react-query` 5 (defaults en `src/index.js`: `retry: 1`, `staleTime: 5 min`, sin refetch al enfocar) |
| Estado global | Redux 5 + `reselect`, **solo para los carritos** |
| Rutas | React Router 6 con `lazyRetry` + `Suspense` + `ErrorBoundary` |
| HTTP | Axios centralizado en `src/api/httpClient.js` |
| Códigos de barras | `@zxing/browser` |
| Excel | `xlsx` |
| Alertas | SweetAlert2, solo a través de `src/utils/alerts.js` |
| Pagos | `@mercadopago/sdk-js` (Card Payment Brick, locale es-MX) |

**Prohibido:** Bootstrap / react-bootstrap, otra librería de UI o de gráficas, otro cliente HTTP. Antes de agregar una dependencia, revisa si MUI o una utilidad existente lo resuelve.

---

## 5. Estructura

```
src/
├── App.js              # Rutas + lazyRetry + guard RequireAccess
├── index.js            # QueryClientProvider, Redux Provider, UserProvider
├── store.js, rootReducer.js
├── api/                # Un archivo por recurso + httpClient, apiFactory, utils
├── components/
│   ├── admin/          # Tableros, sucursales, auditoría, perfil, servicios, historial de stock
│   ├── cashflow/       # Caja: movimientos
│   ├── catalog/        # Marcas, departamentos, vendedores
│   ├── clients/        # Clientes, descuentos, búsqueda de cliente
│   ├── inventory/      # Carrito, traspasos, distribuciones, conversiones, solicitudes de ajuste
│   ├── layout/         # Login, MainLayout (sidebar, header, drawer móvil)
│   ├── products/       # Catálogo, inventario por tienda, búsqueda, importaciones, precios
│   ├── sales/          # Pantalla de venta, cobro, ventas, apartados, corte de caja
│   ├── tenant/         # Registro, plan actual, pagos, suscripciones
│   └── ui/             # Componentes compartidos (ver §8)
├── constants/          # index.js (MOVEMENT_TYPES, QUERY_TYPES, STORE_TYPES, CANCELLATION_REASONS, UI_TEXT),
│                       # helpTexts.js (ayuda por ruta), routeAccess.js (permisos)
├── context/            # UserContext: useUser() / updateUser()
├── hooks/              # Hooks reutilizables (ver §7)
├── redux/cart/         # multiCartReducer, cartActions, selectors
├── theme/              # theme.js, colors.js, variables.css
└── utils/              # alerts, array, chart, currency, date, excel, image, logger, print; utils.js re-exporta
```

`src/application/`, `src/domain/` e `src/infrastructure/` existen vacías (sin seguimiento en git; restos de la migración a Next.js). No las uses hasta que una spec defina esa arquitectura.

### Convenciones de archivos

- Componente: `src/components/{dominio}/{Nombre}/{Nombre}.jsx`. Tablas grandes separan columnas en `{Nombre}.columns.jsx`; modales hijos pueden vivir en la misma carpeta.
- En `ui/` hay componentes en carpeta y archivos sueltos (`PageHeader.jsx`, `DropZone.jsx`…). Varias carpetas no coinciden con el export (`Button/` → `CustomButton`, `Modal/` → `CustomModal`, `Tooltip/` → `CustomTooltip`, `Spinner/` → `CustomSpinner`). Respeta lo que existe; no renombres sin una spec.
- API: `src/api/{recurso}.js`. Hooks: `src/hooks/use{Algo}.js`.
- Nombres de variables, componentes y archivos en inglés; textos de UI en español.

---

## 6. Usuarios, permisos y sesión

### Roles

El código solo compara contra `"owner"` y `"seller"`. **Cualquier otro rol se trata como administrador.**

| Rol | En UI | Alcance |
|---|---|---|
| `owner` | Dueño | Todo, incluyendo la vista general, precios, costos, ajustes de stock, aprobaciones y facturación |
| admin | Administrador | Opera su sucursal: venta, caja, catálogo, inventario, movimientos; pide ajustes de stock |
| `seller` | Vendedor | Vender, ventas, apartados, movimientos de caja del día, traspasos (si multi-sucursal) |

### Fuente única de permisos: `src/constants/routeAccess.js`

- `ROUTE_ACCESS` define, por ruta y por vista (`T`, `A`, `G`), qué roles pueden entrar y si requiere `multistore`.
- `RequireAccess` (`src/components/ui/RequireAccess.jsx`) envuelve las rutas en `App.js`. Si no hay acceso, redirige a `getHomeRoute(user)`: almacén → `/distribuir/`, tienda → `/vender/`, dueño en vista general → `/tiendas/`, otros → `/perfil/`.
- El menú de `MainLayout` filtra sus enlaces con `canAccessRoute`, así que **menú y rutas no pueden desincronizarse**.
- `isSalesDashboardRestricted(user)`: con varias sucursales (excepto el tenant `demo`), `/tablero-ventas/` solo abre antes de las 10:00 y desde las 21:00 (reloj local).

**Al agregar una ruta:** agrégala en `App.js` **y** en `ROUTE_ACCESS`; una ruta que no está en el mapa no abre para nadie. Las acciones dentro de una página (botones, columnas) se ocultan por rol con spread condicional: `...(user.role === "owner" ? [{...}] : [])`. No uses `omit`.

**Los permisos se aplican solo en el frontend.** El backend no valida rol ni tipo de sucursal por endpoint (ver `pendientes.md`). No asumas que una llamada a la API está protegida.

### Sesión y sucursal activa

- `useUser()` / `updateUser()` (`src/context/UserContext.js`) es la fuente del usuario y la sucursal activa. Se refleja en `localStorage.user`.
- Al cambiar de sucursal se actualizan `store_id`, `store_name`, `store_type` y `store_printer`, se limpia la caché de React Query y el carrito, y se emite el evento `store-changed`. Si cambia el tipo, se navega a `/vender/` o `/distribuir/`. Las páginas se remontan con `key={pathname-store_id}`.
- Al volver a la vista general: `store_id = null` (nunca `""`) y `store_printer = null`.
- El selector de sucursal es solo para el dueño con varias sucursales; el dueño con una sola sucursal ve "Regresar".

### HTTP (`src/api/httpClient.js`)

- Timeout 60 s. Header `Authorization: Token <token>`.
- Header `store-id` cuando `user.store_id` tiene valor.
- 401 → limpia `localStorage.user` y redirige a `/login`.
- 403 con `code: "subscription_expired"` → marca `access_blocked` y redirige a `/mi-plan-actual/`. Con `access_blocked` solo abren `/mi-plan-actual/`, `/pagos/`, `/suscripciones/` y `/perfil/`.
- **httpClient rechaza ante cualquier error HTTP.** Nunca valides `if (response.status === 200) … else …` sin `try/catch`: el `else` jamás se ejecuta. Los casos específicos (400, 404) se leen de `error.response?.status` en el `catch`.

---

## 7. Patrones de código

### Datos del servidor

- URLs con `getApiUrl(endpoint)` y `buildUrlWithParams(url, params)` de `src/api/utils.js`. No concatenes la URL base a mano.
- CRUD estándar con `createApiService(resource)` (`src/api/apiFactory.js`) y `createMutationHooks(resource, plural, api, { feminine })` (`src/hooks/useCrudMutation.js`). Estos generan mensajes de éxito y error consistentes.
- React Query para lecturas cacheables (`useQuery`) y mutaciones (`useCrudMutation`). `useFetch` y `useFetchWithRetry` (`src/hooks/useFetch.js`) para lecturas simples o con reintento.
- Toda llamada async con `try { … } catch (error) { showRequestError(…) } finally { setLoading(false) }`.

### Hooks existentes (reutiliza antes de crear)

`useAvailableStock`, `useBrands`, `useBrandMutations`, `useCanCreateStore`, `useCartActions`, `useClients`, `useClientMutations`, `useConversions`, `useCrudMutation`, `useDepartments`, `useDepartmentMutations`, `useDiscounts`, `useFetch`, `useFetchWithRetry`, `useForm`, `useKeyboardShortcuts`, `useMercadoPago`, `useModal`, `useOnlineStatus`, `usePrinterStatus`, `useProductSearch`, `useProductSuggestions`, `useRegistration`, `useSaleMutations`, `useStores`, `useTaskPolling`, `useTenantInfo`, `useThemeMode`, `useTransfers`, `useUserManagement`, `useViewModePreference`.

### Estado

- **Redux solo para carritos** (`multiCartReducer`): carritos ilimitados, cada uno con `movementType`, `cart` y `client`. `UPDATE_MOVEMENT_TYPE` vacía el carrito y el cliente. El último carrito no se cierra desde la UI.
- Todo lo demás: estado local, `UserContext` o React Query.

### Alertas (`src/utils/alerts.js`)

| Función | Cuándo |
|---|---|
| `showSuccess("Marca eliminada")` | Éxito; sin adverbios ni signos de exclamación |
| `showWarning("No se pudo <acción>", "<motivo>")` | Regla de negocio o validación que el usuario puede corregir |
| `showRequestError("<verbo> <objeto>", error)` | Petición fallida. Con 4xx y motivo del backend muestra advertencia "No se pudo…"; si no, "Error al…" + `SUPPORT_HINT` |
| `showConfirm(title, text, { confirmText, cancelText, confirmColor, icon })` | Confirmaciones; por defecto "Eliminar" |
| `showAlert`, `showError` | Casos generales |

- Nunca uses títulos genéricos ("Error", "Error desconocido").
- No llames `Swal.fire` directo. Excepción: diálogos con input, validador o `didOpen` (por ejemplo "Vaciar stock" en `StoreList`).

### Rutas y carga

- Todas las rutas: `<Lazy>` = `ErrorBoundary` + `Suspense` + `LoadingFallback`, con componentes cargados por `lazyRetry()` (`App.js`), que recarga la página si falla el chunk.
- Carga: `PageSkeleton` (página), `TableSkeleton` (en `DataTable`) y `CustomSpinner isLoading`.

### Otros

- `memo()` en componentes puros, `useMemo` para cálculos costosos, `useCallback` para funciones estables.
- Logs con `logger` (`src/utils/logger.js`; `log`/`warn` solo en desarrollo). Nada de `console.log`.
- Listas actualizadas con `upsertById(list, item)` (`src/utils/array.js`).
- Montos de solo lectura con `formatCurrency()` (`src/utils/currency.js`) → `$1,234.00`. Los inputs editables guardan el número sin formato. El total a cobrar usa `roundUpCustom()`: centavos ≤ .50 suben a .50; mayores, al siguiente peso.
- Imágenes con `convertImageToWebp()`: WebP 0.85, máximo 1000×1000, sin agrandar; si falla, se conserva el original.
- Exportaciones con `exportToExcel()`. Tickets con `handlePrintTicket()`.
- Constantes de dominio en `src/constants/index.js`. Textos de ayuda por ruta en `src/constants/helpTexts.js`, que usa `PageHelp`; si agregas una pantalla, agrega su ayuda.

---

## 8. Componentes UI compartidos (`src/components/ui/`)

Revisa esta lista antes de crear un componente. Si un patrón se repite en dos archivos, extráelo aquí.

| Componente | Uso |
|---|---|
| `CustomModal` (`Modal/`) | Todos los modales. Props: `showOut`, `onClose`, `title`, `maxWidth` (800). Fondo desenfocado, header con cierre, animación `modal-enter`. |
| `CustomButton` (`Button/`) | Botón MUI con `variant="contained"`, `size="small"`, `minWidth: 0`; respeta el `sx` recibido. |
| `CustomTooltip` (`Tooltip/`) | Props `text`, `position`, `fullWidth`. **Obligatorio en botones de solo ícono.** |
| `CustomSpinner` (`Spinner/`) | Requiere `isLoading`. |
| `DataTable` | DataGrid con búsqueda, orden, paginación, selección y carga. Columnas con `selector` (valor) o `cell` (render); soporta `conditionalRowStyles=[{ when, style }]`. |
| `SimpleTable` | Tabla HTML de solo lectura (modales, importaciones). |
| `PageHeader` | Título + acciones de página. No armes `Stack` + `<h1>` a mano. |
| `PageHelp` | Botón de ayuda que lee `helpTexts.js` según la ruta. |
| `CardGallery` | Cuadrícula de tarjetas con skeleton, vacío y entrada escalonada (`items`, `loading`, `emptyText`, `renderItem`). |
| `Skeleton` | `PageSkeleton`, `TableSkeleton`. |
| `DropZone`, `VisuallyHiddenInput` | Subida de archivos / importaciones. |
| `StatusChip` | Exitoso/Error en validación de importaciones. |
| `AuditCard` | Tarea asíncrona con polling (7.5 s) y descarga. |
| `BarcodeScanner` | Escáner con cámara (móvil). |
| `ConnectionStatusBanner` | Aviso de conexión perdida/restaurada (eventos del navegador). |
| `CountdownTimer`, `ErrorBoundary`, `LoadingFallback`, `Icons` | Utilitarios. |
| `UserModals` | `EditUserModal`, `ChangePasswordModal`. |
| `NotificationsMenu`, `PendingMenu`, `DuplicateSalesMenu`, `StockRequestMenu` | Menús del header; se recargan con `store-changed`. |
| `RequireAccess` | Guard de rutas (ver §6). |

### Tablas

- Pasa siempre `noDataComponent` con un mensaje en español y `progressPending` cuando haya carga.
- Columnas con `TextField`: `width: 100`. Acciones con 3 o más botones: `width` fijo (por ejemplo 180).
- No pases props que ya son el default; si ningún consumidor usa un prop, elimínalo del componente.

---

## 9. Tiempo real, impresión y tareas

### Notificaciones (`NotificationsMenu`)

- WebSocket `{REACT_APP_API_URL→ws}/ws/notifications/?token=…&store_id=…` (`store_id` solo si hay sucursal).
- Solo conecta entre 08:00 y 21:00 (hora local, evaluado al montar).
- Reconexión con backoff exponencial `min(1000·2ⁿ, 30000)` ms, máximo 5 intentos. El contador se reinicia al conectar y al cambiar token o sucursal.
- Agotados los intentos, hace polling cada 60 s a `audit/notifications/` vía `httpClient`. **Ese endpoint todavía no existe en el backend**: el polling recibe 404 y se detiene (ver `pendientes.md`).
- Eventos: `transfer_*`, `distribution_*`, `stock_request_*`, `reservation_created`. Con una sola sucursal se descartan los de traspaso y distribución.
- Al hacer clic se navega al `href` de la notificación si el usuario tiene acceso; si no, se pide entrar a la sucursal.
- Vendedores no ven notificaciones.

### Impresora (`usePrinterStatus`, `utils/print.js`)

- Servicio local HTTP + WebSocket de estado: reconexión a 3/5/10 s, heartbeat 25 s y comprobación HTTP de respaldo (timeout 3 s).
- Deshabilitada en móvil.
- La impresora sale de `user.store_printer`.

### Tareas asíncronas

- Operaciones pesadas (auditorías, tableros, exportaciones) corren en Celery: el backend devuelve `task_id` y el frontend consulta `task-result/{id}/`.
- `useTaskPolling` consulta cada 10 s con cuenta regresiva; `AuditCard` cada 7.5 s.

### Búsqueda de productos

- Sugerencias desde 3 caracteres, espera de 300 ms, máximo 5, con `AbortController`.
- Búsqueda por código con timeout de 8 s y 1 reintento.
- Los tiempos se guardan en `localStorage.search_timing_stats`: `{ tiempos: { "0": N, … }, mas_de_8s: [codigos] }`. Bucket 0 = ≤500 ms, 1 = 501–1500 ms, 2 = 1501–2500 ms, etc.

### Atajos de teclado (`useKeyboardShortcuts` + modales)

Pantalla de venta:

| Atajo | Acción |
|---|---|
| Ctrl+B | Ir a la búsqueda |
| Ctrl+Q | Buscar por código |
| Ctrl+L | Buscar por nombre |
| Ctrl+K | Búsqueda visual |
| Ctrl+E | Venta (tienda) |
| Ctrl+I | Apartado (tienda) |
| Ctrl+D | Distribución (almacén) |
| Ctrl+R | Confirmar traspaso (multi-sucursal) |
| Ctrl+Y | Agregar a inventario |
| Ctrl+U | Checar precio |
| Ctrl+J | Buscar cliente |
| Ctrl+1…5 | Elegir cliente de la lista |
| Ctrl+P | Cobrar |

En el cobro: Ctrl+G confirma y Ctrl+O quita el cliente. En el abono: Ctrl+G cobra con ticket y Ctrl+F sin ticket. Los atajos de cobro respetan las mismas validaciones que el botón.

**No uses Ctrl+W, Ctrl+T ni Ctrl+N:** Chrome y Edge no permiten interceptarlos.

---

## 10. Idioma y terminología de UI

- UI 100 % en español; evita anglicismos cuando hay equivalente: Dashboard → **Tablero**, Logs → **Historial de stock**. "Stock" se permite.
- **Sucursal** = tienda o almacén. Usa "Tienda" o "Almacén" cuando se refiere a un tipo, y "Sucursal" solo cuando abarca ambos.
- Montos de solo lectura (tablas, etiquetas, totales, campos deshabilitados, alertas) siempre `$1,234.00` vía `formatCurrency`.
- Roles en UI: Dueño, Administrador, Vendedor.

---

## 11. Estilo visual

Fuente de valores: `src/theme/theme.js`, `src/theme/colors.js`, `src/theme/variables.css`.

- **Nunca hardcodear hex** en componentes: usa tokens del tema (`primary`, `secondary`, `accent`, `text.primary`, `text.secondary`, `divider`, `info.light`…) o `colors` de `src/theme/colors.js`.
- Layouts con `Box`/`Stack` y `sx`, no `style` inline. Estados con clases `text-success`, `text-danger` y `text-warning`. Patrones repetidos van como clase en `App.css`.
- Sin `@keyframes` inline en `sx`.

### Tipografía

Texto `Inter`; títulos h1–h4 `Plus Jakarta Sans` (700–800); números `tabular-nums`.

| Nivel | Tamaño | Peso |
|---|---|---|
| h1 | 1.75rem | 800 |
| h2 | 1.5rem | 700 |
| h3 | 1.25rem | 700 |
| h4 | 1.125rem | 700 |
| h5 | 1rem | 600 |
| h6 | 0.875rem | 600 |
| body1 | 0.875rem | 400 |
| body2 | 0.8125rem | 400 |
| button | 0.8125rem | 600, sin mayúsculas forzadas |

### Paleta

| Token | Claro | Oscuro |
|---|---|---|
| primary | `#04346b` (light `#065a9e`, dark `#022347`) | igual |
| secondary | `#e94560` | igual |
| accent | `#a78bfa` | igual |
| background.default | `#e8eef6` | `#0d1117` |
| background.paper | `#ffffff` | `#161b22` |
| divider | `#e2e8f0` | `#30363d` |
| text.primary | `#1e293b` | `#e6edf3` |
| text.secondary | `#4a5568` | `#8b949e` |

Degradados en `colors.gradient`:
- Sidebar y login: `180deg #04346b → #022347`.
- Botón de login: `135deg #04346b → #065a9e`.
- Íconos de KPI: azul, verde, violeta, ámbar y cian.

### Formas, sombras y movimiento

- **Radios:** Paper/Card/.card 12px · Button/TextField/Select/Alert 8px · Dialog 16px · Chip 999px · Tooltip 6px.
- **Sombras teñidas de marino en modo claro** (negras en oscuro):
  - Ligera: `0 1px 2px rgba(2,35,71,.06)`
  - Media: `0 8px 24px rgba(2,35,71,.10)`
  - Amplia: `0 24px 60px rgba(2,35,71,.18)`
  - Marca: `0 4px 14px rgba(4,52,107,.25)`
- **Animaciones en `App.css`:**
  - `fade-in-up`: tarjetas y paneles; escalonar con `animationDelay`, 60 ms.
  - `fade-in-left`: campos condicionales.
  - `dropdown-enter`: poppers.
  - `value-pop`: cambio de valor; cambia el `key` para repetirla.
  - `page-enter` y `modal-enter`: ya aplicadas en el layout y en `CustomModal`.
- Sidebar activo: barra violeta de 3px.
- `DataTable` recargando: barra de progreso azul → violeta.
- Todo se desactiva con `prefers-reduced-motion`.
- Modo oscuro/claro guardado en `localStorage` (`useThemeMode`).

---

## 12. Código limpio

- Sin imports, variables, exports ni props sin usar. Si un prop o export no se usa en ningún archivo, elimínalo.
- Sin código comentado ni JSX muerto. Sin `console.log`.
- No dupliques componentes ni styled components: extráelos a `components/ui/`.
- No pases props que ya son el default del componente receptor.
- Comentarios solo donde aportan; escribe como el código que lo rodea.

---

## 13. Flujo de trabajo

### Git

- Ramas: `develop` → `staging` → `main`. Trabaja sobre `develop` o ramas de feature.
- Commits en inglés, formato convencional: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `perf:`, `chore:`.
- **Los agentes no hacen commit ni push si no se les pide explícitamente.** Pedir "un mensaje de commit" significa redactarlo, no ejecutarlo.

### Specs

- Feature nueva o cambio grande: crea `.kiro/specs/{feature-kebab}/` con `requirements.md` (historias y criterios de aceptación), `design.md` y `tasks.md` (checklist). Al terminar, marca las tareas y resume en el README.

### README (fuente de la landing page)

Actualiza `README.md` en el mismo cambio cuando cambie una funcionalidad visible, un permiso, el stack o la arquitectura:
- Fecha de "Última actualización".
- Descripción de la funcionalidad en **lenguaje de cliente**. Nada de términos técnicos: Stepper, WebSocket, badge, popover, drag & drop, endpoint, etc.
- Solo describe lo que el código hace hoy. **No publiques precios** en el README: viven en la landing y en el backend.
- La sección técnica del README es para compradores (arquitectura SaaS, seguridad, integraciones). Los detalles de implementación van aquí, no en el README.

### pendientes.md

Si encuentras un bug que no vas a corregir en ese momento, regístralo en `pendientes.md` con archivo:línea, qué pasa y la corrección sugerida. Al corregirlo, quítalo de ahí.
