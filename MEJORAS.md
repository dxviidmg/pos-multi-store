# Mejoras Frontend — SmartVenta

> Generado: 7 de mayo de 2026
> Regla: No cambiar lógica, solo organización, performance y mantenibilidad.

---

## 🔴 Alta Prioridad

### 1. Selectores memoizados con Reselect

**Problema:** El mismo selector de Redux se repite en 5+ componentes (Cart, PaymentModal, SearchProduct, MultiCart, useCartActions), creando nuevas referencias en cada render.

**Archivos afectados:**
- `src/components/inventory/Cart/Cart.jsx`
- `src/components/sales/PaymentModal/PaymentModal.jsx`
- `src/components/products/SearchProduct/SearchProduct.jsx`
- `src/components/inventory/Cart/MultiCart.jsx`
- `src/hooks/useCartActions.js`

**Solución:** Crear `src/redux/cart/selectors.js` con selectores memoizados usando `reselect` (ya instalado).

**Estado:** ⬜ Pendiente

---

### 2. Eliminar hooks duplicados (useBrands.js vs useQueries.js)

**Problema:** Existen ~10 hooks individuales (`useBrands.js`, `useSellers.js`, `useClients.js`, etc.) que usan `useFetch`, Y también están definidos en `useQueries.js` con React Query. Dos formas de hacer lo mismo.

**Archivos a eliminar:**
- `src/hooks/useBrands.js`
- `src/hooks/useSellers.js`
- `src/hooks/useClients.js`
- `src/hooks/useDepartments.js`
- `src/hooks/useProducts.js`
- `src/hooks/useSales.js`
- `src/hooks/useStores.js`
- `src/hooks/useTenantInfo.js`
- `src/hooks/useDiscounts.js`

**Solución:** Usar solo los de `useQueries.js` y actualizar imports.

**Estado:** ⬜ Pendiente

---

### 3. Función `getAvailableStock` duplicada

**Problema:** Definida idéntica en `Cart.jsx` y `SearchProduct.jsx`.

**Solución:** Unificar en `src/hooks/useAvailableStock.js` (ya existe el archivo).

**Estado:** ⬜ Pendiente

---

## 🟡 Media Prioridad

### 4. Componentes gigantes — extraer columnas/lógica

**Problema:** `StoreList.jsx` (35KB/~900 líneas), `PaymentModal.jsx` (18KB), `SearchProduct.jsx` (15KB) tienen todo junto.

**Solución:** Extraer definiciones de columnas y lógica auxiliar a archivos separados dentro del mismo directorio.

**Estado:** ⬜ Pendiente

---

### 5. Fix `useFetch` — referencia inestable de `initialData`

**Problema:** Si `initialData` es un literal (`[]` o `{}`), se crea nueva referencia cada render, causando que `fetchData` se re-cree por estar en el dependency array del `useCallback`.

**Archivo:** `src/hooks/useFetch.js`

**Solución:** Usar `useRef` para `initialData`.

**Estado:** ⬜ Pendiente

---

### 6. Cachear `getUserData()`

**Problema:** `getUserData()` parsea JSON de localStorage en cada llamada. Se llama múltiples veces por render en componentes hot (SearchProduct, Cart, PaymentModal).

**Archivo:** `src/api/utils.js`

**Solución:** Cache en variable de módulo, invalidar en login/logout/store-change.

**Estado:** ⬜ Pendiente

---

### 7. Error Boundary

**Problema:** Si un componente lazy falla en runtime, la app entera se rompe sin feedback al usuario.

**Solución:** Crear `src/components/ui/ErrorBoundary.jsx` y envolver las rutas lazy.

**Estado:** ⬜ Pendiente

---

### 8. Simplificar inicialización de auth en App.js

**Problema:** `useEffect` innecesario con eslint-disable para setear `isLoggedIn`.

**Archivo:** `src/App.js`

**Solución:** `const [isLoggedIn, setIsLoggedIn] = useState(!!getUserData());`

**Estado:** ⬜ Pendiente

---

### 9. Eliminar `getHeaders()` duplicado

**Problema:** `httpClient.js` ya inyecta headers via interceptor. `api/utils.js` exporta `getHeaders()` que hace lo mismo.

**Archivo:** `src/api/utils.js`

**Solución:** Eliminar `getHeaders()` si no se usa fuera de httpClient.

**Estado:** ⬜ Pendiente

---

## 🟢 Baja Prioridad

### 10. Typos en nombres de funciones

**Problema:** `updateTranfer`, `deleteTranfer` en `src/api/transfers.js`.

**Solución:** Renombrar a `updateTransfer` / `deleteTransfer` y actualizar imports.

**Estado:** ⬜ Pendiente

---

### 11. Migrar CSS restantes a sx/styled

**Problema:** Mezcla de archivos CSS (`App.css`, `Login.css`, `Spinner.css`, `Modal.css`, `DataTable.css`) con CSS-in-JS (sx props, styled).

**Solución:** Migrar a `sx` o `styled` para consistencia y soporte de dark/light mode.

**Estado:** ⬜ Pendiente

---

### 12. Imports directos de MUI

**Problema:** Imports barrel (`from "@mui/material"`) pueden afectar bundle size con CRA.

**Solución:** Usar imports directos (`from "@mui/material/Grid"`) en componentes pesados, o configurar `babel-plugin-import`.

**Estado:** ⬜ Pendiente

---

### 13. Fijar versiones de dependencias

**Problema:** Todas las dependencias usan `^` (rangos abiertos).

**Solución:** Fijar versiones exactas para dependencias críticas (MUI, React Query, Redux).

**Estado:** ⬜ Pendiente

---

## Progreso

| # | Mejora | Prioridad | Estado |
|---|--------|-----------|--------|
| 1 | Selectores memoizados | 🔴 Alta | ⬜ |
| 2 | Eliminar hooks duplicados | 🔴 Alta | ⬜ |
| 3 | getAvailableStock unificado | 🔴 Alta | ⬜ |
| 4 | Extraer columnas/lógica | 🟡 Media | ⬜ |
| 5 | Fix useFetch initialData | 🟡 Media | ⬜ |
| 6 | Cachear getUserData | 🟡 Media | ⬜ |
| 7 | Error Boundary | 🟡 Media | ⬜ |
| 8 | Simplificar auth App.js | 🟡 Media | ⬜ |
| 9 | Eliminar getHeaders duplicado | 🟡 Media | ⬜ |
| 10 | Typos en funciones | 🟢 Baja | ⬜ |
| 11 | Migrar CSS a sx/styled | 🟢 Baja | ⬜ |
| 12 | Imports directos MUI | 🟢 Baja | ⬜ |
| 13 | Fijar versiones | 🟢 Baja | ⬜ |
