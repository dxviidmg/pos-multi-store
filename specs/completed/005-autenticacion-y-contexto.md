# [005] Autenticación y Contexto de Usuario

> **Estado:** completed  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Archivos:**  
> - `src/context/UserContext.js`  
> - `src/components/layout/Login/Login.jsx`  
> - `src/App.js`  

---

## Problema / Necesidad

El sistema necesita mantener la sesión del usuario, sus permisos, la tienda activa y la información del tenant de forma accesible en toda la aplicación, persistiendo entre recargas de página.

---

## Solución Propuesta

Context de React (`UserContext`) que almacena los datos del usuario en estado y los sincroniza con localStorage. Provee funciones para login, logout y actualización parcial de datos (como cambio de tienda).

---

## Comportamiento Esperado

### Login
1. El usuario ingresa credenciales en `/login`
2. El backend retorna token + datos del usuario (rol, tiendas, tenant)
3. Se guarda en localStorage y se actualiza el contexto
4. La app re-renderiza mostrando `MainLayout` con las rutas autenticadas

### Cambio de Tienda
1. El usuario selecciona una tienda desde `/tiendas/`
2. Se llama `updateUser({ store_id, store_name, store_type })`
3. Se actualiza localStorage y el contexto
4. Se dispara evento global `store-changed`
5. Los componentes que escuchan el evento actualizan sus datos

### Logout
1. Se limpia localStorage
2. Se resetea el contexto a `null`
3. La app muestra la pantalla de login

### Registro
1. Ruta pública `/registrarme/` accesible sin autenticación
2. Componente `Registration` (multi-paso con pago)

---

## Criterios de Aceptación

- [x] Los datos del usuario persisten entre recargas (localStorage)
- [x] El contexto expone: `user`, `login`, `logout`, `updateUser`
- [x] `updateUser` hace merge parcial (no reemplaza todo el objeto)
- [x] Un 401 del servidor limpia la sesión automáticamente (interceptor)
- [x] Rutas protegidas: si no hay user, se muestra Login
- [x] Ruta `/registrarme/` es accesible sin autenticación

---

## Estructura del Objeto User

```
Campo                    Tipo       Notas
─────────────────────    ─────────  ─────────────────────
token                    string     Token de autenticación
role                     string     "owner" | "admin" | "seller"
tenant_name              string     Nombre del negocio
tenant_short_name        string     Slug del tenant (ej: "demo")
store_id                 int|null   Tienda activa (null = vista general)
store_name               string     Nombre de la tienda activa
store_type               string     "T" (tienda) | "A" (almacén) | "" (general)
store_count              int        Cantidad de tiendas del tenant
store_printer            string     URL de impresora de la tienda (si tiene)
discount_percentage      number     Descuento del usuario (si aplica)
```

---

## Routing

### Rutas Autenticadas (dentro de MainLayout)

El routing usa lazy loading con `lazyRetry` (auto-reload en ChunkLoadError):

| Ruta | Componente | Notas |
|------|-----------|-------|
| `/vender/` | SaleCreate | POS principal |
| `/distribuir/` | SaleCreate | Mismo componente, distinto movementType |
| `/ventas/` | SaleList | |
| `/apartados/` | ReservationList | |
| `/corte-caja/` | CashSummary | |
| `/movimientos-caja/` | CashFlowList | |
| `/traspasos/` | TransferList | |
| `/distribuciones/` | DistributionList | |
| `/conversiones/` | ConversionList | |
| `/clientes/` | ClientList | |
| `/productos/` | ProductList | |
| `/inventario/` | StoreProductList | |
| `/marcas/` | BrandList | |
| `/departamentos/` | DepartmentList | |
| `/tiendas/` | StoreList | |
| `/vendedores/` | SellerList | |
| `/tablero-ventas/` | Dashboard | |
| `/tablero-ventas-ajustadas-cancelaciones/` | CancellationsDashboard | |
| `/tablero-verificacion-stock/` | StockVerificationDashboard | |
| `/tablero-traspasos-pendientes/` | PendingTransfersDashboard | |
| `/tablero-productos/` | ProductsDashboard | |
| `/auditoria-transacciones/` | TransactionAudit | |
| `/auditoria-productos/` | ProductAudit | |
| `/auditoria-inventario/` | ProductAuditList | |
| `/importar-productos/` | ProductImport | |
| `/importar-inventario/` | StoreProductImport | |
| `/importar-ventas/` | SaleImport | |
| `/reasignacion/` | ProductReassign | |
| `/historial-precios/` | PriceLogsList | |
| `/historial-stock/` | LogList | |
| `/solicitudes-ajustes-stock/` | StockUpdateRequestList | |
| `/mi-plan-actual/` | MyCurrentPlan | |
| `/pagos/` | TenantPaymentList | |
| `/suscripciones/` | SubscriptionList | |
| `/servicios/` | ServiceList | |
| `/sincronizar/` | RestartService | |
| `/perfil/` | Profile | |

### Ruta Catch-all (`*`)

- Si `user.store_id` existe → muestra `SaleCreate` (POS)
- Si no → muestra `StoreList` (seleccionar tienda)

### Rutas Públicas

| Ruta | Componente |
|------|-----------|
| `/registrarme/` | Registration |
| `*` (no auth) | Login |

---

## Reglas de Negocio

- El `store_id` se pone como `null` (no string vacío) al volver a vista general
- El header HTTP `store-id` solo se envía cuando `store_id` es numérico
- El evento `store-changed` permite a componentes como notificaciones reconectarse al WebSocket
- Las rutas usan `ErrorBoundary` + `Suspense` con fallback de loading

---

## Permisos / Roles

| Vista/Funcionalidad | Owner | Admin | Vendedor |
|---------------------|-------|-------|----------|
| Acceso al sistema | ✅ | ✅ | ✅ |
| Cambiar de tienda | ✅ | ❌ | ❌ |
| Volver a vista general | ✅ | ❌ | ❌ |
| Ver tableros | ✅ | ❌ | ❌ |
| Ver facturación | ✅ | ❌ | ❌ |

---

## Notas Técnicas

- `lazyRetry` envuelve `React.lazy` para hacer reload automático si falla la carga del chunk (ChunkLoadError)
- Componentes críticos (Login, MainLayout) se cargan de forma inmediata (sin lazy)
- No se usa React Router guards/middleware — la protección es condicional en el JSX del routing
