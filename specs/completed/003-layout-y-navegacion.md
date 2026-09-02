# [003] Layout Principal y Navegación (MainLayout)

> **Estado:** completed  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Archivo:** `src/components/layout/MainLayout/MainLayout.jsx`  

---

## Problema / Necesidad

El sistema necesita una estructura de navegación que se adapte al tipo de vista (Tienda, Almacén o General) y al rol del usuario, mostrando solo las opciones relevantes en cada contexto.

---

## Solución Propuesta

Layout con AppBar fijo superior y Drawer (sidebar) colapsable a la izquierda. El contenido de la navegación cambia dinámicamente según `user.store_type` y `user.role`. Incluye menús de notificaciones, pendientes, y acciones rápidas en la barra superior.

---

## Comportamiento Esperado

1. El sidebar se expande/colapsa con el ícono de menú hamburguesa
2. Los items del menú se determinan por el tipo de vista:
   - **T (Tienda):** Vender, Ventas, Caja, Clientes, Productos, Auditoría, Movimientos, Historial
   - **A (Almacén):** Distribuir, Movimientos, Productos, Auditoría, Historial
   - **G (General/Admin):** Tableros, Tiendas, Clientes, Vendedores, Productos, Auditoría, Facturación, Servicios, Sincronizar
3. Items con `dropdown` se expanden/colapsan al hacer click
4. El item activo se resalta visualmente con color accent (`#a78bfa`)
5. Al hacer click en un item, navega a su ruta
6. El botón "Atrás" (flecha) regresa a la vista General (solo visible para owner con tienda seleccionada)
7. El avatar abre menú con "Perfil" y "Cerrar sesión"

### Barra Superior (AppBar)

Contiene:
- Botón hamburguesa (toggle sidebar)
- Título: `{tenant_name} - {store_name}` (o solo tenant si no hay tienda)
- Botón "Atrás" (solo owner con tienda seleccionada)
- `PendingMenu` — traspasos/distribuciones pendientes
- `DuplicateSalesMenu` — alertas de ventas duplicadas
- `StockRequestMenu` — solicitudes de ajuste de stock
- `NotificationsMenu` — notificaciones en tiempo real
- `PageHelp` — ayuda contextual
- Toggle tema claro/oscuro
- Avatar con menú de usuario

### Sidebar (Drawer)

- Logo SmartVenta (enlace a landing page)
- Items de navegación según tipo de vista
- Botón de WhatsApp de soporte al final (con info prellenada)
- Solo visible para roles !== seller

---

## Criterios de Aceptación

- [x] El menú cambia según tipo de vista (T/A/G)
- [x] Items se ocultan según rol del usuario (`hidden: user.role === "seller"`)
- [x] El item activo se resalta con color accent
- [x] Dropdowns se expanden/colapsan correctamente
- [x] Al colapsar sidebar, los iconos permanecen visibles
- [x] Botón "Atrás" limpia carrito, resetea store_id y navega a /tiendas/
- [x] Tablero de ventas se deshabilita entre 10 AM y 9 PM (cuando hay >1 tienda)
- [x] WhatsApp prellenado con tenant_name y store_name
- [x] Cerrar sesión limpia localStorage y redirige a login

---

## Reglas de Negocio

### Restricción de Tableros

```
isDashboardRestricted = tenant !== 'demo' 
  AND store_count > 1 
  AND hora >= 10 
  AND hora < 21
```

Si se cumple, el tablero de "Ventas exitosas" se muestra deshabilitado con mensaje "Antes de 10 AM o después de 9 PM".

### Navegación por Rol

| Sección | Owner | Admin | Vendedor |
|---------|-------|-------|----------|
| Vender | ✅ | ✅ | ✅ |
| Ventas (lista) | ✅ | ✅ | ✅ (sin dropdown) |
| Caja | ✅ | ✅ | Solo movimientos |
| Clientes | ✅ | ✅ | ❌ |
| Productos | ✅ | ✅ | ❌ |
| Auditoría | ✅ | ✅ | ❌ |
| Movimientos | ✅ | ✅ | Solo traspasos |
| Tableros (G) | ✅ | ❌ | ❌ |
| Facturación (G) | ✅ | ❌ | ❌ |
| WhatsApp soporte | ✅ | ✅ | ❌ |

### Vendedor — Items Visibles en Vista Tienda

El vendedor ve items separados (sin dropdowns):
- Vender
- Ventas
- Apartados
- Movimientos en caja
- Traspasos

---

## Diseño de UI

### AppBar
- Gradiente: `linear-gradient(135deg, #04346b 0%, #065a9e 100%)`
- Altura fija: 60px
- Sombra sutil: `0 1px 3px rgba(0,0,0,0.1)`

### Sidebar
- Ancho abierto: 256px
- Ancho cerrado: `calc(spacing(8) + 1px)` ≈ 65px
- Gradiente: `linear-gradient(180deg, #04346b → #032a56 → #022347)`
- Texto: blanco con opacidades variables
- Item activo: fondo `accent + 26% opacity`, hover `accent + 33%`
- Border-radius items: 10px
- Fuente items: 0.8rem, weight 600
- Sub-items: 0.75rem, indent 6.5 spacing

### Transiciones
- Sidebar open/close: 280ms, easing sharp

---

## Componentes Especiales en AppBar

| Componente | Función |
|------------|---------|
| `PendingMenu` | Muestra traspasos/distribuciones pendientes de confirmar |
| `DuplicateSalesMenu` | Alerta si hay ventas duplicadas |
| `StockRequestMenu` | Solicitudes de ajuste de stock pendientes |
| `NotificationsMenu` | Notificaciones en tiempo real (WebSocket) |
| `PageHelp` | Ayuda contextual sobre la página actual |

---

## Dependencias

- `useUser()` — Contexto del usuario (datos, logout, updateUser)
- `useNavigate`, `useLocation` — React Router
- Redux: `cleanCart` — Limpia carrito al cambiar de tienda
- `colors` — Tokens de color del tema
- Evento `store-changed` — Dispara actualización global al cambiar tienda
