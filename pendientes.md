# Pendientes

## Backend

### Liquidar un apartado no lo convierte en venta

- **Dónde:** `PATCH /api/sale/{id}` (lo llama `updateSale` en `src/api/sales.js:74`, desde `src/components/sales/PaymentEditModal/PaymentEditModal.jsx:64`).
- **Qué pasa:** cuando el abono cubre el saldo (`reservation_in_progress` pasa a false), la venta conserva `sale_type = "A"` (`SALE_TYPES.RESERVATION`). El frontend solo la quita de la lista de apartados.
- **Corrección sugerida:** en el backend, al registrar el pago que deja el saldo en 0, poner `sale_type = "V"` (`SALE_TYPES.SALE`) en la misma transacción, y devolverlo en la respuesta. El frontend no necesita cambios: ya muestra "Apartado liquidado" y saca la fila de la lista.
- **Revisar también:** fecha de la venta para tableros y corte de caja (¿fecha del apartado o de la liquidación?).
