# Hooks Documentation — SmartVenta

> **Fecha:** 2026-10-10  
> **Estado:** Documentación de referencia (sin cambios de código)

---

## Propósito de este documento

Guía rápida de los **10 hooks principales** del proyecto. Cada uno tiene una responsabilidad clara documentada en el código.

---

## Top 10 Hooks (por tamaño / importancia)

### 1. `usePrinterStatus.js` (6.3 KB)

**Responsabilidad:** Gestión de estado de la impresora con reconexión automática.

**Qué exporta:**
- `usePrinterStatus()` — Hook para conectar/desconectar de la impresora

**Patrón:** WebSocket con reconexión, heartbeat, fallback a polling HTTP

**Usado en:** `components/sales/shared/PaymentSubmitPanel.jsx`

---

### 2. `useImportFlow.js` (4.6 KB)

**Responsabilidad:** Orquestación de flujo de importación (archivo → validar → importar).

**Qué exporta:**
- `useImportFlow({ initialForm, validate, importFile, ... })` — Hook reutilizable para importaciones

**Patrón:** State machine; gestiona loading, errores, éxito

**Usado en:** `components/products/ProductList/`, `components/sales/SaleImport/`, etc.

---

### 3. `useCartActions.js` (3.6 KB)

**Responsabilidad:** Acciones sobre el carrito (agregar, quitar, cambiar cantidad).

**Qué exporta:**
- `useCartActions()` — Funciones para manipular carrito con validaciones

**Patrón:** Wrapper sobre Redux actions con lógica de negocio (mayoreo, stock, etc.)

**Usado en:** `components/sales/SaleCreate/`, `components/inventory/Cart/`

---

### 4. `useProductSearch.js` (3.6 KB)

**Responsabilidad:** Búsqueda de productos por código con autocompletar.

**Qué exporta:**
- `useProductSearch()` — Hook con estado de búsqueda, loading, sugerencias

**Patrón:** Debouncing, abort controller para cancelar requests viejas

**Usado en:** `components/sales/SaleCreate/SearchProduct.jsx`

---

### 5. `useCrudMutation.js` (3.4 KB)

**Responsabilidad:** Factory para crear hooks de mutación (POST/PATCH/DELETE) reutilizables.

**Qué exporta:**
- `useCrudMutation(mutationFn, options)` — Hook que retorna `mutate` con mensajes automáticos

**Patrón:** Wrapper sobre `useMutation` de React Query con invalidación de queries

**Usado en:** La mayoría de formularios (crear, editar, eliminar)

---

### 6. `useUserManagement.js` (3.3 KB)

**Responsabilidad:** Gestión de usuarios (editar, cambiar contraseña).

**Qué exporta:**
- `useUserManagement()` — Hook con modal y state para editar usuario

**Patrón:** Manejo de modales con `useModal`, mutaciones con `useCrudMutation`

**Usado en:** `components/admin/AdminList.jsx`, perfil de usuario

---

### 7. `useProductSuggestions.js` (3.0 KB)

**Responsabilidad:** Autocompletar de productos en búsqueda.

**Qué exporta:**
- `useProductSuggestions(query)` — Hook que retorna sugerencias con loading

**Patrón:** Debouncing con abort controller, limite de resultados

**Usado en:** `components/sales/SaleCreate/SearchProduct.jsx`

---

### 8. `useCrudMutation.js` (ya documentado)

Sí, es grande porque es una factory. Se reutiliza en muchos lugares.

---

### 9. `useFetch.js` (2.9 KB)

**Responsabilidad:** Fetch simple con retry y timeout.

**Qué exporta:**
- `useFetch(url, options)` — Hook para lecturas simples sin caching

**Patrón:** Guard contra respuestas viejas, timeout configurable

**Usado en:** Búsquedas de productos por código, tareas puntuales

---

### 10. `useSwitchStore.js` (2.8 KB)

**Responsabilidad:** Cambio de sucursal (actualiza usuario, limpia estado, navega).

**Qué exporta:**
- `useSwitchStore()` — Hook que retorna `switchStore(store)` y `backToGeneral()`

**Patrón:** Actualiza contexto, Redux, localStorage, React Query; emite evento `store-changed`

**Usado en:** `components/layout/MainLayout/StoreSelector.jsx`

---

## Patrones comunes

### 1. **Debouncing** (búsqueda, autocompletar)
```javascript
// useDebouncedSearch.js, useProductSearch.js
delay: 300-500ms para evitar requests frecuentes
```

### 2. **Abort Controller** (cancelación)
```javascript
// useProductSearch.js, useProductSuggestions.js
Cancela requests viejas cuando el usuario sigue escribiendo
```

### 3. **React Query** (caching)
```javascript
// useCrudMutation.js
Invalidar queries después de mutación
```

### 4. **Redux** (estado global)
```javascript
// useCartActions.js
Dispatch actions al carrito global
```

### 5. **WebSocket** (tiempo real)
```javascript
// usePrinterStatus.js
Reconexión con backoff exponencial
```

---

## Hooks sin JSDoc completo (oportunidad de mejora)

Estos hooks son pequeños pero podrían tener mejor documentación:

- `useModal.js` (1.2 KB)
- `useForm.js` (1.2 KB)
- `useOnlineStatus.js` (1.1 KB)
- `useViewModePreference.js` (1.2 KB)
- `useCodeNameSearch.js` (1.3 KB)
- `useCtrlShortcut.js` (1.3 KB)
- `useThemeMode.js` — Preferencia de tema
- `useKeyboardShortcuts.js` (2.2 KB)

---

## Cómo usar esta documentación

1. **Necesito saber qué hace un hook** → Busca su nombre en esta lista
2. **Necesito crear un hook nuevo** → Copia el patrón de uno similar
3. **Necesito entender dónde se usa** → Mira "Usado en:"

---

## Próximos pasos

Para mejorar aún más:
- [ ] Agregar ejemplos de uso a cada hook
- [ ] Crear tests unitarios para hooks puros
- [ ] Consolidar hooks duplicados si los hay
- [ ] Deprecar hooks no usados

---

**Última actualización:** 2026-10-10  
**Total de hooks:** 30+  
**Documentados en esta guía:** 10 principales
