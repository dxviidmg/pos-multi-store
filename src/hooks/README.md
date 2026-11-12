# Hooks — Smart Reusable Logic

## Estructura

```
src/hooks/
├── README.md (este archivo)
├── useBrands.js
├── useCartActions.js
├── useCardFormModal.js
├── useCanCreateStore.js
├── useClients.js
├── useCodeNameSearch.js
├── useConversions.js
├── useCrudMutation.js
├── useDebouncedSearch.js
├── useDepartments.js
├── useDiscounts.js
├── useFetch.js
├── useFetchWithRetry.js
├── useForm.js
├── useImportFlow.js
├── useKeyboardShortcuts.js
├── useMercadoPago.js
├── useModal.js
├── useOnlineStatus.js
├── useProductSearch.js
├── useProductSuggestions.js
├── useRegistration.js
├── useScrollPreservingUpsert.js
├── useSaleMutations.js
├── useSwitchStore.js
├── useTaskPolling.js
├── useThemeMode.js
├── useTenantInfo.js
├── useTransfers.js
├── useUserManagement.js
├── useViewModePreference.js
└── useStores.js
```

## Categorías

### 🔄 Data Fetching & Queries

- `useBrands()` — Listar marcas
- `useClients()` — Listar clientes
- `useDepartments()` — Listar departamentos
- `useDiscounts()` — Listar descuentos
- `useFetch()` — Fetch simple con timeout
- `useFetchWithRetry()` — Fetch con reintentos
- `useTenantInfo()` — Información del negocio
- `useStores()` — Listar sucursales

**Patrón:** `createQueryHook()` para cachear con React Query

---

### 🛒 Cart & Inventory

- `useCartActions()` — Acciones sobre el carrito
- `useAvailableStock()` — Stock disponible (descuenta otros carritos)
- `useScrollPreservingUpsert()` — Actualizar fila sin perder scroll

**Patrón:** Integran con Redux (multiCartReducer) + lógica de stock

---

### 🔍 Search & Autocomplete

- `useProductSearch()` — Búsqueda de productos por código
- `useProductSuggestions()` — Autocompletar de productos
- `useDebouncedSearch()` — Búsqueda genérica con debounce
- `useCodeNameSearch()` — Filtro rápido código/nombre

**Patrón:** Debouncing, abort controller, React Query

---

### 📝 Forms & Modals

- `useForm()` — Estado de formulario + validación
- `useModal()` — Abrir/cerrar modal + datos
- `useUserManagement()` — Editar usuario / cambiar contraseña

**Patrón:** useState para estado local, callbacks para submit

---

### 💳 Integrations

- `useCardFormModal()` — Modal de tarjeta Mercado Pago
- `useMercadoPago()` — SDK de Mercado Pago
- `useRegistration()` — Flujo de registro

**Patrón:** Wrappers sobre SDKs externos

---

### ⌨️ UI & Keyboard

- `useCtrlShortcut()` — Atajo Ctrl+tecla con handler en ref
- `useKeyboardShortcuts()` — Múltiples atajos de teclado
- `useThemeMode()` — Cambiar tema claro/oscuro
- `useViewModePreference()` — Preferencia tabla/galería persistida

**Patrón:** localStorage, event listeners con cleanup

---

### 🔄 Mutations & Side Effects

- `useCrudMutation()` — Factory de mutaciones CRUD
- `useCatalogMutations()` — Mutaciones de catálogo
- `useClientMutations()` — Mutaciones de clientes
- `useSaleMutations()` — Mutaciones de ventas

**Patrón:** Wrapper sobre React Query `useMutation` + mensajes automáticos

---

### 🌐 Real-time & Async

- `usePrinterStatus()` — Estado de impresora con WebSocket
- `useTaskPolling()` — Polling de tareas Celery (auditorías, dashboards)
- `useOnlineStatus()` — Detectar conexión de red
- `useTransfers()` — Transacciones en tiempo real

**Patrón:** WebSocket / polling con reconexión automática

---

### 🏪 Store & User Management

- `useSwitchStore()` — Cambiar de sucursal
- `useCanCreateStore()` — ¿Puedo crear una sucursal?

**Patrón:** UserContext + Redux + localStorage

---

### 📂 Import Workflows

- `useImportFlow()` — Orquestación: archivo → validar → importar

**Patrón:** State machine con loading, errores, éxito

---

## Patrones comunes

### 1. Query Hooks (Lectura cacheada)

```javascript
// Patrón: createQueryHook
const useProductos = createQueryHook('productos', getProducts);

// Uso:
const { data, loading, error } = useProductos();
```

### 2. Mutation Hooks (Escritura con invalidación)

```javascript
// Patrón: useCrudMutation
const { mutate, loading } = useCrudMutation(createProduct, options);
mutate(data); // Muestra mensaje automático
```

### 3. Debounced Search

```javascript
// Patrón: useDebouncedSearch
const { query, results, loading } = useDebouncedSearch(
  searchTerm,
  searchFn,
  { delay: 300, minChars: 3 }
);
```

### 4. WebSocket / Polling

```javascript
// Patrón: reconexión con backoff
useEffect(() => {
  const ws = new WebSocket(url);
  ws.onopen = () => setConnected(true);
  ws.onerror = () => attemptReconnect();
  return () => ws.close();
}, []);
```

### 5. Keyboard Shortcuts

```javascript
// Patrón: handler en ref para evitar stale closures
const handlerRef = useRef(null);
handlerRef.current = () => { /* lógica */ };

useEffect(() => {
  const listener = (e) => {
    if (e.ctrlKey && e.key === 'k') handlerRef.current?.();
  };
  window.addEventListener('keydown', listener);
  return () => window.removeEventListener('keydown', listener);
}, []);
```

---

## Checklist para hooks nuevos

- [ ] JSDoc con `@param`, `@returns`, `@example`
- [ ] Nombres empiezan con `use` (convención React)
- [ ] Manejo de cleanup (useEffect return)
- [ ] Ref para handlers si necesitas evitar re-suscripciones
- [ ] Guard contra componentes unmounted
- [ ] Tests unitarios (si es lógica pura)

---

## Cuando NO crear un hook

- Si es una simple envoltura sobre `useState` en un componente → Usa `useState` directo
- Si la lógica solo se usa en un componente → Hazla local en el componente
- Si es una constante o helper → Usa `src/utils/` en su lugar

---

## Recursos

- [Hooks Documentation](../../HOOKS_DOCUMENTATION.md) — Guía de los 10 principales
- [React Hooks best practices](https://react.dev/reference/react/hooks)
- [ESLint rules for hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)

---

**Última actualización:** 2026-10-10  
**Total de hooks:** 30+
