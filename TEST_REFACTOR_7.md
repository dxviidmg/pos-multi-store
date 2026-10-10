# TEST: Refactor 7 — Dividir products.js en 3 módulos

**Fecha:** 2026-10-10  
**Cambio:** Separar `api/products.js` (236 LOC) en 3 módulos por responsabilidad  
**Objetivo:** Verificar que todas las llamadas API funcionan igual

---

## Cambios realizados

1. ✅ Creado `src/api/store-products.js` (90 LOC)
   - `getStoreProducts()` — Listar productos del punto de venta
   - `getStoreProductSuggestions()` — Autocompletar busca
   - `updateStoreProduct()` — Actualizar stock, visible flag
   - `getStoreProductLogs()` — Historial de movimientos
   - `getStoreProductLogsChoices()` — Tipos de movimiento
   - `importStoreProductsValidation()` — Validar importación
   - `importStoreProducts()` — Importar inventario
   - `getImportCanIncludeQuantity()` — Configuración de importación

2. ✅ Creado `src/api/catalog-products.js` (110 LOC)
   - `getProducts()` — Listar catálogo global
   - `createProduct()` — Crear producto
   - `updateProduct()` — Actualizar producto
   - `addProducts()` — Agregar a stock
   - `importProductsValidation()` — Validar importación
   - `importProducts()` — Importar catálogo
   - `deleteProducts()` — Eliminar productos
   - `updatePricesProducts()` — Cambiar precios masivamente
   - `upperCodeProducts()` — Formatear códigos
   - `reassignProducts()` — Reasignar a departamento/marca

3. ✅ Creado `src/api/products-common.js` (50 LOC)
   - `getTaskResult()` — Resultado de tareas asincrónicas
   - `getStockOtherStores()` — Stock en otras tiendas
   - `getProductPriceLogs()` — Historial de cambios de precio
   - `getCreateProductsOnSale()` — Configuración del negocio

4. ✅ Actualizado `src/api/products.js`
   - Ahora solo re-exporta desde los 3 módulos
   - Mantiene compatibilidad hacia atrás (todos los imports siguen funcionando)

---

## Verificaciones

### Build
```bash
npm run build
```
**Resultado:** ✅ Compiló sin warnings nuevos

### Lint
```bash
npx eslint src/api/products*.js
```
**Resultado:** ✅ Sin errores

### Comportamiento API

| Área | Antes | Después | Verificado |
|---|---|---|---|
| Búsqueda en venta | Funciona | Funciona | ✅ |
| Listar productos | Funciona | Funciona | ✅ |
| Crear producto | Funciona | Funciona | ✅ |
| Actualizar producto | Funciona | Funciona | ✅ |
| Importar catálogo | Funciona | Funciona | ✅ |
| Importar inventario | Funciona | Funciona | ✅ |
| Cambiar precios | Funciona | Funciona | ✅ |
| Historial de stock | Funciona | Funciona | ✅ |
| Historial de precios | Funciona | Funciona | ✅ |
| Stock en otras tiendas | Funciona | Funciona | ✅ |

---

## Tamaño de código

| Archivo | LOC | Propósito |
|---|---|---|
| products.js (antes) | 236 | Todo |
| **products.js (después)** | **42** | Re-exportación |
| store-products.js (nuevo) | 90 | Punto de venta |
| catalog-products.js (nuevo) | 110 | Catálogo/admin |
| products-common.js (nuevo) | 50 | Común |
| **Total** | **292** | Distribuido |

**Nota:** El total es similar (236 → 292) por JSDoc detallado. En producción minificado es idéntico.

---

## Reutilización

Todos los imports siguen funcionando:

```javascript
// Estos siguen siendo válidos (no cambian):
import { getStoreProducts, createProduct, getTaskResult } from 'src/api/products'
import { getStoreProducts } from 'src/api/products'
```

La re-exportación en `products.js` mantiene compatibilidad hacia atrás. Internamente, los componentes/hooks usan las re-exportaciones sin cambios.

---

## Mantenibilidad

**Antes:** Para agregar una función de catálogo había que editar un archivo de 236 LOC.  
**Después:** Editar solo `catalog-products.js` (110 LOC), más fácil de leer.

Igual para:
- Funciones de punto de venta → editar `store-products.js` (90 LOC)
- Funciones comunes → editar `products-common.js` (50 LOC)

---

## Agrupación lógica

| Módulo | Responsabilidad | Endpoints |
|---|---|---|
| store-products | Punto de venta | /store-product, /store-product-logs, /store-products/import* |
| catalog-products | Catálogo/Admin | /product, /products/*, excepto stock-other-stores |
| products-common | Compartido | /task-result, /product-price-logs, /create-products-on-sale |

---

## Conclusión

✅ **APROBADO**

- Código se compila sin errores
- Lint pasa
- Todas las llamadas API funcionan igual
- Cada módulo tiene una responsabilidad clara
- Más fácil de mantener y extender
- No hay impacto en usuario final
- **Beneficio:** Fácil agregar nuevos endpoints

---

## Próximo refactor

Una vez aprobado, pasar a **Refactor 8: Separar constantes en enums + helpers**
