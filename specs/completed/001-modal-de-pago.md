# [001] Modal de Pago (PaymentModal)

> **Estado:** completed  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Archivo:** `src/components/sales/PaymentModal/PaymentModal.jsx`  

---

## Problema / Necesidad

Al finalizar una venta o registrar un apartado, el usuario necesita un flujo claro para seleccionar método de pago, calcular cambio, asociar un cliente y opcionalmente aplicar un intercambio de mercancía.

---

## Solución Propuesta

Modal que centraliza el cobro de una venta. Muestra totales (con y sin descuento), permite elegir método de pago único o mixto, capturar el monto pagado, calcular el cambio, y enviar la venta al backend. Opcionalmente imprime ticket.

---

## Comportamiento Esperado

1. El usuario abre el modal desde el POS (después de agregar productos al carrito)
2. El sistema muestra el total y total con descuento (si hay cliente con descuento)
3. El campo "Pago con" recibe foco automáticamente
4. El usuario selecciona tipo de pago: Único (radio) o Mixto (checkbox)
5. Si es Único, elige entre Efectivo, Tarjeta o Transferencia
6. Si es Mixto, marca las combinaciones y captura montos por método
7. Si el método incluye Tarjeta o Transferencia, aparece campo "Referencia de pago" (obligatorio)
8. El sistema calcula el cambio automáticamente: `pago + devolución - total`
9. El usuario presiona "Cobrar" (o Ctrl+G) para finalizar
10. Si hay impresora configurada y conectada, imprime ticket automáticamente
11. El carrito se limpia y se muestra mensaje de éxito con folio

### Flujo de Apartado (Reservación)

1. Si el tipo de movimiento es "apartado", el modal cambia título a "Registrar apartado"
2. Se muestra alerta informativa: "El cliente paga un anticipo"
3. El campo cliente es **obligatorio** (no se puede apartar sin cliente)
4. El monto máximo de anticipo es `total - 1` (redondeado hacia abajo)
5. El pago mixto no está disponible en apartados
6. El botón dice "Apartar" en lugar de "Cobrar"

---

## Criterios de Aceptación

- [x] El modal muestra total y total con descuento de cliente
- [x] El foco va al campo "Pago con" al abrir
- [x] Pago Único: solo un método activo a la vez (EF, TA, TR)
- [x] Pago Mixto: múltiples métodos con montos individuales, la suma debe igualar el total
- [x] Si hay Tarjeta o Transferencia, el campo "Referencia" es obligatorio
- [x] El botón se deshabilita si el pago es inválido
- [x] Ctrl+G dispara el cobro si el modal está abierto
- [x] Ctrl+O quita el cliente del carrito
- [x] Si hay impresora, muestra chip verde/rojo con estado de conexión
- [x] Al completar, limpia carrito, quita cliente y cierra modal
- [x] Apartado: requiere cliente, limita anticipo a total-1, deshabilita mixto

---

## Diseño de UI

- **Ubicación:** Modal desde el POS (`CustomModal`)
- **Componentes:** `CustomModal`, `CustomButton`, `CustomSpinner`, `Grid`, `TextField`, `RadioGroup`, `Checkbox`, `Alert`, `Chip`
- **Secciones:**
  1. Alerta informativa (solo en apartado)
  2. Botones "Añadir cliente" / "Intercambio de mercancía" (ocultos en apartado)
  3. Sección de cliente (colapsable, siempre visible en apartado)
  4. Sección de intercambio (colapsable)
  5. Totales: Total, Total con descuento, Pago con, Cambio/Referencia
  6. Métodos de pago + botón Cobrar + estado impresora

---

## Reglas de Negocio

- El redondeo usa lógica custom: decimales ≤0.5 → sube a 0.5, >0.5 → sube al entero siguiente
- El descuento de cliente se aplica como: `total × (complemento_porcentaje / 100)`
- Un apartado **no puede** tener anticipo ≥ total (máximo: `Math.floor(total) - 1`)
- No se permite doble submit (ref `isSubmittingRef`)
- Tarjeta y Transferencia son mutuamente excluyentes en modo mixto
- En apartado, `reservation_in_progress: true` se envía al backend

---

## Permisos / Roles

| Acción | Owner | Admin | Vendedor |
|--------|-------|-------|----------|
| Cobrar venta | ✅ | ✅ | ✅ |
| Registrar apartado | ✅ | ✅ | ✅ |
| Añadir/quitar cliente | ✅ | ✅ | ✅ |
| Intercambio de mercancía | ✅ | ✅ | ✅ |

---

## Datos / API

### Endpoints

| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/sale/` | Crear venta o apartado |
| GET | `/api/sale/{id}/` | Buscar venta para intercambio |

### Payload de Creación

```
Campo                     Tipo        Notas
─────────────────────     ──────────  ─────────────────────────
client                    int|null    ID del cliente (opcional en venta, requerido en apartado)
total                     decimal     Total con descuento aplicado
store_products            array       [{id, quantity, name, code, price}]
payments                  array       [{payment_method: "EF"|"TA"|"TR", amount}]
reference_payment         string      Referencia (obligatorio si TA o TR)
sale_exchange             object      {id, refunded, payment}
reservation_in_progress   boolean     true si es apartado
```

---

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| Ctrl+G | Cobrar/Apartar (con impresión si hay impresora) |
| Ctrl+O | Quitar cliente del carrito |

---

## Dependencias

- Redux: `selectCart`, `selectMovementType`, `selectClient`
- Acciones: `cleanCart`, `removeClientfromCart`, `addClientToCart`
- Hook: `usePrinterStatus` (verifica conexión de impresora)
- Hook: `useModal` (para modal de crear cliente)
- Util: `handlePrintTicket` (envía a impresora térmica)
- Componente: `SearchClient` (autocompletado de clientes)
- Componente: `ClientModal` (crear cliente nuevo)
