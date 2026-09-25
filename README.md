# SmartVenta — Sistema de Punto de Venta Multi-Tienda

> Última actualización: 24 de septiembre de 2026
> 

Sistema de punto de venta (POS) diseñado para negocios con múltiples sucursales. Permite gestionar ventas, inventario, traspasos y distribuciones desde una sola plataforma, con visibilidad en tiempo real de todas las tiendas y almacenes.

---

## ¿Para quién es SmartVenta?

Negocios minoristas y mayoristas que operan con varias tiendas y/o almacenes, y necesitan control centralizado de su operación sin depender de software costoso o complicado.

---

## ✨ Funcionalidades Principales

Estas son las características que te interesan como dueño de tu negocio:

### 💰 Punto de Venta Rápido y Versátil

- **Búsqueda instantánea** por código de barras o nombre de producto
- **Sugerencias al escribir** — Autocompletado al buscar por nombre o marca
- **Búsqueda visual** — Explora los resultados en un carrusel con imágenes y datos de los productos
- **Escáner con cámara** — Lee códigos de barras desde la cámara del móvil
- **Crear producto desde búsqueda** — Si no se encuentra un producto, puedes crearlo directamente con stock inicial
- **Múltiples carritos simultáneos** — Atiende a varios clientes al mismo tiempo sin perder información
- **Precios dinámicos** — Precio unitario y precio mayoreo automático según cantidad
- **Venta por pesos (KG)** — Para productos por kilogramo, elige vender por kilo, fracción o monto en pesos ("Dame $20 de queso")
- **Una pantalla para todo** — Ventas, traspasos y distribuciones desde la misma interfaz
- **Atajos de teclado** — Ctrl+Q/W para buscar, Ctrl+K para búsqueda visual, Ctrl+E/R/T/Y/U/I para tipo de operación, Ctrl+B para enfocar búsqueda, Ctrl+J para seleccionar cliente
- **Impresión de tickets** — Compatible con impresoras térmicas estándar
- **Indicador de impresora en tiempo real** — Muestra el estado conectado/desconectado, recibe cambios mediante WebSocket y reintenta la conexión automáticamente
- **Interfaz móvil para vender** — Búsqueda, carrito y modal de pago adaptados a teléfonos y tabletas

### 🏪 Control Total de Todas tus Tiendas

- **Panel centralizado** — Administra todas tus tiendas y almacenes desde un solo lugar
- **Cambio instantáneo** — Pasa de una tienda a otra sin cerrar sesión
- **Indicador de catálogo** — Sabes qué tiendas tienen el catálogo completo y cuáles les faltan productos
- **Límite por plan** — El sistema valida automáticamente cuántas tiendas puedes crear según tu plan
- **Crear tienda rápido** — Botón siempre visible para agregar tiendas o almacenes

### 📦 Inventario en Tiempo Real

- **Stock unificado** — Consulta cuánto tienes en todas tus tiendas simultáneamente
- **Reservas inteligentes** — El sistema reserva productos entre carritos para evitar ventas duplicadas
- **Historial de stock** — Cada movimiento de inventario queda registrado (ventas, traspasos, ajustes)
- **Revisión de Stock** — Modal para consultar stock en otras tiendas y agregar stock directamente
- **Agregar stock durante la venta** — Acceso rápido para aumentar inventario
- **Unidad visible en inventario** — Columna de unidad (PZ, KG, Costal, etc.) en la tabla de inventario
- **Unidad visible en el carrito** — El stock disponible muestra su unidad de medida

### 🚚 Traslados Entre Tiendas

- **Traspasos** — Mueve mercancía de una tienda a otra con trazabilidad completa
- **Distribuciones** — Envía productos desde almacén a múltiples tiendas en una sola operación
- **Confirmación obligatoria** — Cada tienda confirma lo que recibe
- **Dashboard de pendientes** — Panel con traspasos pendientes separados por hoy y anteriores
- **Filtros por estado** — Filtra traspasos por pendientes o aplicados con actualización automática

### 🔄 Conversiones de Producto

- **Desempaque automático** — Convierte un producto en otro con un clic (ej: 1 Costal → 10 Kg)
- **Configuración única** — Define la equivalencia una sola vez por par de productos
- **Múltiples unidades** — Soporta Pieza, Kilogramo, Costal, Litro, Metro, Rollo y Caja
- **Trazabilidad** — Cada conversión queda registrada en la bitácora de stock
- **Acceso rápido** — Botón "Desempacar" directamente desde la tabla de conversiones

### 👥 Gestión de Clientes

- **Registro completo** — Historial de compras por cliente
- **Descuentos personalizados** — Aplica descuentos por porcentajes
- **Historial de compras** — Ve qué ha comprado cada cliente y cuándo

### 📊 Corte de Caja Inteligente

- **Resumen diario** — Ventas por método de pago (efectivo, tarjeta, transferencia)
- **Movimientos detallados** — Registra entradas y salidas de dinero
- **Exportación a Excel** — Descarga tu corte de caja con un clic
- **Corte parcial y total** — Consulta el estado actual o el cierre del día

### 📋 Sistema de Apartados

- **Apartados desde el POS** — Separa productos para un cliente sin cobrar el total
- **Reserva de stock** — Los productos apartados se descuentan del inventario disponible
- **Listado de apartados** — Consulta todos los apartados activos y su estado
- **Seguimiento por cliente** — Vincula apartados a clientes para control personalizado

### 🔄 Devoluciones y Cancelaciones

- **Cancelación total** — Cancela una venta completa con motivo registrado
- **Devolución parcial** — Devuelve solo algunos productos de una venta
- **Motivos documentados** — Todo queda registrado para análisis
- **Filtros rápidos** — Encuentra fácilmente ventas canceladas o con devolución

### 📈 Tableros de Análisis y Métricas

- **Tablero de ventas** — KPIs clave: mejor/peor tienda, mejor/peor día, hora pico, ticket promedio
- **Heatmap de ventas** — Visualiza cuándo y dónde se vende más
- **Análisis de cancelaciones** — Tablero dedicado a ventas canceladas y devueltas
- **Top de marcas y productos** — Qué productos y marcas venden más (y cuáles menos)
- **Gráficas de tendencia** — Consulta ventas por día del mes o por mes del año
- **Comparación por tienda** — Consulta ventas, ganancias, margen, ticket promedio y transacciones por sucursal
- **Métricas por periodo** — Alterna entre importes y número de transacciones; consulta promedios por día o mes y gráficas de líneas o barras

### 🔍 Auditoría Integrada

- **Detecta problemas automáticamente** — El sistema revisa tu información y te avisa:
  - Ventas duplicadas
  - Códigos de producto repetidos
  - Productos sin precio de mayoreo
  - Stock faltante en tiendas
  - Productos sin movimiento
  - Inconsistencias en registros
- **Auditoría de inventario dinámica** — Modal interactivo para confirmar o modificar stock con eliminación automática de productos revisados
- **Acceso configurable** — Restringe quién puede ver los tableros por horario

### 📋 Gestión de Productos

- **Importación masiva** — Carga miles de productos desde Excel en minutos
- **Plantillas descargables** — Formato listo para llenar
- **Validación previa** — El sistema revisa errores antes de importar
- **Errores paginados en importación** — Revisa por páginas las filas con errores detectadas durante la carga
- **Historial de precios** — Ve cómo ha cambiado el precio de cada producto
- **Actualización masiva de precios** — Actualiza costo, precio unitario y mayoreo de múltiples productos seleccionados a la vez
- **Imágenes de productos** — Agrega fotos a cada producto para identificación visual
- **Vistas de tabla y galería** — Cambia la presentación de Productos e Inventario; el navegador recuerda la preferencia
- **Filtros de catálogo** — Busca por código o nombre y filtra por marca, departamento y stock máximo

### 💳 Planes y Suscripciones

- **Consulta del plan actual** — Revisa el plan asignado, sus pagos y el estado de la suscripción
- **Tarjeta de pago** — Actualiza la tarjeta de una suscripción activa y recibe avisos cuando está próxima a vencer o falla un cobro
- **Renovación por vencimiento** — Si se suspende el acceso, el dueño puede entrar a las páginas de plan y pagos para renovarlo
- **Cancelación de suscripción** — El dueño puede registrar el motivo de baja; la cancelación corta el acceso y cierra las sesiones de los usuarios del negocio

### 🔐 Roles y Permisos

- **Tres niveles de acceso:**
  - **Dueño** — Acceso total a todo el sistema
  - **Administrador** — Gestión de tienda con algunas restricciones
  - **Vendedor** — Solo puede realizar ventas y operaciones básicas
- **Vistas personalizadas** — Cada rol ve solo lo que necesita

### 🌙 Interfaz Adaptable

- **Modo oscuro/claro** — Elige la apariencia que prefieras
- **Diseño intuitivo** — Interfaz moderna y fácil de usar
- **Navegación adaptable** — Barra superior y menú lateral ajustados a pantallas móviles, con acceso a cerrar sesión
- **Instalación en móvil** — La aplicación incluye un manifiesto y un ícono para instalarla desde un navegador compatible

### 📞 Soporte Integrado

- **WhatsApp directo** — Botón para contactar soporte con información de tu tienda prellenada
- **Ayuda contextual** — Botón de ayuda en cada página que explica qué puedes hacer ahí

### ⏰ Funcionalidades Operativas

- **Solicitudes de ajuste** — Vendedores y admins pueden pedir cambios de stock; el dueño aprueba o rechaza
- **Notificaciones en tiempo real** — Alertas instantáneas sobre traspasos, distribuciones y solicitudes
- **Indicador de ventas duplicadas** — Alerta visual cuando hay ventas duplicadas en el sistema
- **Aviso de conexión** — Muestra cuándo se pierde Internet y confirma cuando la conexión se restablece

---

## 🚀 Características SaaS (Extras que te Sorprenderán)

Estas características son estándar en software moderno pero marcan la diferencia:

### Rendimiento

- **Búsqueda ultrarrápida** — Respuesta en milisegundos, incluso con miles de productos

### Accesibilidad

- **Interfaz responsiva** — Funciona en pantallas de cualquier tamaño
- **Diseño visual consistente** — Colores, tipografía y espaciado uniformes
- **Feedback visual** — Indicadores claros de carga, éxito y errores

### Mantenimiento

- **Exportación a Excel** — Descarga reportes en Excel para análisis externo

---

## ⚙️ Características Internas (No para Marketing)

Estas características son parte de la arquitectura técnica y no deben mencionarse en materiales de marketing:

### Arquitectura del Sistema

- **Frontend:** React 18 con Create React App
- **UI:** Material UI (MUI) con tema personalizado y variables CSS
- **Estado global:** Redux con patrón multi-carrito
- **Estado del servidor:** React Query (@tanstack/react-query)
- **Routing:** React Router v6 con lazy loading
- **HTTP:** Cliente Axios centralizado
- **Backend:** API REST (Django/DRF)
- **Tiempo real:** WebSocket (Django Channels)
- **Impresora:** servicio local con estado por WebSocket y comprobación HTTP de respaldo
- **Tareas asíncronas:** Celery

### Patrones de Diseño

- **API Factory:** Patrón genérico para CRUD que reduce código repetitivo
- **Hooks personalizados:** `useFetch`, `useCrudMutation`, `useModal`, `useForm`, `useQueries`
- **Componentes compartidos:** `PageHeader`, `DropZone`, `VisuallyHiddenInput`, `StatusChip`
- **Caché configurable:** Tiempos de caché por tipo de dato (1 min a 1 hora)

### Seguridad (técnica)

- Autenticación por token
- Roles con permisos granulares
- Vistas y acciones filtradas por rol y tipo de tienda

### Optimizaciones

- **Lazy loading** — Carga de rutas bajo demanda
- **Polling de progreso** — Seguimiento de tareas asíncronas
- **Optimistic updates** — Actualización inmediata de UI
- **Imágenes WebP** — Recursos de interfaz en WebP y conversión de fotos de productos en el navegador cuando es compatible

---

## 📖 Diccionario de Términos

### Términos del Negocio

| Término | Definición |
|---------|------------|
| **Traspaso** | Movimiento de mercancía de una tienda a otra. Incluye trazabilidad completa desde que se envía hasta que se recibe. |
| **Distribución** | Operación donde un almacén envía productos a múltiples tiendas en una sola operación. Común para reabastecimiento. |
| **Venta** | Transacción donde un cliente adquiere productos. Puede ser en efectivo, tarjeta o transferencia. |
| **Devolución** | Proceso donde el cliente regresa uno o más productos de una venta previa. Puede ser parcial o total. |
| **Cancelación** | Anulación completa de una venta con registro del motivo. Diferente a devolución porque no implica retorno físico de productos. |
| **Corte de caja** | Resumen diario de movimientos de dinero en una tienda. Incluye ventas por método de pago y movimientos adicionales (entradas/salidas de efectivo). |
| **Ticket promedio** | Monto promedio de cada venta. Indicador clave de rendimiento. |
| **Inventario** | Conjunto de productos disponibles en una tienda o almacén. |
| **Stock** | Cantidad disponible de un producto específico. |
| **Catálogo** | Conjunto de productos disponibles para venta en una tienda. Puede estar incompleto si faltan productos. |
| **Almacén** | Ubicación central que almacena productos para distribución a tiendas. No es punto de venta directo. |
| **Tienda/Sucursal** | Punto de venta donde se atienden clientes directamente. |
| **Tenant** | Un negocio completo con sus tiendas, productos y usuarios. El sistema soporta múltiples tenants (negocios). |

### Términos Técnicos (para usuarios)

| Término | Definición |
|---------|------------|
| **Código de barras** | Identificador único de cada producto (código SKU). |
| **Precio unitario** | Precio de venta de un solo producto. |
| **Precio mayoreo** | Precio reducido cuando se compran múltiples unidades del mismo producto. |
| **Cantidad mínima mayoreo** | Número mínimo de unidades para aplicar el precio de mayoreo. |
| **Costo** | Precio que pagaste por el producto (para calcular ganancia). |
| **Ganancia** | Diferencia entre precio de venta y costo del producto. |
| **Descuento** | Reducción del precio final. Puede ser por cliente o general. |
| **Mensualidad** | Pago recurrente de un cliente (ej. membresías, servicios). |
| **Movimiento de caja** | Entrada o salida de dinero que no es venta (ej. retiro de efectivo, gasto). |
| **Venta duplicada** | Dos ventas del mismo producto al mismo cliente en poco tiempo (generalmente error). |

### Roles de Usuario

| Rol | Descripción |
|-----|-------------|
| **Dueño (Owner)** | Acceso total al sistema. Puede ver todos los tableros, ajustar stock, editar productos, gestionar usuarios. |
| **Administrador** | Gestiona una o más tiendas. Puede crear ventas, traspasos, distribuciones. No puede ajustar stock ni editar productos. |
| **Vendedor** | Rol más básico. Solo puede realizar ventas y operaciones básicas de atención al cliente. |

### Métodos de Pago

| Término | Definición |
|---------|------------|
| **Efectivo (EF)** | Pago en dinero en efectivo. |
| **Tarjeta (TA)** | Pago con tarjeta de débito o crédito. |
| **Transferencia (TR)** | Pago por transferencia bancaria. |

### Términos de Auditoría

| Término | Definición |
|---------|------------|
| **Auditoría de transacciones** | Revisión automática de ventas, logs y stock para detectar inconsistencias. |
| **Auditoría de productos** | Revisión del catálogo para detectar códigos repetidos, precios faltantes, productos sin movimiento. |
| **Discrepancia de stock** | Diferencia entre el stock registrado y el stock físico real. |
| **Log inconsistente** | Registro de movimiento que no coincide con otros registros relacionados. |

---

## 🛠️ Scripts Disponibles

Para trabajar con este frontend se necesita Node.js y npm, además de la API del sistema. Instala las dependencias con `npm ci`, copia `.env.template` a `.env` y configura las URL y claves de tu entorno.

| Variable | Uso |
|----------|-----|
| `REACT_APP_API_URL` | URL base de la API; el cliente añade `/api/` a las rutas. |
| `REACT_APP_PRINTER_URL` | URL HTTP del servicio local de impresión. |
| `REACT_APP_PRINTER_WS_URL` | URL WebSocket del servicio de impresión (opcional); si falta, se deriva de `REACT_APP_PRINTER_URL`. |
| `REACT_APP_WHATSAPP_NUMBER` | Número del enlace de soporte. |
| `REACT_APP_MERCADO_PAGO_PUBLIC_KEY` | Clave pública para el formulario de pago. |
| `REACT_APP_API_URL_KEY` | Clave usada por las solicitudes públicas de registro. |

```bash
npm start       # Inicia en modo desarrollo en http://localhost:3000
npm run build   # Genera build de producción en /build
npm test        # Ejecuta tests
```

---

## 🎨 Guía de Estilos (Design Tokens)

Referencia del tema actual del frontend. Los valores fuente están en `src/theme/theme.js` y `src/theme/variables.css`.

### Tipografía

Fuente principal: `Inter, sans-serif`.

| Nivel  | Tamaño    | Peso |
|--------|-----------|------|
| h1     | 1.75rem   | 700  |
| h2     | 1.5rem    | 700  |
| h3     | 1.25rem   | 600  |
| h4     | 1.125rem  | 600  |
| h5     | 1rem      | 600  |
| h6     | 0.875rem  | 600  |
| body1  | 0.875rem  | 400  |
| body2  | 0.8125rem | 400  |
| button | 0.8125rem | 600, sin mayúsculas forzadas |

### Paleta de Colores

**Primarios:**

| Token         | Valor     | Uso                        |
|---------------|-----------|----------------------------|
| primary       | `#04346b` | Color principal, botones   |
| primary-light | `#065a9e` | Hover, gradientes          |
| primary-dark  | `#022347` | Énfasis                    |
| secondary     | `#e94560` | Acento secundario          |
| accent        | `#a78bfa` | Elementos destacados       |

**Fondos (modo claro):**

| Token      | Valor                      |
|------------|----------------------------|
| default    | `#e8eef6`                  |
| paper      | `#ffffff`                  |
| divider    | `#e2e8f0`                  |

**Fondos (modo oscuro):**

| Token      | Valor      |
|------------|------------|
| default    | `#0d1117`  |
| paper      | `#161b22`  |
| divider    | `#30363d`  |

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
/* Tarjetas de indicadores del tablero de ventas */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
background: linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%);
background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%);
background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
```

### Bordes y Sombras

```css
border-radius: 8px;   /* shape general, Paper y Card */
border-radius: 6px;   /* Button, Chip, TextField y Select */
border-radius: 10px;  /* Dialog */
border-radius: 4px;   /* Tooltip */

box-shadow: 0 1px 2px rgba(0,0,0,0.05);  /* Sombra ligera */
box-shadow: 0 2px 8px rgba(0,0,0,0.08);  /* Sombra media */
box-shadow: 0 4px 12px rgba(0,0,0,0.08); /* Sombra amplia */
```

### Transiciones

```css
transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease; /* Button */
transition: box-shadow 0.15s ease; /* Card */
transition: border-color 0.15s ease, box-shadow 0.15s ease; /* TextField */
```
