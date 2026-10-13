# Pendientes

## Backend

- **Comparativo con ayer en `/tiendas/`.** El diseño pide mostrar bajo "Ventas" algo como "Ayer a esta hora llevabas 12", pero `stores/cash-summary` solo devuelve el periodo pedido. Falta que la API devuelva el conteo de ventas de ayer hasta la misma hora (por tienda y en `totals`). Hasta entonces, la pantalla no muestra ese texto.
- **Nombre del usuario para el saludo.** `/tiendas/` saluda con `user.first_name || user.username`; confirmar que el login devuelva `first_name` (hoy no se verificó qué campos trae la respuesta).
- **Importación desde otro sistema: falta probar de punta a punta.** Los endpoints `products/eleventa/import-validation` y `products/eleventa/import` están escritos y su lectura/validación está probada con `inventario jugueteria.xls`, pero las vistas (consulta de códigos existentes, alta de productos, stock y logs) no se ejecutaron contra Django. Probar en `/importar-productos/`, modo Especial, con una tienda y con varias sucursales (tarea 12 de `.kiro/specs/eleventa-import/tasks.md`).
