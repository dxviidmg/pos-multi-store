# [009] Venta por fracción para productos por Kilogramo

> **Estado:** completed  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Autor:** David  

---

## Problema / Necesidad

Actualmente solo se pueden vender cantidades enteras (1, 2, 3...). Los productos que se venden por kilogramo necesitan aceptar fracciones (0.5, 1.2, 2.750, etc.). Si un producto tiene `unit: "KG"`, debe permitir decimales; si tiene `unit: "PZ"` o `"CO"`, sigue funcionando solo con enteros.

---

## Solución Propuesta

Condicionar el input de cantidad en el carrito según la unidad del producto:
- **KG** → acepta decimales (step 0.1, min 0.1)
- **PZ / CO** → solo enteros (step 1, min 1)

---

## Comportamiento Esperado

1. El usuario busca un producto que tiene `unit: "KG"` (ej: "COMIDA PERRO KILO")
2. Lo agrega al carrito
3. El input de cantidad permite escribir `1.5`, `0.250`, `2.7`, etc.
4. Las flechas ArrowUp/ArrowDown incrementan de 0.1 en 0.1
5. El subtotal se calcula correctamente: `precio × 1.5 = ...`
6. Si el producto tiene `unit: "PZ"` o `"CO"`, el comportamiento no cambia (enteros)

---

## Criterios de Aceptación

- [x] Productos con `unit: "KG"` aceptan cantidades decimales en el carrito
- [x] Productos con `unit: "PZ"` o `"CO"` solo aceptan enteros (sin cambio)
- [x] El input muestra `step="0.1"` para KG y `step="1"` para PZ/CO
- [x] ArrowUp/ArrowDown incrementa 0.1 para KG, 1 para PZ/CO
- [x] Al agregar un producto KG desde búsqueda, la cantidad inicial es 1 (el usuario la ajusta después)
- [x] El subtotal se calcula correctamente con decimales
- [x] El precio mayoreo se activa correctamente con cantidades decimales (si `quantity >= min_wholesale_quantity`)
- [x] El payload de venta envía la cantidad decimal correctamente
- [x] La validación de stock acepta decimales (ej: stock 5.0, se puede vender 4.7)

---

## Diseño de UI

- **Input cantidad (KG):** `type="number"`, `step="0.1"`, `min="0.1"`, ancho igual al actual (80px)
- **Input cantidad (PZ/CO):** Sin cambio, `type="number"`, `step="1"`, `min="1"`
- No se agrega ningún indicador visual extra — el usuario ya sabe que es por kilo por el nombre del producto

---

## Reglas de Negocio

- Solo `unit === "KG"` permite decimales. Cualquier otra unidad usa enteros.
- La cantidad mínima para KG es `0.1` (no se puede vender 0 kg)
- La cantidad mínima para PZ/CO sigue siendo `1`
- El precio mayoreo se activa con `quantity >= min_wholesale_quantity` sin importar si es decimal
- El stock puede ser decimal para productos KG (ej: quedan 3.5 kg)

---

## Permisos / Roles

Sin cambios — todos los roles que pueden vender pueden usar decimales en KG.

---

## Impacto en Código Existente

- `src/components/inventory/Cart/cartColumns.js`:
  - Modificar inputs de cantidad en `getSaleColumns`, `getTransferColumns`, `getDistributionColumns`, `getAddToStockColumns`
  - Condicionar `step`, `min` y el incremento de flechas según `row.product.unit`

- `src/components/inventory/Cart/Cart.jsx`:
  - `handleQuantityChangeToCart`: cambiar validación para aceptar decimales en KG
  - Cambiar `Number(e.target.value) <= 0` por `< minQuantity` según unidad

- `src/redux/cart/multiCartReducer.js`:
  - No debería requerir cambios (ya usa `Number()` que soporta decimales)
  - Verificar que `calculateProductPrice` funciona con decimales en `quantity`

- `src/hooks/useCartActions.js`:
  - `addToCart` sigue con `quantity: 1` — OK para ambos tipos

---

## Fuera de Alcance

- No se modifica el backend (ya soporta decimales en quantity)
- No se agrega un campo "peso" separado — se usa el mismo campo quantity
- No se cambia cómo se imprime el ticket (ya muestra quantity tal cual)
- No se modifica la lógica de reserva de stock entre carritos

---

## Checklist de Implementación

- [x] Modificar `getSaleColumns` — step/min/arrows condicional por `row.product.unit`
- [x] Modificar `getTransferColumns` — idem
- [x] Modificar `getDistributionColumns` — idem
- [x] Modificar `getAddToStockColumns` — idem
- [x] Modificar `handleQuantityChangeToCart` en Cart.jsx — aceptar decimales para KG
- [x] Verificar que el reducer maneja decimales correctamente
- [x] Verificar subtotal con decimales en PaymentModal
- [x] Probar venta de producto KG con cantidad decimal
- [x] Probar que producto PZ sigue solo aceptando enteros
