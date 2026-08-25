# [010] Modo de venta por pesos para productos KG

> **Estado:** draft  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Autor:** David  

---

## Problema / Necesidad

Para productos que se venden por kilogramo, el usuario a veces no sabe cuántos kilos quiere sino cuánto dinero quiere gastar. Ejemplo: "Dame $20 de queso". Actualmente solo puede escribir la cantidad en kg y calcular mentalmente.

---

## Solución Propuesta

Agregar un mini-selector (`KG | $`) junto al input de cantidad en el carrito, **solo visible para productos con `unit: "KG"`**. Al seleccionar `$`, el input cambia su comportamiento: el usuario escribe pesos y el sistema calcula automáticamente la cantidad en kg.

---

## Comportamiento Esperado

### Modo KG (default)
1. El usuario escribe `1.5` en el input
2. El subtotal se calcula: `1.5 × precio = subtotal`
3. Funciona igual que ahora

### Modo $ (pesos)
1. El usuario selecciona `$` en el mini-selector
2. Escribe `20` en el input
3. El sistema calcula: `cantidad_kg = 20 ÷ precio_unitario`
4. El subtotal es `$20`
5. El stock se descuenta por la cantidad en kg calculada

### Ejemplo concreto
- Producto: "Queso Oaxaca" — precio: $85/kg
- Usuario selecciona `$` y escribe `20`
- Cantidad calculada: `20 ÷ 85 = 0.235 kg`
- Subtotal: `$20.00`
- Stock baja: 0.235 kg

---

## Criterios de Aceptación

- [ ] El selector `KG | $` solo aparece en productos con `unit: "KG"`
- [ ] Productos PZ/CO no muestran selector (sin cambio)
- [ ] En modo `$`, el input acepta un monto en pesos
- [ ] En modo `$`, la cantidad en kg se calcula automáticamente (`monto ÷ precio`)
- [ ] En modo `$`, el subtotal mostrado es el monto ingresado
- [ ] En modo `$`, el stock se descuenta por la cantidad en kg calculada
- [ ] Al cambiar de modo `$` a `KG`, convertir el monto a kg
- [ ] El payload de venta envía la cantidad en kg (no en pesos)
- [ ] ArrowUp/ArrowDown en modo `$` incrementa de $1 en $1
- [ ] El modo por defecto al agregar es `KG`
- [ ] Aplica solo en modo Venta

---

## Diseño de UI

- **Selector:** `Select` mini, sin label, al lado izquierdo del input de cantidad
- **Opciones:** `KG` | `$`
- **Ancho selector:** ~50px
- **Solo visible:** cuando `row.product.unit === "KG"`
- **Layout celda:** `[Select 50px][Input 80px]` en un flex row

---

## Reglas de Negocio

- El cálculo de cantidad es: `cantidad_kg = monto ÷ product_price` (usa el precio que Redux ya calculó, sea unitario o mayoreo)
- El monto mínimo en modo `$` es `$1`
- La cantidad resultante puede tener muchos decimales — se envía al backend tal cual
- El precio mayoreo sigue aplicando por la cantidad calculada en kg (si `kg_calculados >= min_wholesale_quantity`)
- La validación de stock se hace contra la cantidad en kg calculada
- Aplica solo en modo Venta (no Apartado, no traspasos, no distribuciones)

---

## Permisos / Roles

Sin cambios — todos los roles que pueden vender tienen acceso al selector.

---

## Datos / API

Sin cambios en el payload. El backend recibe `quantity` en kg como siempre. El modo de venta es solo lógica de UI.

---

## Impacto en Código Existente

- `src/components/inventory/Cart/cartColumns.js`:
  - Modificar `getSaleColumns` para agregar el selector en la celda de cantidad
  - El selector necesita un estado por producto en el carrito (modo: "KG" o "$")

- `src/redux/cart/multiCartReducer.js`:
  - Agregar campo `saleMode` al item del carrito (default: "KG")
  - O manejarlo como estado local en el componente Cart

- `src/components/inventory/Cart/Cart.jsx`:
  - Adaptar `handleQuantityChangeToCart` para calcular kg cuando el modo es `$`

---

## Decisión de diseño: ¿dónde guardar el modo?

**Opción 1: En el item del carrito (Redux)**
- Persiste al cambiar de tab/carrito
- Requiere nueva acción para cambiar modo

**Opción 2: Estado local en el componente**
- Más simple
- Se pierde al cambiar de carrito

**Recomendación:** Estado local (objeto `{ [productId]: "KG" | "$" }`) porque el modo es efímero — al cobrar se resetea todo. No tiene sentido persistirlo.

---

## Fuera de Alcance

- No aplica para traspasos, distribuciones ni apartados (solo venta)
- No aplica para unidades PZ o CO
- No se cambia el ticket de impresión (ya muestra quantity y subtotal)
- No se modifica el backend

---

## Checklist de Implementación

- [ ] Agregar estado local `saleModes` en Cart.jsx (`{ [productId]: "KG" | "$" }`)
- [ ] Modificar `getSaleColumns` para recibir `saleModes` y `setSaleModes`
- [ ] Agregar mini-select en la celda de cantidad (solo para KG)
- [ ] En modo `$`: input con step=1, min=1, ArrowUp/Down de $1
- [ ] En modo `$`: calcular quantity como `monto ÷ product_price`
- [ ] Adaptar `handleQuantityChangeToCart` para el modo `$`
- [ ] Al cambiar modo de `$` a `KG`, convertir el monto actual a kg
- [ ] Verificar que el subtotal se muestra correctamente en ambos modos
- [ ] Verificar que el payload envía kg (no pesos)
- [ ] Probar venta por pesos y confirmar stock correcto
