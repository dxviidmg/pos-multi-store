# SmartVenta — Sistema de Punto de Venta Multi-Tienda

Sistema de punto de venta (POS) diseñado para negocios con múltiples sucursales. Permite gestionar ventas, inventario, traspasos y distribuciones desde una sola plataforma, con visibilidad en tiempo real de todas las tiendas y almacenes.

## ¿Para quién es?

Negocios minoristas y mayoristas que operan con varias tiendas y/o almacenes, y necesitan control centralizado de su operación sin depender de software costoso o complicado.

## Funcionalidades principales

- **Punto de venta rápido** — Búsqueda por código de barras o nombre, múltiples carritos simultáneos, precios unitarios y de mayoreo, impresión de tickets, y soporte para ventas, traspasos y distribuciones desde la misma pantalla.
- **Gestión multi-tienda** — Administra tiendas y almacenes desde un panel central. Cambia entre sucursales sin cerrar sesión.
- **Inventario en tiempo real** — Consulta stock disponible en todas las tiendas, con alertas de stock insuficiente y reservas automáticas entre carritos.
- **Traspasos y distribuciones** — Mueve mercancía entre almacenes y tiendas con trazabilidad completa. Confirma recepciones desde cada sucursal.
- **Clientes y mensualidades** — Registro de clientes, historial de compras y gestión de pagos recurrentes.
- **Corte de caja** — Resumen diario de ventas por método de pago (efectivo, tarjeta, transferencia), con movimientos de caja detallados.
- **Dashboard y auditoría** — Tablero general con métricas del negocio (mejor/peor tienda, día, hora). Dos módulos de auditoría: transacciones (ventas duplicadas, logs inconsistentes, discrepancias de stock) y productos (códigos repetidos, costo en cero, precio mayoreo inconsistente, faltantes en tiendas, productos sin movimiento).
- **Ayuda contextual** — Botón de ayuda en el navbar que muestra una descripción de la página actual según la ruta.
- **Importación masiva** — Carga productos, inventario y ventas desde archivos Excel.
- **Roles y permisos** — Tres niveles de acceso: dueño, administrador y vendedor, cada uno con su vista y permisos específicos.
- **Modo oscuro/claro** — Interfaz adaptable a la preferencia del usuario.
- **Impresión de tickets** — Integración con impresoras térmicas para tickets de venta.

## Stack técnico

- **Frontend:** React 18 con Create React App
- **UI:** Material UI (MUI) con tema personalizado (paleta azul oscuro, tipografía Inter/Plus Jakarta Sans, componentes con bordes redondeados y gradientes)
- **Estado global:** Redux con patrón multi-carrito (múltiples carritos simultáneos por sesión)
- **Routing:** React Router v6 con lazy loading y Suspense para todas las rutas
- **HTTP:** Cliente Axios centralizado con headers de autenticación por token
- **Backend:** API REST (Django/DRF con tareas asíncronas vía Celery)

## Arquitectura

- **Multi-tenant:** Soporta múltiples negocios (tenants), cada uno con sus tiendas, productos y usuarios.
- **Tres tipos de vista:** Tienda (T), Almacén (A) y General/Admin (G), cada una con su menú y funcionalidades específicas.
- **API Factory:** Patrón genérico para CRUD de entidades (`createApiService`) que reduce código repetitivo.
- **Hooks personalizados:** `useFetch`, `useCrudMutation`, `useModal`, `useForm`, `useQueries` para lógica reutilizable.
- **Tareas asíncronas:** Operaciones pesadas (auditoría, exportaciones) se ejecutan como tareas en background con polling de progreso.
- **Keep-alive:** Mecanismo para mantener la sesión activa.
- **Exportación a Excel:** Funcionalidad integrada para descargar reportes.
- **Caché configurable:** Tiempos de caché por tipo de dato (1 min a 1 hora).

## Seguridad

- Autenticación por token
- Roles con permisos granulares (owner, admin, seller)
- Vistas y acciones filtradas por rol y tipo de tienda

## Scripts disponibles

```bash
npm start       # Inicia en modo desarrollo en http://localhost:3000
npm run build   # Genera build de producción en /build
npm test        # Ejecuta tests
```

## Guía de estilos (Design Tokens)

Referencia para mantener consistencia visual entre el sistema y la landing page.

### Tipografía

```
Fuentes:        'Inter', 'Plus Jakarta Sans', sans-serif
```

| Nivel  | Tamaño    | Peso |
|--------|-----------|------|
| h1     | 2.25rem   | 700  |
| h2     | 1.875rem  | 700  |
| h3     | 1.5rem    | 600  |
| h4     | 1.3125rem | 600  |
| h5     | 1.125rem  | 600  |
| h6     | 1rem      | 600  |
| body1  | 0.875rem  | 400  |
| body2  | 0.8rem    | 400  |
| button | —         | 600, sin uppercase, letter-spacing 0.02em |

### Paleta de colores

**Primarios:**

| Token         | Valor     | Uso                        |
|---------------|-----------|----------------------------|
| primary       | `#04346b` | Color principal, botones   |
| primary-light | `#065a9e` | Hover, gradientes          |
| primary-dark  | `#022347` | Sidebar fondo, énfasis     |
| accent        | `#a78bfa` | Elementos activos, sidebar |

**Fondos (modo claro):**

| Token      | Valor                      |
|------------|----------------------------|
| default    | `rgba(4, 53, 107, 0.08)`   |
| paper      | `#ffffff`                  |
| border     | `#e8ecf1`                  |

**Fondos (modo oscuro):**

| Token      | Valor      |
|------------|------------|
| default    | `#0d1117`  |
| paper      | `#161b22`  |
| border     | `#30363d`  |

**Texto (modo claro):**

| Token     | Valor     |
|-----------|-----------|
| primary   | `#1e293b` |
| secondary | `#4a5568` |

**Texto (modo oscuro):**

| Token     | Valor     |
|-----------|-----------|
| primary   | `#e6edf3` |
| secondary | `#8b949e` |

### Gradientes

```css
/* Barra superior / botones principales */
background: linear-gradient(135deg, #04346b 0%, #065a9e 100%);

/* Sidebar */
background: linear-gradient(180deg, #04346b 0%, #032a56 50%, #022347 100%);

/* Cards decorativas */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Éxito */
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);

/* Advertencia */
background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%);

/* Info */
background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
```

### Bordes y sombras

```css
border-radius: 12px;   /* General (shape) */
border-radius: 16px;   /* Cards */
border-radius: 14px;   /* Paper */
border-radius: 10px;   /* Botones, inputs */
border-radius: 8px;    /* Chips, tooltips */

box-shadow: 0 1px 3px rgba(0,0,0,0.06);   /* Sutil */
box-shadow: 0 4px 20px rgba(0,0,0,0.12);  /* Medio */
box-shadow: 0 8px 30px rgba(0,0,0,0.08);  /* Hover cards */
```

### Transiciones

```css
transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);  /* Botones */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);   /* Cards */
transition: all 0.2s ease;                             /* Inputs */
```
