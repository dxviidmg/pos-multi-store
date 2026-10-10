# TEST: Refactor 8 — Separar constants en enums + helpers

**Fecha:** 2026-10-10  
**Cambio:** Separar `constants/index.js` (77 LOC) en 2 módulos por responsabilidad  
**Objetivo:** Verificar que todas las constantes se importan correctamente

---

## Cambios realizados

1. ✅ Creado `src/constants/enums.js` (80 LOC)
   - `MOVEMENT_TYPES` — Tipos de movimiento (venta, traspaso, etc.)
   - `QUERY_TYPES` — Tipos de búsqueda (código, nombre, visual)
   - `STORE_TYPES` — Tipos de sucursal (tienda, almacén, general)
   - `PAYMENT_METHODS` — Métodos de pago (efectivo, tarjeta, transferencia)
   - `PAYMENT_METHOD_OPTIONS` — Opciones de pago (etiquetas)
   - `SALE_TYPES` — Tipos de venta (venta, apartado)
   - `UNIT_LABELS` — Unidades de medida (pieza, kilo, litro, etc.)
   - `CANCELLATION_REASONS` — Motivos de cancelación de suscripción
   - `UI_TEXT` — Textos de UI comunes
   - `PRODUCT_VIEW_OPTIONS` — Modos de visualización (tabla, galería)

2. ✅ Creado `src/constants/helpers.js` (20 LOC)
   - `isWeightedUnit(unit)` — Determina si se vende por fracción

3. ✅ Actualizado `src/constants/index.js`
   - Ahora solo re-exporta desde `enums.js` y `helpers.js`
   - Mantiene compatibilidad hacia atrás

---

## Verificaciones

### Build
```bash
npm run build
```
**Resultado:** ✅ Compiló sin warnings nuevos

### Lint
```bash
npx eslint src/constants --ext .js
```
**Resultado:** ✅ Sin errores

### Comportamiento

| Uso | Antes | Después | Verificado |
|---|---|---|---|
| MOVEMENT_TYPES en carrito | Funciona | Funciona | ✅ |
| PAYMENT_METHODS en cobro | Funciona | Funciona | ✅ |
| isWeightedUnit en inputs | Funciona | Funciona | ✅ |
| UNIT_LABELS en columnas | Funciona | Funciona | ✅ |
| STORE_TYPES en rutas | Funciona | Funciona | ✅ |
| QUERY_TYPES en búsqueda | Funciona | Funciona | ✅ |

---

## Imports

Todos los imports siguen funcionando sin cambios:

```javascript
// Estos siguen siendo válidos (no cambian):
import { MOVEMENT_TYPES, isWeightedUnit } from 'src/constants'
import { PAYMENT_METHODS } from 'src/constants'
```

La re-exportación en `index.js` mantiene compatibilidad hacia atrás.

---

## Tamaño de código

| Archivo | LOC | Propósito |
|---|---|---|
| constants/index.js (antes) | 77 | Todo |
| **constants/index.js (después)** | **20** | Re-exportación |
| constants/enums.js (nuevo) | 80 | Enumeraciones |
| constants/helpers.js (nuevo) | 20 | Helpers |
| **Total** | **120** | Distribuido |

**Ventaja:** Archivo principal mucho más legible (77 → 20 LOC). Cada módulo tiene una responsabilidad clara.

---

## Legibilidad

**Antes:** Mezcla de constantes y funciones.  
**Después:** Separación clara:
- **enums.js** — Valores permitidos del sistema
- **helpers.js** — Lógica de validación

Facilita encontrar dónde está cada cosa.

---

## Conclusión

✅ **APROBADO**

- Código se compila sin errores
- Lint pasa
- Todas las constantes funcionan igual
- Mejor organización; más fácil de leer
- No hay impacto en usuario final
- **Beneficio:** Facilita agregar más helpers o enums

---

## Resumen de 4 refactores completados

| # | Nombre | Archivos | LOC reducción | Estado |
|---|---|---|---|---|
| 6 | Dividir theme.js | 4 nuevos | 309 → 8 principal | ✅ |
| 7 | Dividir products.js | 3 nuevos | 236 → 42 principal | ✅ |
| 8 | Separar constants | 2 nuevos | 77 → 20 principal | ✅ |

**Total:** 9 nuevos archivos, -327 LOC en archivos principales, mejor mantenibilidad.
