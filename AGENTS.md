# AGENTS.md — SmartVenta Frontend

Instrucciones para cualquier agente de código (Claude Code, Kiro, Codex, Cursor, etc.) y para personas que trabajen en este repositorio. **Este archivo es la única fuente de reglas técnicas.** `CLAUDE.md` y `.kiro/steering/project.md` solo lo importan; no dupliques reglas en ellos.

> Última revisión: 10 de octubre de 2026

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
| `REACT_APP_WHATSAPP_NUMBER` | Número del enlace de soporte (se lee con `getSupportWhatsAppUrl` en `api/utils.js`) |
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
├── api/
│   ├── httpClient.js   # Cliente HTTP centralizado, reconexión 401
│   ├── apiFactory.js   # Factory para CRUD estándar
│   ├── products.js, store-products.js, catalog-products.js, products-common.js
│   ├── conversions.js, users.js, … (un archivo por recurso)
│   ├── utils.js (re-exportación)
│   ├── api-url.js      # Builders de URLs
│   ├── api-user.js     # Endpoints de usuario
│   └── api-serializers.js  # Serialización de datos
├── components/
│   ├── admin/          # Tableros, sucursales, auditoría, perfil, servicios, historial de stock
│   ├── cashflow/       # Caja: movimientos
│   ├── catalog/        # Marcas, departamentos, vendedores
│   ├── clients/        # Clientes, descuentos, búsqueda de cliente
│   ├── inventory/      # Carrito, traspasos, distribuciones, conversiones, solicitudes de ajuste
│   ├── layout/         # Login, MainLayout (sidebar, header, drawer móvil)
│   │   └── MainLayout/
│   │       ├── menu-config.js     # Configuración pura del menú (ICONS, rutas)
│   │       ├── menu-builders.js   # Lógica de construcción (buildMenu, filterMenu)
│   │       └── menuConfig.js      # Re-exportación backward compatible
│   ├── products/       # Catálogo, inventario por tienda, búsqueda, importaciones, precios
│   ├── sales/          # Pantalla de venta, cobro, ventas, apartados, corte de caja
│   ├── tenant/         # Registro, plan actual, pagos, suscripciones
│   └── ui/             # Componentes compartidos por varios dominios (ver §8)
├── constants/
│   ├── index.js        # Re-exportación
│   ├── enums.js        # MOVEMENT_TYPES, QUERY_TYPES, STORE_TYPES, PAYMENT_METHODS, SALE_TYPES,
│   │                    # UNIT_LABELS/isWeightedUnit, CANCELLATION_REASONS, UI_TEXT, PRODUCT_VIEW_OPTIONS
│   ├── helpers.js      # isWeightedUnit() y helpers
│   ├── helpTexts.js    # Ayuda por ruta
│   ├── routeAccess.js  # Permisos: ROLES, isOwner/isSeller/isAdmin, isStoreView…
│   ├── storageKeys.js  # Claves de localStorage
│   └── pageMeta.js     # Metadatos de páginas
├── context/            # UserContext: useUser() / updateUser()
├── hooks/              # Hooks reutilizables (30+ documentados en HOOKS_DOCUMENTATION.md)
├── redux/cart/
│   ├── priceCalculators.js   # Cálculos de precio y descuentos (funciones puras)
│   ├── stockCalculators.js   # Validaciones de stock (funciones puras)
│   ├── itemManipulators.js   # CRUD de items del carrito (funciones puras)
│   ├── multiCartReducer.js   # Reducer principal
│   ├── cartActions.js        # Action creators
│   └── selectors.js          # Selectores memoizados
├── theme/
│   ├── colors.js       # Fuente única de colores y sombras (primitivas y tokens)
│   ├── index.js        # Re-exportación (colors, getTheme)
│   ├── base.js         # Configuración base MUI
│   ├── typography.js   # Tipografía MUI
│   ├── components.js   # Component overrides
│   ├── factory.js      # Theme factory (combina base + typo + components)
│   ├── theme.js        # getTheme() + cssVariables
│   └── cssVariables.js # Inyecta CSS variables al cambiar modo
└── utils/              # Utilidades (alerts, apiErrors, array, chart, currency, date, excel, image, logger, print, storage)
    └── utils.js        # Re-exportación
```

### Arquitectura por capas

| Capa | Archivos | Responsabilidad |
|---|---|---|
| **API** | `src/api/` | HTTP centralizado, builders de URL, serialización |
| **Redux** | `src/redux/cart/` | Estado global del carrito (funciones puras) |
| **Hooks** | `src/hooks/` | Lógica reutilizable (30+ documentados) |
| **Componentes** | `src/components/` | UI + lógica de negocio por dominio |
| **Constantes** | `src/constants/` | Enums, helpers, permisos, textos |
| **Tema** | `src/theme/` | Colores, tipografía, componentes MUI |
| **Utilidades** | `src/utils/` | Helpers: alertas, storage, Excel, imágenes |

### Convenciones de archivos

- Componente: `src/components/{dominio}/{Nombre}/{Nombre}.jsx`. En la misma carpeta viven sus partes: subcomponentes (`PaymentTotals.jsx`), hooks propios (`usePaymentMethods.js`), columnas (`{Nombre}.columns.jsx`), estilos (`{Nombre}.styles.js`), configuración pura (`menuConfig.js`), validaciones (`productValidation.js`) y diálogos (`resetStoreDialog.js`).
- Código compartido **dentro de un dominio**: `components/{dominio}/shared/` (por ejemplo `products/shared/`, `sales/shared/`). Si lo usa más de un dominio, va en `components/ui/` o en `src/hooks/`.
- En `ui/` hay componentes en carpeta y archivos sueltos (`PageHeader.jsx`, `DropZone.jsx`…). Varias carpetas no coinciden con el export (`Button/` → `CustomButton`, `Modal/` → `CustomModal`, `Tooltip/` → `CustomTooltip`, `Spinner/` → `CustomSpinner`). Respeta lo que existe; no renombres sin una spec.
- API: `src/api/{recurso}.js`. Hooks reutilizables: `src/hooks/use{Algo}.js` (export nombrado).
- Nombres de variables, componentes y archivos en inglés; textos de UI en español.

---

## 6. Usuarios, permisos y sesión

### Roles

Usa siempre los helpers de `src/constants/routeAccess.js`: `isOwner(user)`, `isSeller(user)`, `isAdmin(user)` y `getRole(user)`. Nunca compares `user.role` contra un literal. **Cualquier rol distinto de `owner` y `seller` se trata como administrador.** Para la vista: `isStoreView`, `isWarehouseView` e `isGeneralView`, o `STORE_TYPES`.

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

**Al agregar una ruta:** agrégala en `App.js` **y** en `ROUTE_ACCESS`; una ruta que no está en el mapa no abre para nadie. Las acciones dentro de una página (botones, columnas) se ocultan por rol con spread condicional: `...(isOwner(user) ? [{...}] : [])`. `DataTable` ya no soporta `omit`.

**Los permisos se aplican solo en el frontend.** El backend no valida rol ni tipo de sucursal por endpoint (ver `pendientes.md`). No asumas que una llamada a la API está protegida.

### Sesión y sucursal activa

- `useUser()` / `updateUser()` (`src/context/UserContext.js`) es la fuente del usuario y la sucursal activa. Se refleja en `localStorage.user`.
- **Cambiar de sucursal solo con `useSwitchStore()`** (`switchStore(store, { withOverlay })`, `backToGeneral()`). El hook actualiza `store_id`, `store_name`, `store_type` y `store_printer`, limpia la caché de React Query y el carrito, emite `store-changed` y navega a `/vender/` o `/distribuir/` si cambia el tipo. No repitas esa secuencia a mano. Las páginas se remontan con `key={pathname-store_id}`.
- Al volver a la vista general: `store_id = null` (nunca `""`) y `store_printer = null`.
- El menú lateral se arma en `layout/MainLayout/menuConfig.js` (`buildMenu(user, { stores })`), filtrado con `canAccessRoute`.
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

- URLs con `getApiUrl(endpoint)` y `buildUrlWithParams(url, params)` de `src/api/utils.js`; archivos estáticos con `getStaticUrl(path)`, WebSocket con `getApiWsUrl(path)` y cuerpos multipart con `toFormData(data)`. No concatenes la URL base a mano ni pongas `Content-Type` (axios lo resuelve).
- Las llamadas HTTP van en `src/api/{recurso}.js`; no llames a `httpClient` desde componentes nuevos.
- Lecturas cacheables simples con `createQueryHook(key, fetchFn)` (`src/hooks/createQueryHook.js`): devuelve `response.data`.
- CRUD estándar con `createApiService(resource)` (`src/api/apiFactory.js`) y `createMutationHooks(resource, plural, api, { feminine })` (`src/hooks/useCrudMutation.js`). Estos generan mensajes de éxito y error consistentes.
- React Query para lecturas cacheables (`useQuery`) y mutaciones (`useCrudMutation`). `useFetch` y `useFetchWithRetry` (`src/hooks/useFetch.js`) para lecturas simples o con reintento.
- Toda llamada async con `try { … } catch (error) { showRequestError(…) } finally { setLoading(false) }`.

### Hooks existentes (reutiliza antes de crear)

| Hook | Para qué |
|---|---|
| `createQueryHook(key, fetchFn)` | Fábrica de lecturas cacheables (`useBrands`, `useDepartments`, `useDiscounts`, `useClients`, `useConversions`, `useTenantInfo`, `useStores`…) |
| `useStoreOptions(params)` | Lista de sucursales cacheada (selects); `useStores` es el resumen de caja por sucursal |
| `useCrudMutation`, `createMutationHooks`, `useCatalogMutations`, `useClientMutations`, `useSaleMutations` | Mutaciones con mensajes e invalidación |
| `useModal`, `useForm` | Abrir/cerrar modales con datos; estado de formularios |
| `useSwitchStore` | Cambio de sucursal / volver a vista general |
| `useCtrlShortcut(keys, handler, { enabled })` | Atajo Ctrl+tecla con un solo listener y el handler en ref |
| `useKeyboardShortcuts` | Atajos de la pantalla de venta (tabla tecla → acción) |
| `useDebouncedSearch(query, searchFn, { minChars, delay })` | Autocompletar con espera, `AbortController` y descarte de respuestas viejas |
| `useProductSearch`, `useProductSuggestions` | Búsqueda de productos por código y sugerencias |
| `useCodeNameSearch(setParams)` | Filtro código/nombre de listas de productos |
| `useScrollPreservingUpsert(setList)` | Actualizar una fila sin perder el scroll de `DataTable` |
| `useImportFlow({ initialForm, validate, importFile, … })` | Flujo de importación Excel: archivo → validar → importar |
| `useTaskPolling(startTask, { errorAction })` | Tareas Celery con progreso y cuenta regresiva |
| `useCardFormModal({ containerId, amount, submit, onSuccess })` | Modal con formulario de tarjeta de Mercado Pago |
| `useUserManagement` | Editar usuario / cambiar contraseña (con `UserManagementModals`) |
| `useCartActions`, `useAvailableStock` | Agregar al carrito respetando stock reservado entre carritos |
| `useViewModePreference(key)` | Preferencia tabla/galería persistida |
| `useFetch`, `useFetchWithRetry` | Lecturas con timeout y reintento (búsqueda por código) |
| `useMercadoPago`, `usePrinterStatus`, `useOnlineStatus`, `useThemeMode`, `useCanCreateStore`, `useTransfers`, `useRegistration` | Integraciones y estado puntual |

### Estado

- **Redux solo para carritos** (`multiCartReducer`): carritos ilimitados, cada uno con `movementType`, `cart` y `client`. `UPDATE_MOVEMENT_TYPE` vacía el carrito y el cliente. El último carrito no se cierra desde la UI. Acciones en `cartActions.js`; lee el estado con `selectors.js` (no `state.multiCartReducer` directo).
- `localStorage` solo a través de `src/utils/storage.js` (`readJSON`, `writeJSON`, `readString`, `writeString`, `removeKey`; nunca lanzan) con claves de `STORAGE_KEYS` (`src/constants/storageKeys.js`).
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
- No llames `Swal.fire` directo. Excepción: diálogos con input, validador o `didOpen`; van en un archivo propio junto al componente y escapan el texto del usuario (ejemplo: `admin/StoreList/resetStoreDialog.js`).
- `showConfirm` usa por defecto "Eliminar" en rojo (`colors.error`). Todas las eliminaciones se ven igual: no cambies el color ni el texto.

### Rutas y carga

- Todas las rutas: `<Lazy>` = `ErrorBoundary` + `Suspense` + `LoadingFallback`, con componentes cargados por `lazyRetry()` (`App.js`), que recarga la página si falla un chunk, como máximo una vez cada 10 s (hora guardada en `sessionStorage`); si vuelve a fallar dentro de esa ventana, lo muestra `ErrorBoundary`.
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
| `CustomModal` (`Modal/`) | Todos los modales. Props: `showOut`, `onClose`, `title`, `maxWidth` (800). Fondo desenfocado, header con cierre, animación `modal-enter`. **`ModalBody`** (export nombrado) es el cuerpo con padding y fondo `modalBody.main`; no repitas ese `sx`. |
| `CustomButton` (`Button/`) | Botón MUI con `variant="contained"`, `size="small"`, `minWidth: 0`; respeta el `sx` recibido. |
| `CustomTooltip` (`Tooltip/`) | Props `text`, `position`, `fullWidth`. **Obligatorio en botones de solo ícono.** |
| `CustomSpinner` (`Spinner/`) | Requiere `isLoading`. |
| `DataTable` | DataGrid con búsqueda, orden, paginación, selección y carga. Columnas con `selector` (valor) o `cell` (render); soporta `conditionalRowStyles=[{ when, style }]`. No soporta `omit` ni `style` por columna. |
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
| `UserModals` | `EditUserModal`, `ChangePasswordModal` y `UserManagementModals` (ambos conectados a `useUserManagement()` vía prop `management`). |
| `NotificationsMenu`, `PendingMenu`, `DuplicateSalesMenu`, `StockRequestMenu` | Menús del header construidos sobre `HeaderPopoverMenu`; se recargan con `store-changed`. |
| `HeaderPopoverMenu` | Base de los menús del header: botón con badge + `CustomTooltip`, Popover con título, lista con scroll y estado vacío. `autoHideBadge={false}` si el badge lo controla el padre. |
| `DateRangeFilter` | "Fecha de inicio" / "Fecha de fin" (+ "Rango" con `showRange`) como `Grid item`s; `onChange` recibe el evento con `name` `start_date`/`end_date`. |
| `StoreSelect` | Select de sucursales con `useStoreOptions` (`params`, `allLabel`, `placeholder`, `getOptionLabel`). |
| `ViewModeToggle` | Selector de vista: `variant="select"` (opciones `PRODUCT_VIEW_OPTIONS`) o `"buttons"` (íconos). |
| `EmptyState` | Ícono + mensaje centrado (tableros); `compact` para menús. |
| `LabelValue` | Línea "Etiqueta: valor" de tarjetas. |
| `Import/` | `ImportStepper`, `ImportFileDrop`, `ImportValidateButton`, `ImportSubmitButton`, `ImportErrorRows`; se usan con `useImportFlow`. |
| `RequireAccess` | Guard de rutas (ver §6). |

Componentes compartidos dentro de un dominio:

| Carpeta | Contenido |
|---|---|
| `products/shared/` | `CodeNameSearchBar`, `ProductFilterFields`, `CatalogAutocomplete`, `GridCardBase`, `storeProductColumns`, `StoreProductModals`, `useStoreProductActions`, `useStoreProductList`, `useFilteredList`, `useCatalogOptions` (+ `useInvalidateCatalogOptions` tras cambiar productos), `usePriceLogTable` |
| `sales/shared/` | `PaymentSubmitPanel` (botón de cobro + estado de impresora), `PrintTicketButton`, `SaleSearchFields` |
| `admin/Dashboard/` | `Filters`, `MainBarChart`, `KPICard`, `StatCard`, `InsightCard`, `DashboardLoading`, `TodayReferenceLine`, `StoreComparisonTable`, `chartStyles.js`, `chartData.js` |
| `inventory/Cart/` | `quantityRules.js` + `QuantityInput` (reglas de cantidad por modo de venta), `CartItemCard`, `CartToolbar`, `useCartSubmit` |

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

En el cobro: Ctrl+G confirma y Ctrl+O quita el cliente (solo con el cobro abierto). En el abono: Ctrl+G cobra con ticket y Ctrl+F sin ticket. Los atajos de cobro respetan las mismas validaciones que el botón.

- Atajos nuevos con `useCtrlShortcut`; nunca `window.addEventListener("keydown")` en un componente.
- Si la tecla debe quedar bloqueada aunque no actúe (como Ctrl+P), deja `enabled` y revisa la condición dentro del handler. Si el navegador debe recuperar la tecla cuando no aplica (Ctrl+F en el abono), usa `{ enabled: isOpen }`.
- **No uses Ctrl+W, Ctrl+T ni Ctrl+N:** Chrome y Edge no permiten interceptarlos.

---

## 10. Idioma y terminología de UI

- UI 100 % en español; evita anglicismos cuando hay equivalente: Dashboard → **Tablero**, Logs → **Historial de stock**. "Stock" se permite.
- **Sucursal** = tienda o almacén. Usa "Tienda" o "Almacén" cuando se refiere a un tipo, y "Sucursal" solo cuando abarca ambos.
- Montos de solo lectura (tablas, etiquetas, totales, campos deshabilitados, alertas) siempre `$1,234.00` vía `formatCurrency`.
- Roles en UI: Dueño, Administrador, Vendedor.

---

## 11. Estilo visual

Fuente única de colores y sombras: `src/theme/colors.js` (primitivas, `status` y `modes.light/dark`). `theme.js` y `cssVariables.js` solo los leen: `theme.js` arma el tema MUI y `cssVariables.js` publica las variables CSS (`--color-*`, `--shadow-*`) al cambiar de modo desde `useThemeMode`. `variables.css` solo guarda radio, espaciado, fuente y easing. **No repitas un valor de color en estos archivos**: agrégalo a `colors.js`.

- **Nunca hardcodear hex ni rgba** en componentes. Usa tokens del tema (`primary`, `secondary`, `accent`, `success`, `error`, `text.*`, `divider`, `common.white`…), `alpha(theme.palette.x.main, o)` para transparencias, o `colors` de `src/theme/colors.js`.
- `colors.js` tiene las primitivas que no son tokens de MUI:
  - `error` (= `error.main`), `whatsapp`, `backdrop`, `appbar`.
  - `shadow.{light, medium, brand, brandHover, appbar, card, toast, dialog, logo}`.
  - `gradient.{sidebar, brand, brandHover, kpi[]}`.
- Si un valor se repite y no existe, agrégalo a `colors.js`; no lo dejes en el componente.
- Gráficas (`@mui/x-charts`): el texto SVG no acepta rutas del tema como `'text.secondary'`. Usa los estilos de `admin/Dashboard/chartStyles.js`, que leen variables CSS (`var(--color-text-secondary)`) y siguen el modo oscuro. La paleta de series es `CHART_COLORS` (`utils/chart.js`).
- Inputs: nunca fondo fijo (`#fff`); usa `background.paper`, o rompe el modo oscuro.
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
| primary | `#0030cc` (light `#0079be`, dark `#00269e`) | igual |
| secondary | `#00a4db` | igual |
| accent | `#ffb020` (ámbar, solo botón principal del registro y detalles; dark `#f59e0b`; texto sobre ámbar `onAccent` `#0b1b4d`; el sidebar activo usa `sidebarActive` `#00e0d8`) | igual |
| background.default | `#f5f9ff` | `#0d1117` |
| background.paper | `#ffffff` | `#161b22` |
| divider | `#e2e8f0` | `#30363d` |
| text.primary | `#0f172a` | `#e6edf3` |
| text.secondary | `#475569` | `#8b949e` |

`colors.js` define las primitivas que consume `theme.js` (no repitas hex en el tema). Degradados en `colors.gradient`:
- Sidebar y login: `180deg #0079be → #00269e`.
- Botón de login: `135deg #0030cc → #0079be`.
- Íconos de KPI: azul, verde, verde azulado, ámbar y cian.

### Formas, sombras y movimiento

- **Radios:** Paper/Card/.card 12px · Button/TextField/Select/Alert 8px · Dialog 16px · Chip 999px · Tooltip 6px.
- **Sombras teñidas de azul en modo claro** (negras en oscuro):
  - Ligera: `0 1px 2px rgba(0,38,158,.06)`
  - Media: `0 8px 24px rgba(0,38,158,.10)`
  - Amplia: `0 24px 60px rgba(0,38,158,.18)`
  - Marca: `0 4px 14px rgba(0,48,204,.25)`
- **Animaciones en `App.css`:**
  - `fade-in-up`: tarjetas y paneles; escalonar con `animationDelay`, 60 ms.
  - `fade-in-left`: campos condicionales.
  - `dropdown-enter`: poppers.
  - `value-pop`: cambio de valor; cambia el `key` para repetirla.
  - `page-enter` y `modal-enter`: ya aplicadas en el layout y en `CustomModal`.
- Sidebar activo: barra turquesa de 3px.
- `DataTable` recargando: barra de progreso azul → ámbar.
- Todo se desactiva con `prefers-reduced-motion`.
- Modo oscuro/claro guardado en `localStorage` (`useThemeMode`).

---

## 12. Reglas de código (checklist)

Reglas derivadas de la auditoría del 2026-10-04. Revísalas antes de terminar un cambio.

**Datos y API**
1. Toda petición HTTP y toda URL del backend (plantillas, WebSocket, WhatsApp) sale de una función en `src/api/`. Los componentes y hooks no importan `httpClient`, `apiFactory` ni `process.env`.
2. Query params con `buildUrlWithParams`; multipart con `toFormData`. Las funciones de `api/` no mutan sus argumentos.
3. Lecturas cacheables con `createQueryHook` o `useQuery`. Los catálogos compartidos (sucursales, marcas, departamentos) se leen con su hook (`useStoreOptions`, `useBrands`, `useDepartments`), nunca con `useEffect` + `getX()`.
4. Mutaciones con `useCrudMutation` / `createMutationHooks`: invalidan la query. No pases `onUpdate={refetch}` además.
   - No asumas que un `PATCH` devuelve el objeto completo. Varios endpoints solo devuelven los campos enviados, sin `id`; por ejemplo, el update de `cashflow` devuelve `CashFlowCreateSerializer`. Antes de usar `upsertById` con la respuesta, verifica que traiga `id`; si no, recarga.
   - Si los datos de una query cambian por acciones que no la invalidan (traspasos creados desde la venta o desde otra sucursal), usa `refetchOnMount: "always"` en su hook.
5. Un fetch dentro de `useEffect` lleva guard de respuesta vieja (`let ignore = false` + cleanup) y `try/catch/finally`. Ejemplo: `cashflow/CashFlowList/CashFlowList.jsx`.
6. Nunca `response.status === 200/201`: si no lanzó, salió bien. Los casos 400/404 se leen de `error.response?.status`.
7. Nunca `.then()` sin `.catch`, ni `catch {}` vacío. En acciones del usuario: `showRequestError`. En cargas de fondo (menús del header): `logger.error`.
8. Búsquedas mientras se escribe: `useDebouncedSearch` (o el patrón de `useProductSuggestions`), siempre con `AbortController`.

**Constantes y helpers**
9. Sin literales de dominio. Usa:
   - `STORE_TYPES`, `QUERY_TYPES`, `MOVEMENT_TYPES`
   - `PAYMENT_METHODS` / `PAYMENT_METHOD_OPTIONS`, `SALE_TYPES`
   - `UNIT_LABELS` / `isWeightedUnit`
   - `ROLES` con `isOwner` / `isSeller` / `isAdmin`

   Ojo: `SALE_TYPES.RESERVATION` y `STORE_TYPES.WAREHOUSE` valen ambos `"A"`.
10. `localStorage` solo con `utils/storage.js` y claves de `STORAGE_KEYS`.
11. Fechas largas con `formatLongDate`, conteos con `formatNumber`, dinero con `formatCurrency`, años con `getYearOptions`. Nada de `toLocaleString` suelto.
12. Reglas de negocio puras fuera del componente, en un archivo junto a él. Ejemplos: `productValidation.js` (precios) y `quantityRules.js` (cantidades del carrito). Un modal que comparte reglas con otro importa el mismo archivo.

**Componentes**
13. Máximo ~300 líneas por componente. Si crece, separa en hooks `use<Feature>.js` y subcomponentes en la misma carpeta antes de agregar más.
14. Si el mismo bloque JSX aparece dos veces (escritorio/móvil, tarjeta/tabla), es un componente con prop `variant`. Ejemplo: `inventory/Cart/CartItemCard.jsx`.
15. Constantes que no dependen de props o estado (columnas fijas, opciones, `INITIAL_FORM`) van a nivel de módulo, no en `useMemo([])`. Las dependencias de `useMemo`/`useEffect` van completas. Para llamar al handler más reciente sin re-suscribir, usa una ref (`handlerRef.current = handler`), no `eslint-disable`.
16. Colores por estado con un mapa (`STATUS_TONE`), no con ternarios encadenados. Filtros rápidos con un mapa `QUICK_FILTERS` de predicados. Columnas por filtro con un mapa `FILTER_COLUMNS`.
17. Títulos de página con `PageHeader`, cuerpo de modal con `ModalBody`, estados vacíos con `EmptyState`, "Etiqueta: valor" con `LabelValue`. Nada de `<h1>`, `<p style>` ni `style={{}}`.
18. Botones de solo ícono siempre con `CustomTooltip`. Elementos clicables son `Button`/`IconButton`, no `Typography` con `onClick`.
19. Un solo indicador de carga por vista: `progressPending` en `DataTable` **o** `CustomSpinner`, no ambos.
20. Si un modal recibe el resultado de un hook como prop (`management`, `cardForm`), el hook vive en el padre y el modal solo renderiza.

**Limpieza**
- Sin imports, variables, exports ni props sin usar. Si un prop o export no se usa en ningún archivo, elimínalo.
- Sin código comentado ni JSX muerto. Sin `console.log`.
- No pases props que ya son el default del componente receptor.
- Comentarios solo donde aportan; escribe como el código que lo rodea.

**Verificación**: `npx eslint --ext .js,.jsx src` sin errores ni warnings (sin `--ext` no revisa nada) y `npm run build`.

---

## 13. Patrones de referencia

Antes de escribir algo nuevo, copia el ejemplo correspondiente.

| Necesito… | Copia de | Clave del patrón |
|---|---|---|
| Página de lista CRUD | `inventory/ConversionList/ConversionList.jsx` | Lectura con hook de query, `useModal`, borrado `showConfirm` → mutation, columnas por rol con spread, `noDataComponent` con llamada a la acción |
| Lista genérica para varias entidades | `catalog/CatalogList/CatalogList.jsx` + `BrandList`/`DepartmentList` | Un componente; cada entidad le pasa `useData`, `queryKey`, `deleteFn`, `useCreate`/`useUpdate` y `labels` |
| API + hooks de un recurso | `api/conversions.js` + `hooks/useConversions.js` | `createApiService`, `createQueryHook`, `createMutationHooks`; acciones extra con `useCrudMutation` y el mismo `queryKey` |
| Modal de formulario simple | `catalog/CatalogModal/CatalogModal.jsx` | `useForm(INITIAL)` de módulo, sincroniza al abrir, `(id ? update : create).mutate` |
| Validación por campo | `products/ProductModal/productValidation.js` | Función pura → objeto de errores → `error`/`helperText` por campo; botón deshabilitado si hay errores |
| Lista con filtros y fechas | `cashflow/CashFlowList/CashFlowList.jsx` | `params` en estado, `DateRangeFilter`, fetch con guard, `upsertById` al editar |
| Lista bajo demanda por filtros | `products/shared/useFilteredList.js` | Lista + params + loading con guard de respuesta vieja |
| Tabla ↔ galería | `products/ProductList/ProductList.jsx` | `useViewModePreference` + `ViewModeToggle` + `CardGallery`; en móvil siempre galería |
| Columnas en archivo aparte | `admin/StoreList/StoreList.columns.jsx` | Fábricas `getXColumns({ … })`, helpers `cashCol`/`countCol`, `FILTER_COLUMNS` |
| Tablero con tarea Celery | `admin/Dashboard/ProductsDashboard.jsx` + `api/dashboards.js` | `startTask` memoizado → `useTaskPolling`, `Filters`, `DashboardLoading`, `EmptyState`, `chartStyles` |
| Importación Excel | `sales/SaleImport/SaleImport.jsx` | `useImportFlow` + `ui/Import/*` + `getStaticUrl` para la plantilla |
| Exportación Excel | `products/ProductList` (`handleDownload`) | Filas con encabezados en español → `exportToExcel(data, "Nombre")` |
| Atajo de teclado en modal | `sales/PaymentEditModal/PaymentEditModal.jsx` | `useCtrlShortcut` con la misma regla de deshabilitado que el botón |
| Botón de cobro con impresora | `sales/shared/PaymentSubmitPanel.jsx` | Estado de impresora + texto con/sin ticket |
| Menú del header | `ui/PendingMenu/PendingMenu.jsx` | `HeaderPopoverMenu` + fetch con `logger.error` + escucha `store-changed` |
| WebSocket con reconexión | `hooks/usePrinterStatus.js` | Backoff, heartbeat, guard `activeRef`, `closeSocket()` anula handlers antes de cerrar, respaldo HTTP |
| Autocompletar | `hooks/useDebouncedSearch.js` (uso: `inventory/ConversionModal`) | Espera, `AbortController`, `minChars` |
| Formulario de tarjeta Mercado Pago | `hooks/useCardFormModal.js` (uso: `tenant/MyCurrentPlan`) | Monta el Brick al abrir, desmonta al cerrar o desmontar |
| Foto con la cámara | `products/ProductList/useProductImageCapture.js` + `utils/image.js` | Input oculto `capture="environment"` → `convertImageToWebp` → `upsertById` |
| Partir un componente grande | `layout/MainLayout/` y `sales/PaymentModal/` | `.styles.js`, config pura, subcomponentes y hooks en la misma carpeta |
| Diálogo Swal especial | `admin/StoreList/resetStoreDialog.js` | Archivo propio, escapa el texto del usuario, colores de `colors.js` |

---

## 14. Flujo de trabajo

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

---

## 15. Refactorización completada (octubre 2026)

Entre septiembre 26 y octubre 10 de 2026, se ejecutó una refactorización exhaustiva sin cambios de comportamiento. El objetivo fue modularizar archivos grandes, mejorar legibilidad y facilitar mantenimiento futuro.

### Refactores ejecutados

**Redux (3 módulos):** `multiCartReducer.js` → `priceCalculators.js`, `stockCalculators.js`, `itemManipulators.js`. Cada uno contiene funciones puras de un dominio.

**Tema (4 módulos):** `theme.js` → `base.js`, `typography.js`, `components.js`, `factory.js`. Separación clara entre configuración base, tipografía y overrides.

**API Productos (3 módulos):** `products.js` → `store-products.js`, `catalog-products.js`, `products-common.js`. Por tipo de producto.

**Constantes (2 módulos):** `constants/index.js` → `enums.js`, `helpers.js`. Datos puros vs. funciones.

**API Utils (3 módulos):** `api/utils.js` → `api-url.js`, `api-user.js`, `api-serializers.js`. Por función.

**Menú (2 módulos):** `layout/MainLayout/menuConfig.js` → `menu-config.js` (datos), `menu-builders.js` (lógica).

**Documentación:**
- `HOOKS_DOCUMENTATION.md` — 30+ hooks con firma y ejemplos
- `COMPONENTS_REFACTOR_GUIDE.md` — 100+ componentes y patrones
- `src/hooks/README.md` — Guía de uso de hooks
- `src/components/README.md` — Estructura de componentes

**Auditoría:** Todo export tiene importador; 0 código muerto (ESLint limpio).

### Beneficios

| Antes | Después |
|---|---|
| Archivos monolito (234–450 LOC) | Módulos cohesivos (40–140 LOC) |
| Difícil encontrar una función | Estructura clara por dominio |
| Desconocimiento de hooks disponibles | `HOOKS_DOCUMENTATION.md` + `README.md` |
| Riesgo de código muerto | Auditoría periódica verificada |
| Re-exports dispersas | `index.js` centralizado |

### Documentación de referencia

- `REFACTOR_PROGRESS_FINAL.md` — Resumen completo con 13 commits
- `REFACTOR_13_AUDIT_REPORT.md` — Auditoría de código muerto
- `TEST_REFACTOR_*.md` (13 archivos) — Test por refactor

### Garantías

- ✅ 100% backward compatible (re-exports via `index.js`)
- ✅ 0 breaking changes
- ✅ 0 build errors (`npm run build` limpio)
- ✅ 0 lint errors (`npx eslint` limpio)
- ✅ Todos los imports siguen siendo válidos

### Para desarrolladores

Al agregar código nuevo:
1. Respeta la modularización: funciones puras → módulo dedicado
2. Consulta `HOOKS_DOCUMENTATION.md` antes de crear un hook
3. Sigue los patrones en `COMPONENTS_REFACTOR_GUIDE.md`
4. Verifica que no hayas roto imports con `npm run build && npx eslint src`

No hay cambios en el flujo de trabajo; solo el codebase está más limpio y modular.

### pendientes.md

Si encuentras un bug que no vas a corregir en ese momento, regístralo en `pendientes.md` con archivo:línea, qué pasa y la corrección sugerida. Al corregirlo, quítalo de ahí.
