# [006] Sistema de Constantes y Tipos de Movimiento

> **Estado:** completed  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Archivo:** `src/constants/index.js`  

---

## Problema / Necesidad

El sistema maneja múltiples tipos de operación desde una sola interfaz de POS. Se necesita un catálogo centralizado de constantes para evitar strings mágicos y garantizar consistencia entre componentes.

---

## Solución Propuesta

Archivo de constantes (`src/constants/index.js`) que exporta objetos inmutables con los valores del sistema.

---

## Constantes Definidas

### MOVEMENT_TYPES

Define los tipos de operación disponibles en el POS:

| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `SALE` | `"venta"` | Venta a cliente |
| `TRANSFER` | `"traspaso"` | Mover mercancía entre tiendas |
| `DISTRIBUTION` | `"distribucion"` | Envío desde almacén a múltiples tiendas |
| `RESERVATION` | `"apartado"` | Separar productos con anticipo |
| `ADD_STOCK` | `"agregar"` | Agregar inventario |
| `CHECK_STOCK` | `"checar"` | Consultar stock |

### QUERY_TYPES

Tipos de búsqueda en `SearchProduct`:

| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `CODE` | `"code"` | Búsqueda por código de barras |
| `NAME` | `"q"` | Búsqueda por nombre |

### STORE_TYPES

| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `WAREHOUSE` | `"A"` | Almacén |
| `STORE` | `"B"` | Tienda/Sucursal |

### UI_TEXT

Textos comunes de la interfaz para evitar repetición:

`ALL`, `ALL_DEPARTMENTS`, `ALL_BRANDS`, `ALL_STORES`, `LOADING`, `NO_DATA`, `ERROR`, `SUCCESS`, `CANCEL`, `SAVE`, `DELETE`, `EDIT`, `ADD`, `SEARCH`

---

## Uso en el Sistema

- **MOVEMENT_TYPES** se usa en: multiCartReducer, PaymentModal, SearchProduct, useCartActions, Cart
- **QUERY_TYPES** se usa en: SearchProduct para alternar entre búsqueda por código o nombre
- **STORE_TYPES** se usa en: StoreList, validaciones de tipo de tienda
- **UI_TEXT** se usa en: componentes de tabla, botones, mensajes genéricos

---

## Atajos de Teclado Asociados

Los tipos de movimiento se cambian con atajos desde el POS:

| Atajo | Tipo |
|-------|------|
| Ctrl+E | Venta |
| Ctrl+R | Traspaso |
| Ctrl+T | Distribución |
| Ctrl+Y | Apartado |
| Ctrl+U | Agregar Stock |
| Ctrl+I | Checar Stock |
