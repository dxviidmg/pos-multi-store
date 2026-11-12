# Components — Domain-Driven Architecture

## Estructura

```
src/components/
├── README.md (este archivo)
├── admin/               # Tableros, sucursales, auditoría, usuarios
├── cashflow/            # Caja: movimientos
├── catalog/             # Marcas, departamentos, vendedores
├── clients/             # Clientes, descuentos
├── inventory/           # Carrito, traspasos, distribuciones, conversiones
├── layout/              # Login, MainLayout (sidebar, header)
├── products/            # Catálogo, importaciones, precios
├── sales/               # Pantalla de venta, cobro, ventas, apartados
├── tenant/              # Registro, plan, pagos
└── ui/                  # Componentes compartidos (Button, Modal, etc.)
```

## Dominios (Domains)

### 🏢 admin/ — Administración del negocio

**Responsabilidad:** Gestión de sucursales, usuarios, auditoría, tableros.

**Componentes principales:**
- `Dashboard/` — Tableros de ventas, cancelaciones, stock, etc.
- `StoreList/` — Listar sucursales (tiendas + almacenes)
- `AdminList/` — Listar administradores por sucursal
- `AuditTransaction/` — Transacciones irregulares
- `ProductAudit/` — Productos sin movimiento, problemas de precio
- `SellerList/` — Listar vendedores

**Patrón:** useQuery + DataGrid, filtros, exportación a Excel

**Acceso:** Solo dueño (`isOwner(user)`)

---

### 💵 cashflow/ — Caja y movimientos

**Responsabilidad:** Corte de caja, movimientos de dinero.

**Componentes principales:**
- `CashFlowList/` — Historial de movimientos
- `CashFlowModal/` — Agregar entrada/salida

**Patrón:** Filtros por fecha, exportación, validación de montos

**Acceso:** Administrador + dueño

---

### 📚 catalog/ — Catálogo

**Responsabilidad:** Marcas, departamentos, vendedores.

**Componentes principales:**
- `BrandList/` — Listar marcas + crear/editar
- `DepartmentList/` — Listar departamentos
- `SellerList/` — Listar vendedores (en admin/ también)

**Patrón:** CatalogList wrapper reutilizable; modales para crear/editar

**Acceso:** Dueño

---

### 👥 clients/ — Clientes

**Responsabilidad:** Gestión de clientes, descuentos.

**Componentes principales:**
- `ClientList/` — Listar clientes
- `ClientModal/` — Crear/editar cliente
- `DiscountList/` — Listar descuentos

**Patrón:** Búsqueda by nombre/teléfono, integración con venta

**Acceso:** Administrador + vendedor

---

### 🛒 inventory/ — Inventario

**Responsabilidad:** Carrito, traspasos, distribuciones, conversiones.

**Componentes principales:**
- `Cart/` — Carrito (tabla/tarjetas, busqueda, cantidad)
- `TransferList/` — Listar traspasos
- `DistributionList/` — Listar distribuciones
- `ConversionList/` — Desempaques (conversiones)
- `StockRequestList/` — Solicitudes de ajuste

**Patrón:** Redux para carrito; React Query para lista; modales para detalles

**Acceso:** Vendedor + administrador

---

### 🎨 layout/ — Layout global

**Responsabilidad:** Estructura de la app (header, sidebar, login).

**Componentes principales:**
- `Login/` — Pantalla de login
- `MainLayout/` — Sidebar + header + drawer móvil
- `ErrorBoundary/` — Manejo de errores
- `NotificationsMenu/` — Notificaciones en tiempo real

**Patrón:** Context, localStorage, localStorage

**Acceso:** Público (login) + autenticado (MainLayout)

---

### 📦 products/ — Catálogo de productos

**Responsabilidad:** Productos, inventario por tienda, importaciones, precios.

**Componentes principales:**
- `ProductList/` — Catálogo (tabla/galería con filtros)
- `ProductModal/` — Crear/editar producto
- `ProductImport/` — Importar desde Excel
- `StoreProductList/` — Inventario por tienda
- `PriceLogList/` — Historial de cambios de precio

**Patrón:** useViewModePreference para tabla/galería; React Query con filtros complejos

**Acceso:** Dueño (crear/editar); administrador (ver)

---

### 💳 sales/ — Punto de venta

**Responsabilidad:** Venta, cobro, apartados, ventas, cancelaciones.

**Componentes principales:**
- `SaleCreate/` — Pantalla de venta (buscar → agregar → cobrar)
- `PaymentModal/` — Modal de cobro (efectivo, tarjeta, transferencia)
- `SaleList/` — Historial de ventas
- `ReservationList/` — Apartados
- `SaleImport/` — Importar ventas desde Excel

**Patrón:** Redux para carrito; atajos de teclado; WebSocket para notificaciones

**Acceso:** Vendedor + administrador

---

### 🏢 tenant/ — Negocio (suscripción)

**Responsabilidad:** Registro, plan, pagos, suscripción.

**Componentes principales:**
- `Registration/` — Flujo de registro (negocio → propietario → plan)
- `MyCurrentPlan/` — Ver plan actual, cambiar tarjeta
- `PaymentHistory/` — Historial de pagos
- `SubscriptionList/` — Historial de suscripciones

**Patrón:** Mercado Pago SDK para pago; context para usuario autenticado

**Acceso:** Público (registro); dueño (My Plan)

---

### 🎯 ui/ — Componentes compartidos

**Responsabilidad:** Componentes MUI reutilizables por toda la app.

**Componentes principales:**
- `CustomButton/` — Button con defaults MUI
- `CustomModal/` — Modal con estilos consistentes
- `CustomTooltip/` — Tooltip con estilos
- `DataTable/` — Tabla (search, sort, paginate, select)
- `PageHeader/` — Título + acciones de página
- `CustomSpinner/` — Indicador de carga

**Patrón:** Wrappers sobre MUI; props simplificados; estilos consistentes

**Reutilización:** Utilizado por todos los dominios

---

## Estructura de un componente

Cada dominio sigue este patrón:

```
components/{dominio}/{Componente}/
├── {Componente}.jsx           # Componente principal
├── {Componente}.styles.js     # Estilos (si necesita)
├── {Componente}.columns.jsx   # Columnas (si es tabla)
├── {Componente}Modal.jsx      # Modal relacionado
├── {Componente}List.jsx       # Lista/tabla (si tiene)
├── use{Componente}.js         # Hook custom
├── {componente}Validation.js  # Validaciones puras
└── shared/                    # Subcomponentes reutilizables en el dominio
    └── {Subcomponente}.jsx
```

### Ejemplo: sales/

```
components/sales/
├── SaleCreate/
│   ├── SaleCreate.jsx        # Componente principal
│   ├── SearchProduct.jsx     # Búsqueda integrada
│   ├── PaymentModal/         # Modal de cobro
│   ├── usePaymentMethods.js  # Hook de métodos de pago
│   └── shared/
│       └── PaymentSubmitPanel.jsx
├── PaymentEditModal/
│   ├── PaymentEditModal.jsx
│   └── usePaymentMethods.js
├── SaleList/
│   ├── SaleList.jsx
│   ├── SaleList.columns.jsx
│   └── useSaleMutations.js
└── shared/
    ├── PaymentSubmitPanel.jsx
    └── PrintTicketButton.jsx
```

---

## Checklist para componentes nuevos

- [ ] Máximo 300 LOC en archivo principal
- [ ] Props documentados con JSDoc o PropTypes
- [ ] `memo()` si es puro
- [ ] Nombrado en PascalCase
- [ ] En su propia carpeta
- [ ] Estilos en `{Componente}.styles.js` (si hay mucho CSS)
- [ ] Subcomponentes en la misma carpeta
- [ ] Hook custom en la misma carpeta (si hay lógica compleja)

---

## Permisos por dominio

| Dominio | Owner | Admin | Seller |
|---|---|---|---|
| admin/ | ✅ | — | — |
| cashflow/ | ✅ | ✅ | ✅ (solo ventas del día) |
| catalog/ | ✅ | — | — |
| clients/ | ✅ | ✅ | ✅ (ver solo) |
| inventory/ | ✅ | ✅ | ✅ |
| products/ | ✅ | ✅ (ver) | ✅ (ver) |
| sales/ | ✅ | ✅ | ✅ |
| tenant/ | ✅ | — | — |

**Nota:** Los permisos se aplican en `RequireAccess` (App.js) y en componentes individuales.

---

## Conversiones de componentes

Varios componentes pueden ser reutilizados en múltiples dominios:
- `Dialog` → Aparece desde varias pantallas
- `SearchBar` → Usado en inventory, products, sales
- `Modal` → Patrón estándar

Estos viven en `ui/` o en `{dominio}/shared/` si son específicos del dominio.

---

## Performance tips

1. **useCallback** para callbacks pasadas a hijos
2. **useMemo** para listas, filtros derivados
3. **memo()** en componentes puros
4. **React.lazy** + Suspense para rutas

---

## Recursos

- [Componentes de referencia](../../REFACTOR_PLAN.md#patrones-de-referencia) — Copiar estructura
- [UI compartidos](../../AGENTS.md#8-componentes-ui-compartidos-srccomponentsui) — Lista completa
- [Estilo visual](../../AGENTS.md#11-estilo-visual) — Tema, colores, tipografía

---

**Última actualización:** 2026-10-10  
**Total de dominios:** 10  
**Total de componentes:** 100+
