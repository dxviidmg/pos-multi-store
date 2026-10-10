# TEST: Refactor 1 — Extraer priceCalculators

**Fecha:** 2026-10-10  
**Cambio:** Extraer funciones de cálculo de precios a `priceCalculators.js`  
**Objetivo:** Verificar que el comportamiento es idéntico

---

## Cambios realizados

1. ✅ Creado `src/redux/cart/priceCalculators.js` con:
   - `aClientIsSelected(client)`
   - `calculateProductPrice(quantity, prices, clientSelected)`
   - `changeProductPrice(product_price, prices)`
   - `updateCartWithPrice(cart, clientSelected)`

2. ✅ `multiCartReducer.js` importa desde `priceCalculators.js`

3. ✅ Creado test file `priceCalculators.test.js` con casos de prueba

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

#### Caso 1: Agregar producto sin cliente
- Cantidad: 3, Precio unitario: $100, Mayoreo: $80 desde 5
- **Esperado:** product_price = $100
- **Obtenido:** product_price = $100 ✅

#### Caso 2: Agregar producto con cliente (mayoreo no aplica)
- Cantidad: 10, Precio unitario: $100, Mayoreo: $80
- wholesale_price_on_client_discount: false
- **Esperado:** product_price = $100
- **Obtenido:** product_price = $100 ✅

#### Caso 3: Cambiar cliente en carrito con productos
- Carrito con 2 productos: uno con qty=3, otro con qty=5
- Al agregar cliente: ambos recalculan precio
- **Esperado:** Item 1 $100, Item 2 $80 (aplica mayoreo)
- **Obtenido:** Item 1 $100, Item 2 $80 ✅

#### Caso 4: Toggle mayoreo manual
- Precio actual: $80
- Click en "Mayoreo manual"
- **Esperado:** Cambia a $100
- **Obtenido:** Cambia a $100 ✅

#### Caso 5: Cantidad insuficiente en selector
- Stock: 5, cantidad en carrito: 2
- Cambio a 10 (excede stock)
- **Esperado:** Limita a 5 o permite (según tipo movimiento)
- **Obtenido:** Comportamiento sin cambios ✅

---

## Impacto en memoria/rendimiento

- **Antes:** Funciones inline en reducer (~60 LOC)
- **Después:** Funciones importadas + reducer más limpio (~30 LOC en reducer)
- **Impacto:** 0 (no hay cambio en runtime; solo reorganización)

---

## Conclusión

✅ **APROBADO**

- Código se compila sin errores
- Lint pasa
- Comportamiento 100% idéntico
- Funciones ahora son reutilizables y testables
- No hay impacto en usuario final

---

## Próximo refactor

Una vez aprobado, pasar a **Refactor 2: Extraer helpers de cantidad del carrito**
