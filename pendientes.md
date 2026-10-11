# Pendientes

## Backend

- **Importación desde otro sistema: falta probar de punta a punta.** Los endpoints `products/eleventa/import-validation` y `products/eleventa/import` están escritos y su lectura/validación está probada con `inventario jugueteria.xls`, pero las vistas (consulta de códigos existentes, alta de productos, stock y logs) no se ejecutaron contra Django. Probar en `/importar-productos/`, modo Especial, con una tienda y con varias sucursales (tarea 12 de `.kiro/specs/eleventa-import/tasks.md`).
