# [004] Arquitectura de API y Fetching

> **Estado:** completed  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Archivos:**  
> - `src/api/httpClient.js`  
> - `src/api/apiFactory.js`  
> - `src/api/utils.js`  
> - `src/hooks/useFetch.js`  
> - `src/hooks/useCrudMutation.js`  

---

## Problema / Necesidad

El frontend necesita comunicarse con una API REST de forma consistente, con autenticación automática, manejo de errores centralizado, y patrones reutilizables para operaciones CRUD que reduzcan el código repetitivo.

---

## Solución Propuesta

Capas de abstracción:
1. **httpClient** — Axios con interceptores para auth y errores
2. **apiFactory** — Genera operaciones CRUD estándar para cualquier recurso
3. **useFetch** — Hook casero para datos de lectura (con reintentos y timeout)
4. **useCrudMutation** — Hook sobre React Query para mutaciones con invalidación de caché

---

## Componentes de la Arquitectura

### 1. httpClient (Axios)

Cliente HTTP centralizado con:
- **Request interceptor:** Agrega `Authorization: Token xxx` y header `store-id` (solo si es numérico)
- **Response interceptor:** 
  - Log de todas las peticiones
  - Si recibe 401 → limpia localStorage y redirige a `/login`
- **Timeout:** 60 segundos

### 2. API Utils

```javascript
getApiUrl(endpoint)        → `${REACT_APP_API_URL}/api/${endpoint}/`
getPrinterUrl(endpoint)    → `${REACT_APP_PRINTER_URL}/${endpoint}/`
buildUrlWithParams(url, p) → URL con query params (ignora null/undefined)
getUserData()              → User de localStorage (con caché en memoria)
```

### 3. apiFactory (`createApiService`)

Genera un objeto con métodos CRUD para cualquier recurso:

```javascript
const clientApi = createApiService('client');
// Genera: clientApi.getAll(params), .getById(id), .create(data), .update(data), .delete(id), .deleteMany(data)
```

- `getAll` acepta params opcionales que se convierten en query string
- `update` espera `data.id` para construir la URL
- `deleteMany` usa endpoint custom o `{resource}/delete` por defecto

### 4. useFetch (Hook casero)

Para consultas de lectura con ejecución automática:

```javascript
const { data, loading, error, refetch } = useFetch(fetchFn, {
  deps: [],           // Dependencias para re-ejecutar
  initialData: null,  // Valor inicial
  maxRetries: 0,      // Reintentos (0 = sin reintentos)
  timeout: 3000,      // Timeout en ms
  enabled: true,      // Ejecutar automáticamente
});
```

**Variantes:**
- `useFetchList` — Alias con `initialData: []`
- `useFetchWithRetry` — Alias con `maxRetries: 2`, `enabled: false`

**Lógica de reintentos:**
- Si falla por timeout (AbortError/CanceledError) y quedan reintentos → espera 1s y reintenta
- Si falla por otro error o se agotan reintentos → guarda error y retorna initialData

### 5. useCrudMutation (React Query)

Para mutaciones (crear, editar, eliminar):

```javascript
const mutation = useCrudMutation(api.create, {
  queryKey: 'clients',              // Invalida esta query al éxito
  successMessage: 'Cliente creado', // showSuccess automático
  errorMessage: 'Error al crear',  // showError automático
  onSuccess: (data) => {},          // Callback adicional
  errorParser: (error) => {},       // Parser custom de errores
});
```

**Factory de mutaciones:**
```javascript
const { useCreate, useUpdate, useDelete } = createMutationHooks('Cliente', 'clients', clientApi);
```

---

## Criterios de Aceptación

- [x] Todas las peticiones incluyen token de autenticación automáticamente
- [x] El header `store-id` se envía solo cuando tiene valor numérico
- [x] Un 401 redirige a login y limpia sesión
- [x] `apiFactory` genera CRUD completo para cualquier recurso
- [x] `useFetch` soporta reintentos con timeout configurable
- [x] `useCrudMutation` invalida queries y muestra alertas automáticamente
- [x] `createMutationHooks` reduce boilerplate para recursos estándar

---

## Patrones de Uso

### Recurso simple (CRUD completo)

```javascript
// api/clients.js
import { createApiService } from './apiFactory';
export const clientApi = createApiService('client');

// hooks/useClientMutations.js
import { createMutationHooks } from './useCrudMutation';
import { clientApi } from '../api/clients';
export const { useCreate, useUpdate, useDelete } = createMutationHooks('Cliente', 'clients', clientApi);

// Componente
const { data: clients, loading } = useFetch(clientApi.getAll);
const createMutation = useCreate({ onSuccess: () => closeModal() });
```

### Recurso con queries personalizadas

```javascript
// api/sales.js — Endpoints manuales para lógica compleja
export const createSale = (data) => httpClient.post(getApiUrl('sale'), data);
export const getSale = (id) => httpClient.get(getApiUrl(`sale/${id}`));
```

---

## Reglas de Negocio

- El `store-id` header NO se envía como string vacío — solo como número o no se envía
- El caché de `getUserData()` evita parsear localStorage en cada petición
- Los reintentos solo aplican a errores de timeout, no a errores de servidor (4xx, 5xx)
- `buildUrlWithParams` ignora valores `null` y `undefined` silenciosamente

---

## Notas Técnicas

- **Coexistencia de sistemas:** El proyecto usa AMBOS `useFetch` (hook casero) y `useQuery` (React Query). La auditoría (`AUDIT.md`) recomienda migrar todo a React Query.
- El `useFetch` no tiene deduplicación ni caché — cada componente que lo usa hace su propia petición
- React Query se usa principalmente para mutaciones (`useCrudMutation`) y algunas queries nuevas
- El objetivo a largo plazo es eliminar `useFetch` completamente
