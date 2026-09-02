# [002] Sistema Multi-Carrito (Redux)

> **Estado:** completed  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Archivos:**  
> - `src/redux/cart/multiCartReducer.js`  
> - `src/redux/cart/cartActions.js`  
> - `src/hooks/useCartActions.js`  

---

## Problema / Necesidad

En un punto de venta, el cajero frecuentemente atiende a varios clientes simultáneamente: uno paga mientras otro busca productos. Se necesita poder mantener múltiples carritos abiertos sin perder la información de ninguno, con validación de stock cruzada entre ellos.

---

## Solución Propuesta

Sistema de múltiples carritos en Redux donde cada carrito es independiente (productos, cliente, tipo de movimiento). El usuario puede crear, cambiar y cerrar carritos. El stock reservado en un carrito se descuenta de la disponibilidad en los demás.

---

## Comportamiento Esperado

1. Al iniciar, existe un carrito por defecto (ID=1)
2. El usuario puede crear un nuevo carrito (acción `CREATE_NEW_CART`)
3. El sistema cambia automáticamente al carrito recién creado
4. El usuario puede alternar entre carritos (acción `SWITCH_CART`)
5. Cada carrito tiene su propio tipo de movimiento: Venta, Traspaso, Distribución, Apartado, Agregar Stock, Checar Stock
6. Al agregar un producto, se valida stock considerando lo reservado en **todos** los carritos
7. Al cerrar un carrito, si era el último, se crea uno nuevo vacío automáticamente

### Validación de Stock entre Carritos

- Al agregar producto: `disponible = stock_tienda - reservado_en_otros_carritos`
- En **Ventas**: se permite exceder el stock (solo muestra warning)
- En **Traspasos/Distribuciones**: se bloquea si excede stock disponible
- En **Agregar Stock**: no se valida stock (siempre se permite agregar)

---

## Criterios de Aceptación

- [x] Se pueden crear múltiples carritos independientes
- [x] Cada carrito mantiene su propio estado (productos, cliente, tipo de movimiento)
- [x] El stock reservado en un carrito reduce la disponibilidad en los demás
- [x] En ventas, se permite exceder stock (sin bloqueo)
- [x] En traspasos/distribuciones, se bloquea agregar si no hay stock suficiente
- [x] En "agregar stock", no hay validación de stock
- [x] Al cerrar el último carrito, se crea uno nuevo vacío
- [x] Agregar cliente recalcula precios (mayoreo vs unitario según config)
- [x] Quitar cliente recalcula precios a unitario
- [x] Cambiar cantidad recalcula precio automáticamente (mayoreo si aplica)

---

## Reglas de Negocio

### Precios Dinámicos

```
Si hay cliente CON descuento Y wholesale_price_on_client_discount = false:
  → Siempre precio unitario (ignora mayoreo)

Si NO hay cliente O wholesale_price_on_client_discount = true:
  → Si cantidad >= min_wholesale_quantity → precio mayoreo
  → Si no → precio unitario
```

### Reserva de Stock

```
stock_reservado = Σ(cantidad_en_cada_carrito_excepto_el_activo)
stock_disponible = stock_del_producto - stock_reservado
```

### Tipos de Movimiento

| Tipo | Constante | Valida stock | Usa `available_stock` |
|------|-----------|--------------|----------------------|
| Venta | `venta` | No bloquea | ✅ |
| Traspaso | `traspaso` | Sí | `reserved_stock` |
| Distribución | `distribucion` | Sí | ✅ |
| Apartado | `apartado` | No bloquea | ✅ |
| Agregar Stock | `agregar` | No | N/A |
| Checar Stock | `checar` | N/A | N/A |

---

## Estructura del Estado

```javascript
{
  carts: [
    {
      id: 1,
      cart: [                    // Productos en el carrito
        {
          id: 123,              // store_product_id
          quantity: 2,
          product_price: 45.50, // Precio calculado (unitario o mayoreo)
          available_stock: 10,
          reserved_stock: 8,
          product: {
            name: "...",
            code: "...",
            prices: {
              unit_price: 50,
              wholesale_price: 45,
              min_wholesale_quantity: 5,
              wholesale_price_on_client_discount: true
            }
          },
          stockOtherStores: null  // Stock en otras tiendas (distribución)
        }
      ],
      client: {},               // Cliente seleccionado
      movementType: "venta",    // Tipo de movimiento activo
      createdAt: 1692000000000  // Timestamp de creación
    }
  ],
  activeCartId: 1,
  nextId: 2
}
```

---

## Acciones Disponibles

| Acción | Payload | Efecto |
|--------|---------|--------|
| `CREATE_NEW_CART` | — | Crea carrito vacío, cambia a él |
| `SWITCH_CART` | `cartId` | Cambia carrito activo |
| `CLOSE_CART` | `cartId` | Elimina carrito, cambia al primero |
| `ADD_TO_CART` | `product` | Agrega producto o suma cantidad |
| `REMOVE_FROM_CART` | `productId` | Quita producto del carrito |
| `CLEAN_CART` | — | Vacía carrito activo y quita cliente |
| `UPDATE_MOVEMENT_TYPE` | `type` | Cambia tipo de movimiento |
| `UPDATE_QUANTITY_IN_CART` | `{product, newQuantity}` | Actualiza cantidad y recalcula precio |
| `CHANGE_PRICE` | `product` | Alterna entre precio unitario y mayoreo |
| `ADD_CLIENT_TO_CART` | `client` | Asocia cliente y recalcula precios |
| `REMOVE_CLIENT_FROM_CART` | — | Quita cliente y recalcula precios |
| `COUNT_STOCK_OTHER_STORES` | `{product, stock}` | Guarda stock de otras tiendas (distribución) |

---

## Hook `useCartActions`

Helper que encapsula la lógica de agregar al carrito con validaciones:

- Verifica stock disponible considerando otros carritos
- Si no hay stock suficiente, abre modal de stock
- En modo "agregar stock", siempre permite agregar
- En distribuciones, consulta stock de otras tiendas después de agregar
- Si el producto requiere verificación de stock, retorna datos para alerta

---

## Permisos / Roles

| Acción | Owner | Admin | Vendedor |
|--------|-------|-------|----------|
| Crear/cerrar carritos | ✅ | ✅ | ✅ |
| Venta | ✅ | ✅ | ✅ |
| Traspaso | ✅ | ✅ | ❌ |
| Distribución | ✅ | ✅ | ❌ |
| Apartado | ✅ | ✅ | ✅ |
| Agregar Stock | ✅ | ❌ | ❌ |

---

## Notas Técnicas

- Redux clásico con switch/case (no usa Redux Toolkit)
- Selectors en `src/redux/cart/selectors.js`
- El helper `updateActiveCart` simplifica la actualización inmutable
- `getReservedStock` itera todos los carritos para calcular reservas
- No se usa middleware (thunks) — las acciones async están en componentes/hooks
