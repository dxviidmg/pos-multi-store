# SmartVenta — Listado Detallado de Características (Benchmark)

Fecha de análisis: 27 de agosto de 2026  
Versión del código: 0.1.0  
Total de archivos fuente: ~2,378  
Líneas de código relevantes (archivos priorizados): ~4,022

---

## 1. STACK TECNOLÓGICO

### Frontend
| Componente | Tecnología | Versión |
|---|---|---|
| Framework UI | React | 18.3.1 |
| Bundler/Tooling | Create React App (react-app-rewired) | 5.0.1 |
| UI Library | Material UI (MUI) | 5.18.0 |
| Gráficas | MUI X Charts | 6.19.8 |
| Data Grid | MUI X Data Grid | 6.20.4 |
| Estado global | Redux | 5.0.1 |
| Bindings Redux | react-redux | 9.1.2 |
| Selectores memoizados | reselect | 5.1.1 |
| Estado del servidor | @tanstack/react-query | 5.90.21 |
| Routing | react-router-dom | 6.26.2 |
| HTTP Client | axios | 1.7.7 |
| Alertas | sweetalert2 | 11.14.4 |
| Exportación Excel | xlsx (SheetJS) | 0.18.5 |
| Pagos online | @mercadopago/sdk-js | 0.0.3 |

### Backend (referenciado en el código)
| Componente | Tecnología |
|---|---|
| API | Django REST Framework |
| Tiempo real | Django Channels (WebSocket) |
| Tareas asíncronas | Celery |
| Autenticación | Token Auth (DRF) |
| Hosting | Render (se detecta endpoint de redeploy) |

---

## 2. ARQUITECTURA FRONTEND

### 2.1. Patrones de diseño implementados

| Patrón | Implementación | Archivo(s) |
|---|---|---|
| **API Factory** | `createApiService()` genera CRUD completo (getAll, getById, create, update, delete, deleteMany) para cualquier recurso | `src/api/apiFactory.js` |
| **Multi-Cart Redux** | Sistema de múltiples carritos simultáneos con IDs, creación/cierre/switch | `src/redux/cart/multiCartReducer.js` |
| **Custom Hooks** | 30+ hooks especializados encapsulando lógica de negocio | `src/hooks/` |
| **Mutation Factory** | `createMutationHooks()` genera useCreate/useUpdate/useDelete con React Query | `src/hooks/useCrudMutation.js` |
| **Lazy Loading con Retry** | `lazyRetry()` wrapper que recarga la página si falla un chunk | `src/App.js` |
| **Memoized Selectors** | createSelector de reselect para derivar datos del store | `src/redux/cart/selectors.js` |
| **User Context** | Context API para estado de autenticación (login/logout/updateUser) | `src/context/UserContext.js` |
| **Centralized HTTP** | Axios con interceptores para auth, store-id header, logging, y redirect 401 | `src/api/httpClient.js` |
| **Error Boundary** | Componente class que atrapa errores de render y permite recargar | `src/components/ui/ErrorBoundary.jsx` |

### 2.2. Rutas (40 rutas definidas)

| Ruta | Componente | Acceso |
|---|---|---|
| `/vender/` | SaleCreate | Tienda |
| `/ventas/` | SaleList | No seller |
| `/apartados/` | ReservationList | Todos |
| `/importar-ventas/` | SaleImport | No seller |
| `/corte-caja/` | CashSummary | No seller |
| `/movimientos-caja/` | CashFlowList | No seller |
| `/distribuciones/` | DistributionList | No seller |
| `/conversiones/` | ConversionList | No seller |
| `/traspasos/` | TransferList | No seller |
| `/solicitudes-ajustes-stock/` | StockUpdateRequestList | No seller |
| `/historial-precios/` | PriceLogsList | No seller |
| `/clientes/` | ClientList | No seller |
| `/productos/` | ProductList | No seller |
| `/inventario/` | StoreProductList | Todos |
| `/auditoria-inventario/` | ProductAuditList | No seller |
| `/marcas/` | BrandList | No seller |
| `/departamentos/` | DepartmentList | No seller |
| `/historial-stock/` | LogList | No seller |
| `/pagos/` | TenantPaymentList | Owner |
| `/suscripciones/` | SubscriptionList | Owner |
| `/mi-plan-actual/` | MyCurrentPlan | Owner |
| `/vendedores/` | SellerList | Owner/Admin |
| `/servicios/` | ServiceList | Owner |
| `/tablero-ventas/` | Dashboard | Owner (horario restringido) |
| `/tablero-ventas-ajustadas-cancelaciones/` | CancellationsDashboard | Owner |
| `/tablero-verificacion-stock/` | StockVerificationDashboard | Owner |
| `/tablero-traspasos-pendientes/` | PendingTransfersDashboard | Owner |
| `/tablero-productos/` | ProductsDashboard | Owner |
| `/reasignacion/` | ProductReassign | No seller |
| `/importar-productos/` | ProductImport | No seller |
| `/importar-inventario/` | StoreProductImport | No seller |
| `/auditoria-transacciones/` | TransactionAudit | Owner |
| `/auditoria-productos/` | ProductAudit | Owner |
| `/sincronizar/` | RestartService | Owner |
| `/perfil/` | Profile | Todos |
| `/tiendas/` | StoreList | Owner |
| `/distribuir/` | SaleCreate (modo almacén) | Almacén |
| `/registrarme/` | Registration | Público |
| `*` (default con tienda) | SaleCreate | Todos |
| `*` (default sin tienda) | StoreList | Owner |

---

## 3. PUNTO DE VENTA (POS)

### 3.1. Búsqueda de Productos

| Característica | Detalle |
|---|---|
| Búsqueda por código de barras | Instantánea al presionar Enter. Atajo: Ctrl+Q |
| Búsqueda por nombre/marca | Con debounce de 300ms. Atajo: Ctrl+W |
| Timeout y reintentos | Máximo 8 segundos, 1 reintento automático |
| Indicador de búsqueda | LinearProgress visible mientras busca |
| Producto no encontrado | Ofrece crear producto nuevo si `create_products_on_sale` está habilitado |
| Lista de resultados | Tabla con código, marca, nombre, stock, precios (menudeo/mayoreo) |
| Acciones en resultados | Agregar al carrito, ver stock en todas las tiendas, ver imagen del producto |
| Mantener lista abierta | Pin toggle para no cerrar lista al agregar (modo manual) |
| Enfoque automático | Input se enfoca automáticamente al montar. Atajo: Ctrl+B |
| Métricas de búsqueda | `logSearchTiming()` almacena tiempos en localStorage para análisis |
| Indicador visual de enfoque | Ícono Edit/EditOff según si el input tiene foco |

### 3.2. Multi-Carrito

| Característica | Detalle |
|---|---|
| Carritos simultáneos | Ilimitados, representados como tabs |
| Crear carrito | Botón "+" en tabs (solo en modo Venta) |
| Cerrar carrito | Botón X en cada tab (mínimo 1 carrito siempre existe) |
| Cambiar carrito | Click en tab |
| Nombre dinámico | Muestra nombre del cliente o tipo de movimiento + ID + (cantidad items) |
| Estado independiente | Cada carrito tiene su propio array de productos, cliente, y tipo de movimiento |
| Reserva cruzada | Stock se reserva entre carritos — no se puede vender más de lo disponible entre todos los carritos |
| Persistencia | Redux store (persiste mientras la app esté abierta) |

### 3.3. Tipos de Operación (desde una sola pantalla)

| Tipo | Atajo | Descripción |
|---|---|---|
| Venta | Ctrl+E | Venta normal con cobro |
| Distribución | Ctrl+T | Envío de almacén a tienda(s) |
| Confirmar traspaso | Ctrl+R | Confirma recepción de mercancía |
| Agregar a inventario | Ctrl+Y | Incrementa stock sin validación de límite |
| Checar precio | Ctrl+U | Solo muestra precio, no agrega al carrito |
| Apartado | Ctrl+I | Reserva con anticipo parcial |

### 3.4. Carrito de Venta

| Característica | Detalle |
|---|---|
| Columnas | Código, Marca, Nombre, Venta por, Cantidad, Stock, Precio, Subtotal, Aplicar mayoreo, Borrar |
| Precio automático de mayoreo | Si cantidad >= min_wholesale_quantity → precio mayoreo se aplica auto |
| Toggle mayoreo manual | Checkbox para forzar precio mayoreo/unitario |
| Cálculo de total | Suma de (precio × cantidad) de todos los items |
| Contador de productos | Suma de cantidades (KG cuenta como 1 unidad por item) |
| Botón cobrar | "Cobrar (Ctrl+P)" visible cuando hay items |
| Auto-focus en cantidad | Último producto agregado recibe foco en distribución/agregar |

### 3.5. Venta por KG (Productos a granel)

| Característica | Detalle |
|---|---|
| Modos de venta | Ciclo: Kilo → Fracción → Pesos ($) |
| Modo Kilo | Cantidad entera, incremento de 1 |
| Modo Fracción | Decimales hasta 3 posiciones, incremento de 0.1 |
| Modo Pesos ($) | Usuario ingresa monto en pesos, sistema calcula kg automáticamente |
| Indicador visual | Botón con ícono (balanza/$) coloreado si está en modo especial |
| Subtotal dinámico | En modo $: muestra input editable con $; en otros: muestra cálculo |

### 3.6. Precios Dinámicos

| Característica | Detalle |
|---|---|
| Precio unitario | Precio base para 1 unidad |
| Precio mayoreo | Precio reducido automático al alcanzar min_wholesale_quantity |
| Descuento por cliente | Si hay cliente con discount_percentage_complement, se aplica al total |
| Lógica de prioridad | Si cliente tiene descuento y `wholesale_price_on_client_discount` es false → siempre unitario |
| Toggle manual | El vendedor puede forzar precio mayoreo con checkbox |
| Recalcular al agregar/quitar cliente | Al añadir/remover cliente, todos los precios del carrito se recalculan |

### 3.7. Reservas Inteligentes de Stock

| Característica | Detalle |
|---|---|
| Cálculo cross-cart | `getReservedStock()` suma cantidades del mismo producto en TODOS los carritos |
| Stock disponible real | Stock de la tienda - reservado en otros carritos = disponible |
| Validación en ventas | Permite exceder stock (soft limit, muestra modal de stock) |
| Validación en traspasos/distribuciones | Hard limit — no permite exceder stock disponible |
| Modo agregar stock | Sin validación de límite superior |
| Warning visual | `showWarning()` cuando no hay stock disponible por otros carritos |

---

## 4. MODAL DE COBRO / PAGO

### 4.1. Funcionalidades

| Característica | Detalle |
|---|---|
| Métodos de pago | Efectivo (EF), Tarjeta (TA), Transferencia (TR) |
| Pago único | Radio button — un solo método cubre el total |
| Pago combinado | Checkboxes — múltiples métodos, se ingresan montos individuales |
| Cálculo de cambio | `paidWith - total = change` (en efectivo) |
| Referencia de pago | Campo obligatorio si método es TA o TR |
| Devolución/intercambio | Permite buscar una venta anterior para aplicar crédito |
| Descuento por cliente | Muestra total original y total con descuento |
| Validación de cierre | No permite finalizar si montos no cuadran |
| Prevención de doble envío | `isSubmittingRef` lock impide reenvío |
| Atajo Ctrl+G | Finaliza venta e imprime (si hay impresora) |

### 4.2. Apartados

| Característica | Detalle |
|---|---|
| Anticipo parcial | El cliente paga menos que el total (máximo total - 1) |
| Cliente obligatorio | No se puede crear apartado sin cliente |
| Método de pago del anticipo | Se registra (EF/TA/TR) |
| Alert informativo | "El cliente paga un anticipo. El resto se liquida después." |

### 4.3. Gestión de Clientes en Cobro

| Característica | Detalle |
|---|---|
| Buscar cliente | Componente SearchClient integrado |
| Crear cliente nuevo | Modal ClientModal desde el cobro |
| Atajo Ctrl+J | Seleccionar cliente |
| Atajo Ctrl+O | Quitar cliente del carrito |
| Descuento automático | Se aplica `discount_percentage_complement` al total |

---

## 5. IMPRESIÓN DE TICKETS

| Característica | Detalle |
|---|---|
| Servidor de impresora | Servicio separado en `REACT_APP_PRINTER_URL` |
| Test de conexión | `testPrinterConnection()` con timeout de 3s |
| Indicador visual | Ícono verde (conectada) / rojo (desconectada) en toolbar |
| Impresión de ticket | Envía datos al endpoint de impresora vía POST |
| Impresión después de venta | Si hay impresora configurada, imprime automáticamente |
| Test manual | Botón para probar impresión |
| Error handling | Warning si impresora no responde, con mensaje descriptivo |
| Impresoras soportadas | Térmicas estándar (recomendada: Epson TM-88V) |

---

## 6. GESTIÓN DE TIENDAS Y ALMACENES

| Característica | Detalle |
|---|---|
| Tipos de ubicación | Tienda (T) y Almacén (A) |
| Panel centralizado | StoreList con DataTable mostrando todas las tiendas |
| Resumen de ventas | Por tienda, por rango de fechas, por departamento |
| Inversión por tienda | Cálculo del valor total del inventario |
| Crear tienda | Modal CreateStoreModal |
| Validación de plan | `canCreateStore()` verifica si el plan permite más tiendas |
| Cambio de tienda | Click en tienda navega al contexto de esa tienda |
| Volver a panel | Botón ArrowBack en AppBar limpia carrito y regresa a tiendas |
| Reset de stock | `resetStoreStock()` (operación peligrosa) |
| Indicador de catálogo | Se detecta qué tiendas tienen catálogo completo |
| Filtros | Por tipo de tienda, departamento, fecha |

---

## 7. INVENTARIO

### 7.1. Stock

| Característica | Detalle |
|---|---|
| Vista unificada | StoreProductList muestra stock por tienda |
| Stock disponible | `available_stock` (libre para venta) |
| Stock apartado | `reserved_stock` (en traspasos pendientes) |
| Stock total | available_stock + reserved_stock |
| Agregar stock rápido | Desde el POS (tipo operación "Agregar a inventario") |
| Modal de stock | Ver stock en todas las tiendas para un producto |
| Unidades soportadas | PZ (Pieza), KG (Kilogramo), Costal, Litro, Metro, Rollo, Caja |

### 7.2. Solicitudes de Ajuste de Stock

| Característica | Detalle |
|---|---|
| Crear solicitud | Vendedor/Admin solicita cambio de stock |
| Modal de solicitud | Campo con cantidad solicitada |
| Lista de solicitudes | DataTable con estado y acciones |
| Aprobar/Rechazar | Owner puede confirmar o eliminar solicitud |
| Notificación en toolbar | Badge con conteo de solicitudes pendientes |
| Confirmación | SweetAlert2 antes de aplicar |

### 7.3. Historial de Stock (Logs)

| Característica | Detalle |
|---|---|
| Página dedicada | `/historial-stock/` |
| Tipos de movimiento | Venta, traspaso, distribución, agregar, ajuste |
| Filtros por tipo | Choices del backend |
| Endpoint | `store-product-logs` |

### 7.4. Auditoría de Inventario

| Característica | Detalle |
|---|---|
| Ruta | `/auditoria-inventario/` |
| Componente | StoreProductAuditList |
| Funcionalidad | Modal interactivo para confirmar o modificar stock de productos marcados |

---

## 8. TRASPASOS Y DISTRIBUCIONES

### 8.1. Traspasos (Tienda ↔ Tienda)

| Característica | Detalle |
|---|---|
| Crear traspaso | Desde el POS con tipo "Confirmar traspaso" |
| Confirmar recepción | Escanea productos, selecciona destino, confirma |
| Doble confirmación destino | Dos selects: destino + confirmación de destino (deben coincidir) |
| Lista de traspasos | DataTable con filtros |
| Editar traspaso | PATCH al endpoint |
| Eliminar traspaso | DELETE al endpoint |
| Dashboard de pendientes | `/tablero-traspasos-pendientes/` con gráficas |

### 8.2. Distribuciones (Almacén → Tiendas)

| Característica | Detalle |
|---|---|
| Crear distribución | Desde el POS en modo almacén |
| Stock en otras tiendas | `getStockOtherStores()` muestra stock general al agregar producto |
| Columna "Stock General" | Lista de tiendas con su stock para cada producto |
| Confirmar distribución | Endpoint separado `distribution/confirm` |
| Lista de distribuciones | DataTable |
| Eliminar distribución | DELETE por ID |
| Auto-focus en cantidad | Último producto recibe foco para edición rápida |

---

## 9. CONVERSIONES DE PRODUCTO

| Característica | Detalle |
|---|---|
| CRUD completo | Crear, editar, eliminar conversiones |
| Aplicar conversión | `applyConversion()` ejecuta desempaque |
| Unidades disponibles | Endpoint `products/units` retorna opciones |
| React Query | Cache con queryKey `['conversions']` |
| Invalidación automática | Al crear/editar/eliminar se invalida cache |
| Mensaje de éxito | "Conversión aplicada correctamente" |

---

## 10. GESTIÓN DE CLIENTES

| Característica | Detalle |
|---|---|
| CRUD | Crear, listar, editar (via apiFactory) |
| Búsqueda en venta | SearchClient integrado en PaymentModal |
| Descuento personalizado | `discount_percentage_complement` por cliente |
| Modal de descuento | DiscountModal para configurar % |
| Historial de compras | Vinculado a ventas |
| Selección en carrito | Atajo Ctrl+J |
| Remover de carrito | Atajo Ctrl+O |

---

## 11. CORTE DE CAJA Y MOVIMIENTOS

### 11.1. Corte de Caja

| Característica | Detalle |
|---|---|
| Endpoint | `cash/summary` con parámetro de fecha |
| Desglose | Por método de pago (EF, TA, TR) |
| Filtro por fecha | Consulta cualquier día |
| Ruta | `/corte-caja/` |

### 11.2. Movimientos de Caja

| Característica | Detalle |
|---|---|
| CRUD completo | Crear, listar, editar, eliminar (cashFlowService) |
| Tipos de movimiento | Choices del backend (`cash-flow/choices`) |
| Ruta | `/movimientos-caja/` |

### 11.3. Resumen Multi-Tienda

| Característica | Detalle |
|---|---|
| Endpoint | `stores-cash-summary` |
| Vista consolidada | En panel de tiendas con totales por tienda |

---

## 12. VENTAS

### 12.1. Historial de Ventas

| Característica | Detalle |
|---|---|
| Lista paginada | DataTable con getSales |
| Filtros | Por fecha, estado, búsqueda |
| Detalle de venta | SaleModal con productos vendidos |
| Reimprimir ticket | Botón Print por venta |
| Hover preview | Popper que muestra productos al pasar el mouse |
| Editar pago | PaymentEditModal para modificar método de pago |
| Indicadores visuales | Íconos para cancelada, con devolución, exitosa |

### 12.2. Cancelaciones y Devoluciones

| Característica | Detalle |
|---|---|
| Cancelación total | Anula toda la venta con motivo |
| Devolución parcial | Selecciona cantidad a devolver por producto |
| Motivo obligatorio | Campo de texto para registrar razón |
| Auto-detección | Si se devuelve todo → marca cancelación total automáticamente |
| Apartados | Solo permiten cancelación total |
| Hook dedicado | `useCancelSale()` |

### 12.3. Importación de Ventas

| Característica | Detalle |
|---|---|
| Validación previa | `importSalesValidation()` verifica archivo antes de importar |
| Importación | `importSales()` ejecuta la carga |
| Formato | Excel con FormData multipart |

---

## 13. PRODUCTOS

### 13.1. Gestión de Productos

| Característica | Detalle |
|---|---|
| CRUD | Crear, listar, editar |
| Eliminación masiva | `deleteProducts()` |
| Campos | Código, nombre, marca, departamento, precio unitario, precio mayoreo, cantidad mínima mayoreo, costo, unidad, imagen |
| Imagen de producto | Upload con manejo de FormData, se omite si es string (ya subida) |
| Null safety | wholesale_price y min_wholesale_quantity se envían como null si están vacíos |
| Crear desde búsqueda | Si producto no existe y config lo permite → modal de creación pre-lleno con código |

### 13.2. Importación Masiva

| Característica | Detalle |
|---|---|
| Importar productos | Validación + importación en 2 pasos |
| Importar inventario | Endpoint separado para stock por tienda |
| Incluir cantidad | `getImportCanIncludeQuantity()` verifica si se puede importar con stock |
| Formato | Excel vía FormData |
| DropZone | Componente styled para drag & drop de archivos |

### 13.3. Actualización Masiva de Precios

| Característica | Detalle |
|---|---|
| Endpoint | `products/update-prices` |
| Selección múltiple | Se envía array de IDs |
| Campos actualizables | Costo, precio unitario, precio mayoreo |

### 13.4. Reasignación de Productos

| Característica | Detalle |
|---|---|
| Endpoint | `products/reassign` |
| Funcionalidad | Cambiar marca/departamento de múltiples productos a la vez |
| Ruta | `/reasignacion/` |

### 13.5. Historial de Precios

| Característica | Detalle |
|---|---|
| Endpoint | `product-price-logs` |
| Vista | Lista de cambios de precio por producto |
| Ruta | `/historial-precios/` |
| Modal dedicado | PriceLogsModal para ver historial de un producto específico |

### 13.6. Normalización de Códigos

| Característica | Detalle |
|---|---|
| Endpoint | `products/upper-code` |
| Funcionalidad | Convierte códigos de producto a mayúsculas |

---

## 14. CATÁLOGO (Marcas, Departamentos, Vendedores)

| Recurso | CRUD | Factory |
|---|---|---|
| Marcas | Sí (apiFactory) | `createApiService("brand")` |
| Departamentos | Sí (apiFactory) | `createApiService("department")` |
| Vendedores/Sellers | Sí (apiFactory) | `createApiService("seller")` |
| Descuentos | Sí (apiFactory) | `createApiService("discount")` |
| Clientes | Sí (apiFactory) | `createApiService("client")` |

Cada uno con:
- Lista con DataTable
- Modal de creación/edición
- Hook useCreate/useUpdate/useDelete via createMutationHooks

---

## 15. TABLEROS DE ANÁLISIS (DASHBOARDS)

### 15.1. Dashboard de Ventas Exitosas

| Característica | Detalle |
|---|---|
| Procesamiento | Tarea asíncrona Celery con polling cada 10 segundos |
| KPIs | Total ventas, monto total, ticket promedio, hora pico, mejor/peor tienda, mejor/peor día |
| Gráfica de tendencia | LineChart con ventas por día |
| Gráfica de dona | DoughnutChart (distribución por tienda, método de pago) |
| Heatmap | SalesHeatmap: 7 días × 24 horas con colores por intensidad |
| Ticket promedio | AvgTicketChart |
| Gráfica de barras | BarChart de MUI X Charts |
| Línea de referencia | ChartsReferenceLine (promedio) |
| Filtros | Año, mes, tipo de métrica (conteo vs monto) |
| Tipo de gráfica | Toggle line/bar |
| Countdown | Timer visual mostrando segundos hasta próximo refresh |
| Progress bar | Porcentaje de avance de la tarea Celery |
| Restricción horaria | Solo disponible antes de 10 AM y después de 9 PM (si tiene más de 1 tienda) |
| Multi-tienda heatmap | Un heatmap por tienda con colores diferentes |

### 15.2. Dashboard de Cancelaciones

| Característica | Detalle |
|---|---|
| KPIs | Total canceladas, total devueltas, monto perdido, % de cancelación |
| Separación | Cancelaciones vs devoluciones |
| Gráficas | Línea/barra + dona |
| Filtros | Año, mes, métrica |
| Task async | Celery con polling |

### 15.3. Dashboard de Verificación de Stock

| Característica | Detalle |
|---|---|
| Funcionalidad | Detecta discrepancias de stock |
| DataTable | Código, producto, marca, stock, tienda |
| Exportación | Descarga Excel |
| Dona | Distribución por tienda |
| Task async | Celery con polling |

### 15.4. Dashboard de Traspasos Pendientes

| Característica | Detalle |
|---|---|
| Funcionalidad | Muestra traspasos no confirmados |
| Columnas | Fecha, tienda solicitante, tienda proveedora, producto, marca, cantidad |
| Gráfica de barras | Agrupación visual |
| Exportación | Excel |
| Task async | Celery con polling |

### 15.5. Dashboard de Productos y Marcas

| Característica | Detalle |
|---|---|
| Top marcas | Tabla con marca, productos, % de ventas |
| Top productos | Tabla con código, nombre, marca, % de ventas |
| Filtros | Año, mes, tienda |
| Task async | Celery con polling |

---

## 16. AUDITORÍA

### 16.1. Auditoría de Transacciones

| Característica | Detalle |
|---|---|
| Endpoint | `sales-logs-audit` |
| Funcionalidad | Detecta ventas duplicadas, inconsistencias en logs |
| Filtro | Por rango de fechas |
| Ruta | `/auditoria-transacciones/` |

### 16.2. Auditoría de Stock

| Característica | Detalle |
|---|---|
| Endpoint | `stock-audit` |
| Funcionalidad | Detecta discrepancias entre stock registrado y movimientos |

### 16.3. Auditoría de Productos

| Característica | Detalle |
|---|---|
| Endpoint | `product-audit` + `product-audit-activity` |
| Funcionalidad | Códigos duplicados, precios faltantes, productos sin movimiento |
| Ruta | `/auditoria-productos/` |

### 16.4. Auditoría de Inventario Interactiva

| Característica | Detalle |
|---|---|
| Ruta | `/auditoria-inventario/` |
| Componente | StoreProductAuditList |
| Funcionalidad | Modal para confirmar o modificar stock de productos marcados |

---

## 17. NOTIFICACIONES EN TIEMPO REAL

| Característica | Detalle |
|---|---|
| Protocolo | WebSocket (ws:// / wss://) |
| Conexión | Token auth + store_id como query params |
| Reconexión | Exponential backoff (hasta 30s), máximo 5 intentos |
| Fallback | Polling HTTP cada 60 segundos si WS falla |
| Horario activo | 8 AM a 9 PM |
| Eventos soportados | transfer_created, transfer_confirmed, distribution_created, distribution_confirmed, stock_request_created, stock_request_approved, reservation_created |
| UI | Badge con contador en campana, Popover con lista, botón "Limpiar" |
| Reconexión por cambio de tienda | Event listener en `store-changed` |

---

## 18. INDICADORES EN TOOLBAR

| Indicador | Componente | Funcionalidad |
|---|---|---|
| Notificaciones | NotificationsMenu | WebSocket real-time + badge |
| Pendientes | PendingMenu | Traspasos pendientes agrupados por período |
| Ventas duplicadas | DuplicateSalesMenu | Alertas de posibles duplicados |
| Solicitudes de ajuste | StockRequestMenu | Conteo por tienda |
| Ayuda contextual | PageHelp | Texto explicativo por página actual |
| Tema claro/oscuro | IconButton | Toggle con persistencia en localStorage |
| Volver a tiendas | ArrowBack | Solo visible para owners dentro de una tienda |

---

## 19. ROLES Y PERMISOS

| Rol | Menú disponible | Restricciones |
|---|---|---|
| **Owner** | Todos los menús + panel "G" (general) | Sin restricciones |
| **Admin** | Menú de tienda completo | No ve tableros generales, no gestiona suscripciones |
| **Seller (Vendedor)** | Solo: Vender, Ventas, Apartados, Movimientos en caja, Traspasos | No ve productos, inventario, auditoría, clientes, caja |

Implementación:
- `user.role` determina visibilidad (`hidden: user.role === "seller"`)
- Menú diferenciado por `store_type`: T (tienda), A (almacén), G (global/owner sin tienda)
- Dashboard restringido por horario para owners con múltiples tiendas

---

## 20. SISTEMA DE SUSCRIPCIONES Y PAGOS

| Característica | Detalle |
|---|---|
| Plan actual | Endpoint `current-plan` |
| Plan equivalente | Endpoint `plan-equivalent` |
| Crear suscripción | `subscriptions/create` |
| Listar suscripciones | `subscriptions` |
| Historial de pagos | PaymentService via apiFactory("payment") |
| MercadoPago | Integración con Bricks SDK para pagos con tarjeta |
| CardPayment Brick | Formulario de pago inline con token, email, installments |
| Preferencia de pago | `createMercadoPagoPreference(planId)` |
| Estado de pago | `getMercadoPagoStatus(preferenceId)` |
| Validación de tiendas | `canCreateStore()` valida contra el plan |

---

## 21. REGISTRO DE TENANT (ONBOARDING)

| Característica | Detalle |
|---|---|
| Ruta pública | `/registrarme/` |
| Verificar disponibilidad | `checkTenantExists(short_name)` |
| Planes disponibles | `getAvailablePlans()` |
| Crear negocio | `createTenant(data)` |
| Auth pública | API Key en header `X-API-Key` |
| Validaciones | Short name, teléfono (min 10), email único, nombre requerido |
| Mensajes de error | Parser dedicado para errores 400 |
| Estilos propios | Registration.styles.js con diseño de landing |

---

## 22. GESTIÓN DE USUARIOS

| Característica | Detalle |
|---|---|
| Ver perfil | GET `user/{id}` |
| Editar usuario | PATCH `user/{id}` |
| Cambiar contraseña | POST `user/change_password` |
| Modales | EditUserModal + ChangePasswordModal |
| Toggle visibilidad password | Por campo (actual, nueva, confirmar) |
| Logout | Limpia localStorage, redirige a login |
| Login | POST `api-token-auth` con username/password |
| Página de perfil | `/perfil/` |

---

## 23. INTERFAZ Y UX

### 23.1. Tema Visual

| Característica | Detalle |
|---|---|
| Modo claro/oscuro | Toggle con persistencia en localStorage |
| Paleta primaria | #04346b (main), #065a9e (light), #022347 (dark) |
| Acento | #a78bfa (violeta) |
| Tipografía | Inter, sans-serif |
| Border radius | 6-10px según componente |
| Transiciones | 0.15-0.3s cubic-bezier |
| Gradiente AppBar | 135deg de #04346b a #065a9e |
| Gradiente Sidebar | 180deg de #04346b → #032a56 → #022347 |
| Sombras | Sutiles, máximo `0 4px 12px rgba(0,0,0,0.08)` |
| Customización MUI | 15 componentes con overrides globales |

### 23.2. Sidebar/Navegación

| Característica | Detalle |
|---|---|
| Tipo | Drawer permanente colapsable |
| Ancho abierto | 256px |
| Ancho cerrado | spacing(8) + 1px |
| Iconos por sección | 16 íconos Material mapped |
| Submenús | Collapse con animación |
| Item activo | Fondo accent semitransparente |
| Logo clickeable | Link a landing page |
| WhatsApp soporte | Botón prellenado con info del tenant |
| Scroll | Custom scrollbar 4px |

### 23.3. Componentes UI Reutilizables

| Componente | Archivo | Funcionalidad |
|---|---|---|
| PageHeader | `PageHeader.jsx` | Título + acciones en una fila |
| DataTable | `DataTable/` | Tabla avanzada con paginación, filtros |
| SimpleTable | `SimpleTable/` | Tabla simple sin paginación |
| CustomButton | `Button/` | Botón estilizado |
| CustomModal | `Modal/` | Dialog genérico |
| CustomTooltip | `Tooltip/` | Tooltip personalizado |
| DropZone | `DropZone.jsx` | Área de drag & drop para archivos |
| StatusChip | `StatusChip.jsx` | Chip coloreado por estado |
| Spinner | `Spinner/` | Overlay de carga |
| LoadingFallback | `LoadingFallback.jsx` | CircularProgress centrado |
| ErrorBoundary | `ErrorBoundary.jsx` | Catch de errores con recarga |
| CountdownTimer | `CountdownTimer.jsx` | Timer regresivo |
| VisuallyHiddenInput | `VisuallyHiddenInput.jsx` | Input oculto para upload |
| AuditCard | `AuditCard/` | Card para resultados de auditoría |
| Icons | `Icons/` | Íconos customizados |
| UpdatesModal | `UpdatesModal/` | Modal de novedades del sistema |
| UserModals | `UserModals/` | Editar usuario + cambiar contraseña |

### 23.4. Ayuda Contextual

| Característica | Detalle |
|---|---|
| Implementación | helpTexts.js con mapping ruta → {title, text} |
| Páginas cubiertas | 22 rutas con texto de ayuda |
| UI | Ícono "?" en AppBar, Popover con explicación |
| Solo visible | Si la ruta actual tiene texto de ayuda definido |

---

## 24. ATAJOS DE TECLADO

| Atajo | Acción |
|---|---|
| Ctrl+Q | Tipo de búsqueda: código de barras |
| Ctrl+W | Tipo de búsqueda: nombre/marca |
| Ctrl+E | Tipo operación: venta |
| Ctrl+R | Tipo operación: confirmar traspaso |
| Ctrl+T | Tipo operación: distribución |
| Ctrl+Y | Tipo operación: agregar a inventario |
| Ctrl+U | Tipo operación: checar precio |
| Ctrl+I | Tipo operación: apartado |
| Ctrl+B | Enfocar input de búsqueda |
| Ctrl+P | Abrir modal de cobro |
| Ctrl+G | Finalizar venta e imprimir |
| Ctrl+J | Seleccionar cliente |
| Ctrl+O | Quitar cliente del carrito |
| Arrow Up/Down | Incrementar/decrementar cantidad en celda |
| Enter (en distribución) | Regresa foco al input de búsqueda |

---

## 25. OPTIMIZACIONES DE RENDIMIENTO

| Optimización | Detalle |
|---|---|
| Lazy loading | 36 rutas con React.lazy + Suspense |
| lazyRetry | Si chunk falla → recarga la página |
| React Query staleTime | 5 minutos por defecto |
| refetchOnWindowFocus | Desactivado |
| Retry | 1 reintento en queries |
| Memoized selectors | createSelector para derivar datos del store |
| useMemo en columnas | Columnas de tabla memoizadas |
| memo en componentes | NotificationsMenu, PendingMenu, DuplicateSalesMenu, StockRequestMenu, PageHelp |
| Keep-alive | Ping al servidor cada 3 minutos |
| AbortController | Timeout con señal abort para búsquedas |
| Logger condicional | Solo en desarrollo |
| User data cache | `getUserData()` con caché por referencia de raw string |
| HTTP timeout | 60 segundos global |

---

## 26. EXPORTACIÓN DE DATOS

| Característica | Detalle |
|---|---|
| Librería | xlsx (SheetJS) |
| Formato | .xlsx |
| Nombre de archivo | `{prefijo} {fecha}.xlsx` |
| Disponible en | Corte de caja, dashboards de verificación, traspasos pendientes |
| Helper | `exportToExcel(data, prefixName, use_today)` |

---

## 27. SERVICIOS / OPERACIONES ADMINISTRATIVAS

| Servicio | Detalle |
|---|---|
| Sincronizar/Reiniciar | Trigger de redeploy en Render |
| Ruta | `/sincronizar/` |
| Servicios adicionales | `/servicios/` — info de servicios extras disponibles |
| Soporte WhatsApp | Botón prellenado con tenant + tienda en sidebar |

---

## 28. SEGURIDAD

| Mecanismo | Detalle |
|---|---|
| Autenticación | Token-based (DRF Token Auth) |
| Header Authorization | `Token {token}` |
| Header store-id | Se envía en cada request |
| Redirect 401 | Limpia localStorage y redirige a /login |
| API Key pública | Solo para endpoints de registro |
| Roles en frontend | Filtrado de menú y rutas por rol |
| Prevención doble submit | useRef lock en operaciones críticas |
| Sanitización código barras | Reemplaza `'` por `-` en input |

---

## 29. CONFIGURACIÓN Y ENTORNO

| Variable | Uso |
|---|---|
| `REACT_APP_API_URL` | Base URL del backend |
| `REACT_APP_PRINTER_URL` | URL del servicio de impresión |
| `REACT_APP_API_URL_KEY` | API Key para registro público |
| `REACT_APP_MERCADO_PAGO_PUBLIC_KEY` | Public key de MercadoPago |
| `REACT_APP_WHATSAPP_NUMBER` | Número de soporte WhatsApp |

---

## 30. MÉTRICAS Y MONITOREO (FRONTEND)

| Métrica | Detalle |
|---|---|
| Search timing | Almacena tiempos de búsqueda por bucket en localStorage |
| Búsquedas > 8s | Registra códigos que tardaron más de 8 segundos |
| Logger | Logs info/warn/error solo en desarrollo |
| API timing | `timedRequest()` mide duración de requests y reporta fallos |
| web-vitals | Librería incluida para métricas de rendimiento |

---

## RESUMEN CUANTITATIVO

| Métrica | Valor |
|---|---|
| Archivos totales del proyecto | ~2,378 |
| Rutas del frontend | 40 |
| Hooks personalizados | 30+ |
| Endpoints API consumidos | ~60+ |
| Componentes de página | 36 (lazy loaded) |
| Componentes UI reutilizables | 17+ |
| Atajos de teclado | 15 |
| Dashboards de análisis | 5 |
| Eventos WebSocket | 7 tipos |
| Indicadores en toolbar | 6 |
| Tipos de operación POS | 6 |
| Roles de usuario | 3 |
| Métodos de pago | 3 |
| Tipos de tienda | 2 |
| Variables de entorno | 5 |
