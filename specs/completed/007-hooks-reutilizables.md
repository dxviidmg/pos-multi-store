# [007] Hooks Reutilizables del Sistema

> **Estado:** completed  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Directorio:** `src/hooks/`  

---

## Problema / Necesidad

Se necesitan patrones reutilizables para operaciones comunes: abrir/cerrar modales, consultar datos, realizar mutaciones, manejar atajos de teclado, verificar estado de impresora, y gestionar formularios.

---

## Hooks Disponibles

### useModal

Control de apertura/cierre de modales con datos opcionales.

```javascript
const { isOpen, data, open, close } = useModal(initialData);

// Abrir con datos
open(selectedItem);

// Cerrar (resetea data a null)
close();
```

**Uso:** Todos los modales del sistema usan este hook.

---

### useFetch / useFetchList / useFetchWithRetry

Consultas de lectura con ejecución automática (ver spec 004 para detalle completo).

```javascript
const { data, loading, error, refetch } = useFetch(fetchFn, { deps, initialData, maxRetries, timeout, enabled });
```

---

### useCrudMutation / createMutationHooks

Mutaciones con React Query (ver spec 004 para detalle completo).

---

### useCartActions

Lógica de agregar al carrito con validación de stock cruzada entre carritos (ver spec 002).

```javascript
const { handleAddToCartIfAvailable } = useCartActions(getAvailableStock, movementType, keepListOpen, setData, setQuery);
```

---

### usePrinterStatus

Verifica si la impresora térmica está conectada.

```javascript
const { connected, error } = usePrinterStatus(printerUrl, { triggerDep });
```

- Hace ping a la impresora cuando cambia `triggerDep`
- Retorna `connected: true/false` y `error: string|null`
- Se usa en PaymentModal para mostrar chip de estado

---

### useKeyboardShortcuts

Registra atajos de teclado globales para el POS.

Atajos registrados:
- Ctrl+Q/W → Buscar producto
- Ctrl+E/R/T/Y/U/I → Cambiar tipo de movimiento
- Ctrl+B → Enfocar campo de búsqueda
- Ctrl+J → Seleccionar cliente

---

### useProductSearch

Búsqueda de productos con debounce y soporte para código de barras y nombre.

```javascript
const { data, query, setQuery, loading, ... } = useProductSearch(options);
```

---

### useForm

Manejo de estado de formulario con onChange genérico.

```javascript
const { formData, handleChange, resetForm, setFormData } = useForm(initialState);
```

- `handleChange` extrae `name` y `value` del evento automáticamente
- `resetForm` vuelve al estado inicial

---

### useThemeMode

Toggle entre modo claro y oscuro con persistencia en localStorage.

```javascript
const { themeMode, toggleTheme } = useThemeMode();
```

---

### useCanCreateStore

Verifica si el tenant puede crear más tiendas según su plan.

```javascript
const { canCreate, loading } = useCanCreateStore();
```

---

### useConversions

Consulta y gestión de conversiones de producto (desempaque).

---

### useTaskPolling

Polling de tareas asíncronas (Celery) con intervalo configurable.

```javascript
const { taskResult, isPolling, startPolling } = useTaskPolling(taskId, { interval: 7500 });
```

---

### useStores

Consulta la lista de tiendas del tenant.

---

### useProducts / useBrands / useDepartments / useClients / useSellers / useSales / useDiscounts

Hooks de consulta para cada recurso, wrapping `useFetch` o `useQuery`.

---

### useTenantInfo

Información del tenant actual.

---

### useTransfers

Consulta y acciones sobre traspasos.

---

### useAvailableStock

Calcula stock disponible considerando reservas.

---

### useMercadoPago

Integración con Mercado Pago para pagos de suscripción.

---

### useRegistration

Lógica del flujo de registro multi-paso.

---

### useInvestment

Cálculos de inversión y rentabilidad.

---

### Hooks de Mutación por Recurso

| Hook | Recurso | Operaciones |
|------|---------|-------------|
| `useProductMutations` | Productos | create, update, delete |
| `useBrandMutations` | Marcas | create, update, delete |
| `useDepartmentMutations` | Departamentos | create, update, delete |
| `useClientMutations` | Clientes | create, update, delete |
| `useSaleMutations` | Ventas | cancel, return |
| `useUserManagement` | Usuarios | create, update, delete |

---

## Reglas de Diseño

- Cada hook tiene una sola responsabilidad
- Los hooks de fetch retornan `{ data, loading, error, refetch }`
- Los hooks de mutación retornan el objeto mutation de React Query
- Los hooks UI retornan `{ isOpen, data, open, close }` o similar
- Los hooks no deben hacer renders condicionales internos
- Memoizar con `useCallback` las funciones que se pasan como props
