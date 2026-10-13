# Menú con secciones y pestañas — Requisitos

## Historia
Como usuario quiero un menú lateral corto, con las pantallas relacionadas agrupadas en pestañas, para encontrar cada función sin recorrer submenús de diez enlaces.

## Criterios de aceptación
1. Las pantallas relacionadas se agrupan en **secciones**. Cada sección es una sola entrada del menú y muestra una barra de pestañas sobre el contenido. Cada pestaña sigue siendo su propia ruta: los enlaces directos, el botón Atrás y las notificaciones que navegan por `href` siguen funcionando.
2. Secciones y pestañas:
   - **Ventas**: Ventas · Apartados
   - **Caja**: Corte de caja · Movimientos
   - **Movimientos**: Distribuciones · Traspasos
   - **Inventario**: Inventario · Conversiones · Reasignación · Por verificar
   - **Marcas y departamentos**: Marcas · Departamentos
   - **Importaciones**: Productos · Inventario · Ventas
   - **Historial**: Stock · Precios
   - **Facturación**: Mi plan · Pagos · Suscripciones
   - **Auditoría** (vista general): Productos · Transacciones
3. Siguen como entradas sueltas: Ajustes de inventario (en todas las vistas, justo después de Inventario o Productos), Vender, Distribuir, Clientes, Productos, Tiendas, Vendedores, Servicios y Sincronizar. Los **Tableros** siguen como submenú: cada uno lanza una tarea pesada y no deben montarse juntos.
4. Las pestañas se filtran con `canAccessRoute`, igual que el menú. Una pestaña que el usuario no puede abrir no aparece. Si queda una sola, no se muestra la barra y la entrada del menú es un enlace directo con el nombre completo de esa pantalla (por ejemplo "Movimientos en caja" para el vendedor).
5. El enlace de la entrada abre la primera pestaña accesible. La entrada del menú aparece activa en cualquier ruta de su sección.
6. **Productos** es un submenú con: Productos, Importar productos, Ajustes de inventario y Marcas y departamentos (en la vista general, Productos conserva sus pestañas y no hay entrada "Importaciones", que solo tendría Productos). Menú resultante:
   - **Tienda (administrador)**: Vender · Ventas · Caja · Clientes · Productos · Inventario · Movimientos · Marcas y departamentos · Importaciones · Historial
   - **Almacén**: Distribuir · Movimientos · Productos · Inventario · Marcas y departamentos · Importaciones · Historial
   - **Vista general**: Tableros · Tiendas · Clientes · Vendedores · Productos (Productos · Conversiones · Reasignación · Historial de precios) · Ajustes de inventario · Marcas y departamentos · Importaciones · Auditoría · Facturación · Servicios · Sincronizar. No tiene Inventario ni Historial como entradas.
   - **Vendedor**: lo que sus permisos abran (Vender, Ventas, Caja con solo Movimientos, Movimientos con solo Traspasos).
7. "Auditoría" de tienda y almacén desaparece como entrada: su única pantalla pasa a ser la pestaña "Por verificar" de Inventario.
8. La importación de productos reemplaza sus pestañas Tradicional/Especial por un control de modo (botones segmentados a todo el ancho) dentro de la página, para no tener dos barras de pestañas.
9. Cambiar de pestaña remonta la página: se pierden filtros y búsqueda de la pestaña anterior. Es aceptable.
10. La pestaña activa define el título de la página (cada página conserva su `PageHeader`) y su ayuda en `helpTexts.js`, que ya es por ruta.
11. La barra de pestañas va dentro de la card blanca de la página, arriba del título.
12. Funciona en escritorio, en el panel móvil y con el tema oscuro. Las pestañas se desplazan horizontalmente si no caben en móvil.

## Fuera de alcance
Conservar el estado de una pestaña al cambiar a otra, tableros en pestañas, cambios de rutas o de permisos, y agregar Conversiones o Reasignación al almacén.
