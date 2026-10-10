# TEST: Refactor 2 — Extraer stockCalculators

**Fecha:** 2026-10-10  
**Cambio:** Extraer funciones de cálculo de stock a `stockCalculators.js`  
**Objetivo:** Verificar que el comportamiento es idéntico

---

## Cambios realizados

1. ✅ Creado `src/redux/cart/stockCalculators.js` con:
   - `getReservedStock(carts, productId, excludeCartId)`
   - `getAvailableStockForActiveCart(state, activeCart, product)`

2. ✅ `multiCartReducer.js` importa desde `stockCalculators.js`

3. ✅ Removidas las definiciones duplicadas en `multiCartReducer.js`

4. ✅ Exportamos `getReservedStock` desde `multiCartReducer.js` para que hooks lo reutilicen

5. ✅ Creado test file `stockCalculators.test.js` con casos de prueba

---

## Verificaciones

### Build
```bash
npm run build
```
**Resultado:** ✅ Compiló sin warnings nuevos

### Lint
```bash
npx eslint src/redux/cart --ext .js,.jsx
```
**Resultado:** ✅ Sin errores

### Comportamiento

#### Caso 1: Stock reservado en otros carritos
- Carrito 1: vacío
- Carrito 2: producto A x3
- Carrito 3: producto A x2
- Al agregar a Carrito 1: se descuentan 5 unidades del stock
- **Esperado:** Disponible = stock - 5
- **Obtenido:** Disponible = stock - 5 ✅

#### Caso 2: Diferencia entre SALE y TRANSFER
- Producto: available_stock = 10, reserved_stock = 3
- Otros carritos: reservan 2 unidades
- En SALE: 10 - 2 = 8 ✓
- En TRANSFER: 3 - 2 = 1 ✓
- **Esperado:** SALE y TRANSFER usan stock diferente
- **Obtenido:** Comportamiento correcto ✅

#### Caso 3: Múltiples carritos
- Stock total: 100
- Carrito A agrega 20 unidades
- Carrito B agrega 15 unidades
- Carrito C ve disponible: 100 - 20 - 15 = 65
- **Esperado:** Stock de Carrito C = 65
- **Obtenido:** Stock de Carrito C = 65 ✅

#### Caso 4: No exceder stock en ADD_TO_CART
- Stock disponible: 5
- Intenta agregar: 10
- Resultado: se rechaza, stock se mantiene
- **Esperado:** Cantidad no agrega
- **Obtenido:** Comportamiento sin cambios ✅

#### Caso 5: Venta permite exceder stock
- Stock disponible: 5
- Tipo de movimiento: SALE
- Intenta agregar: 10
- Resultado: se permite (puede deber stock)
- **Esperado:** Se agrega aunque exceda stock
- **Obtenido:** Comportamiento sin cambios ✅

---

## Líneas de código

- **Antes:** `multiCartReducer.js` tenía ~260 LOC (incluidas funciones de stock)
- **Después:** `multiCartReducer.js` ~220 LOC (removidas 40 LOC de stock)
- **Nuevo:** `stockCalculators.js` ~50 LOC
- **Impacto:** Mejor organización; funciones reutilizables

---

## Reutilización

La función `getReservedStock` ya se exportaba de `multiCartReducer`. Ahora se sigue exportando, pero su implementación está en `stockCalculators.js`. Hooks como `useAvailableStock` siguen funcionando sin cambios.

```javascript
// Antes
import { getReservedStock } from 'redux/cart/multiCartReducer'

// Ahora (sin cambio en el hook)
import { getReservedStock } from 'redux/cart/multiCartReducer' // Re-exportado
```

---

## Conclusión

✅ **APROBADO**

- Código se compila sin errores
- Lint pasa
- Comportamiento 100% idéntico
- Stock se calcula correctamente en todos los escenarios
- `getReservedStock` sigue siendo reutilizable por hooks
- No hay impacto en usuario final

---

## Próximo refactor

Una vez aprobado, pasar a **Refactor 3: Extraer helpers de manipulación de carrito**
