# SmartVenta — Punto de venta en la nube para negocios con una o muchas sucursales

> Última actualización: 10 de octubre de 2026

**SmartVenta** es un punto de venta (POS) en la nube para negocios con una o varias tiendas y almacenes. Desde el navegador vendes, cobras, apartas, surtes, mueves mercancía entre sucursales y controlas precios e inventario, en computadora, tableta o celular, sin instalar nada. Cada pieza queda registrada: sabes quién la movió, cuándo y a dónde fue.

> **Nota para la landing page:** este documento es la fuente de verdad del sitio. Todo lo que dice está verificado contra el código actual. Las secciones 1 a 9 están en lenguaje de cliente y se pueden copiar tal cual. La sección 10 es la ficha técnica para compradores y equipos de TI. Los precios **no** viven aquí: se publican en la landing y los define el sistema de planes.

---

## Contenido

1. [En pocas palabras](#1-en-pocas-palabras)
2. [¿Para quién es?](#2-para-quién-es-smartventa)
3. [Cómo se organiza tu negocio](#3-cómo-se-organiza-tu-negocio-en-smartventa)
4. [Crece de una a muchas sucursales](#4-crece-de-una-a-muchas-sucursales-sin-cambiar-de-sistema)
5. [Funcionalidades estrella](#5-funcionalidades-estrella)
6. [Todas las funcionalidades](#6-todas-las-funcionalidades)
7. [Roles y permisos](#7-roles-y-permisos)
8. [Contratación, planes y pagos](#8-contratación-planes-y-pagos)
9. [Preguntas frecuentes](#9-preguntas-frecuentes)
10. [Ficha técnica](#10-ficha-técnica)
11. [Diccionario de términos](#11-diccionario-de-términos)
12. [Para desarrolladores](#12-para-desarrolladores)

---

## 1. En pocas palabras

| | |
|---|---|
| **Qué es** | Punto de venta + inventario + control de sucursales, como servicio en la nube (SaaS) |
| **Dónde funciona** | Cualquier navegador moderno: computadora, tableta o celular |
| **Qué necesitas** | Internet. Opcional: lector de código de barras e impresora de tickets |
| **Instalación** | Ninguna. Te registras en línea y empiezas a vender |
| **Sucursales** | Desde una tienda hasta muchas tiendas y almacenes en una sola cuenta |
| **Usuarios** | Dueño, administradores por sucursal y vendedores ilimitados sin costo |
| **Soporte** | Por WhatsApp, con los datos de tu negocio ya escritos |

**Tres ideas que definen a SmartVenta:**

- **Es SaaS.** No compras licencias ni servidores. Pagas una suscripción mensual con tarjeta y recibes las mejoras automáticamente: la próxima vez que abres el sistema ya tienes la versión nueva.
- **Es un POS completo.** Venta rápida con escáner, varios clientes a la vez, mayoreo automático, venta a granel, apartados, devoluciones, corte de caja y tickets.
- **Es multi-sucursal de verdad.** Tiendas y almacenes conectados: stock de todas las sucursales a la vista, traspasos confirmados escaneando, distribución desde almacén, tableros comparativos y un solo acceso para el dueño.

---

## 2. ¿Para quién es SmartVenta?

- **Cadenas de tiendas** que necesitan ver y mover su inventario entre sucursales sin llamadas ni hojas de cálculo.
- **Negocios con almacén** que surten a sus tiendas y quieren saber qué salió, qué llegó y qué falta.
- **Tiendas con varios vendedores en mostrador** que atienden a varios clientes a la vez.
- **Negocios de una sola tienda** que quieren empezar rápido. Dan de alta productos con su stock en un solo paso, y el sistema no les muestra funciones de varias sucursales que no necesitan.
- **Giros que venden a granel** (semillas, forrajes, abarrotes, ferreterías, cremerías). Venden por kilo, por fracción o por monto, y desempacan bultos a kilos.

Giros típicos: ferreterías, refaccionarias, papelerías, abarrotes, forrajeras, jugueterías, cosméticos, dulcerías, regalos, limpieza, joyerías, celulares, electrónica, mercerías, librerías, mueblerías, fiestas, mascotas, ópticas y estéticas.

---

## 3. Cómo se organiza tu negocio en SmartVenta

```
Tu negocio (una cuenta)
├── Tienda Centro     ← vende, aparta, cobra, recibe traspasos
├── Tienda Norte      ← vende, aparta, cobra, recibe traspasos
└── Almacén General   ← recibe mercancía y la distribuye a las tiendas
```

- **Sucursal** es cualquier tienda o almacén.
- **Tienda:** punto de venta donde atiendes clientes.
- **Almacén:** surte a las tiendas; no vende directamente.
- **Vista general:** el panel del dueño. Desde ahí ve todas las sucursales, tableros, catálogo, auditoría y su plan, y entra a cualquier sucursal con un clic.
- **Catálogo único:** los productos y sus precios se dan de alta una vez para todo el negocio. Cada sucursal lleva su propio stock.

---

## 4. Crece de una a muchas sucursales sin cambiar de sistema

SmartVenta se adapta solo al tamaño de tu negocio:

| | Una sucursal | Varias sucursales |
|---|---|---|
| Alta de productos | Producto y stock inicial en un solo paso, dentro de tu tienda | El producto se crea una vez y cada sucursal maneja su stock |
| Producto sin stock al vender | "Agregar y vender": lo sumas al inventario y lo cobras en el mismo paso | Además puedes ver cuánto hay en otras sucursales y pedir un traspaso ahí mismo |
| Traspasos y distribuciones | Ocultos, para no estorbar | Completos, con avisos al momento |
| Cambio de sucursal | Botón "Regresar" a la vista general | Selector de sucursal en el menú; la última que visitaste aparece primero |
| Tablero de ventas | Disponible siempre | Se consulta antes de las 10 AM o después de las 9 PM, para no afectar la operación |
| Importar productos | Opción de cargar también el inventario la primera vez | Inventario por sucursal desde su propia importación |

Cuando abres tu segunda sucursal, las funciones de varias sucursales se activan solas. No hay migración ni cambio de sistema.

---

## 5. Funcionalidades estrella

### ⭐ 1. Varias sucursales, varios vendedores, varios clientes a la vez

**El problema:** en hora pico un cliente decide mientras otro ya quiere pagar. Además, el dueño necesita estar en todas sus tiendas sin estar físicamente en ninguna.

**Con SmartVenta:**
- **Carritos simultáneos sin límite.** Abre una pestaña por cliente. Cada una guarda sus productos y su cliente, y muestra cuántos productos lleva.
- **Cambia de cliente con un clic.** Atiende al que ya decidió y regresa al otro sin perder nada.
- **Todas tus sucursales en un solo acceso.** El dueño entra a cualquier tienda o almacén y cambia de sucursal desde el menú, en computadora o celular, sin cerrar sesión.
- **Vendedores ilimitados sin costo.** Crea cuentas de vendedor por tienda en segundos; el sistema propone el nombre de usuario.
- **Ventas por vendedor.** Consulta cuánto vendió cada uno.
- **Cada quien ve lo suyo.** El vendedor ve solo lo que necesita para vender; el administrador opera su sucursal; el dueño ve todo. Las pantallas que no le corresponden a un rol no se pueden abrir, ni siquiera escribiendo la dirección.

**Resultado:** atiendes a más clientes en hora pico y controlas todas tus sucursales desde una sola cuenta.

### ⭐ 2. Stock que no se vende dos veces

**El problema:** dos vendedores ofrecen la última pieza al mismo tiempo, o un traspaso sale con mercancía que ya se vendió.

**Con SmartVenta:**
- **Apartado automático entre carritos.** Lo que está en un carrito se descuenta del disponible en los demás carritos abiertos.
- **No vendes lo que no hay.** El carrito no deja pasar del stock disponible y te dice exactamente por qué: no hay stock o está en otro carrito.
- **"Agregar y vender".** Si el sistema dice cero pero tienes el producto en la mano, lo agregas al inventario y lo vendes en el mismo paso, sin perder el carrito ni el cliente.
- **Stock de las demás sucursales al instante** (varias sucursales). Si no hay en tu tienda, ves cuánto hay en las otras y pides un traspaso desde ahí.
- **Stock general al distribuir.** El almacén ve el stock de todas las tiendas mientras arma un envío.
- **Traspasos y distribuciones limitados al stock real.** No puedes enviar más de lo que hay.

**Resultado:** menos ventas que no se pueden surtir y menos discusiones entre sucursales.

### ⭐ 3. Trazabilidad completa de cada producto

**El problema:** "¿Quién movió esto?", "¿Cuándo llegó?", "¿Por qué no cuadra?". Sin historial, las diferencias de inventario terminan en discusiones.

**Con SmartVenta:**
- **Historial de cada movimiento.** Cada venta, traspaso, distribución, ajuste o entrada guarda fecha y hora, quién lo hizo, el stock anterior, la diferencia y el stock nuevo.
- **Historial por producto de hasta 12 meses.** Abre cualquier producto y revisa su vida completa en esa sucursal.
- **Historial diario de la sucursal.** Filtra por marca y tipo de movimiento, y descárgalo a Excel.
- **Movimientos marcados.** El historial señala los registros que no cuadran con el anterior.
- **Traspasos confirmados escaneando.** La tienda pide mercancía y el traspaso se confirma escaneando los productos. Un producto que no está en un traspaso pendiente se rechaza.
- **Solicitudes de ajuste con aprobación.** El administrador reporta que la cantidad es correcta o pide un ajuste con la cantidad real; solo el dueño aprueba. El dueño también puede ajustar directamente.
- **Revisión de inventario guiada.** Lista de productos por verificar; el dueño los confirma o ajusta y quedan registrados.
- **Avisos al momento.** Notificaciones cuando se crea o confirma un traspaso o una distribución, cuando llega o se aprueba una solicitud de ajuste o cuando se hace un apartado. Un clic te lleva al detalle.

**Resultado:** cada diferencia tiene responsable y fecha. Las mermas dejan de ser un misterio.

### ⭐ 4. Cambio de precios fácil y masivo

**El problema:** sube el proveedor y hay que cambiar precios uno por uno, con el riesgo de dejar precios viejos o vender por debajo del costo.

**Con SmartVenta:**
- **Actualización masiva.** Selecciona varios productos y cambia a la vez costo, precio unitario, precio de mayoreo y cantidad mínima de mayoreo. Solo cambia lo que llenas.
- **Aviso de precios distintos.** Si los productos seleccionados tienen precios diferentes, ves una tabla comparativa antes de confirmar.
- **Protección contra errores.** Al dar de alta o editar un producto:
  - El costo y el precio deben ser mayores a cero.
  - El precio de mayoreo debe quedar entre el costo y el precio unitario.
  - La cantidad mínima de mayoreo es de al menos 2 piezas.
  - Cada error se señala en su campo.
- **Mayoreo automático en caja.** Al llegar a la cantidad mínima, el carrito aplica el precio de mayoreo. Tú decides si el mayoreo se combina con el descuento del cliente.
- **Historial de precios.** Cada cambio con valor anterior, valor nuevo, fecha y quién lo hizo, por producto o general. Filtra hasta 12 meses atrás y descárgalo a Excel.
- **Precios bajo control.** Solo el dueño edita precios de productos existentes.
- **Importación masiva desde Excel.** Carga tu catálogo con precios desde una plantilla.

**Resultado:** ajustas cientos de precios en minutos, sin errores y con registro de cada cambio.

### ⭐ 5. Tu catálogo con fotos

**El problema:** productos parecidos, códigos que nadie recuerda, vendedores nuevos que no conocen la mercancía.

**Con SmartVenta:**
- **Foto desde el celular.** Un botón abre la cámara trasera y guarda la foto del producto al instante.
- **Fotos ligeras automáticamente.** Las imágenes se optimizan al subirlas para que el sistema cargue rápido incluso con datos móviles.
- **Búsqueda visual al vender.** Explora los resultados en un carrusel con foto, precio y stock. Los productos sin existencia aparecen atenuados.
- **Foto en el carrito y en la búsqueda.** Confirma visualmente que cobras el producto correcto.
- **Vista de galería.** Productos e inventario en tarjetas con imagen o en tabla; el sistema recuerda tu preferencia.

**Resultado:** los vendedores nuevos venden desde el primer día y hay menos errores por productos parecidos.

---

## 6. Todas las funcionalidades

### 💰 Punto de venta

- **Búsqueda por código de barras.** Escanea con lector o escribe el código y presiona Enter o el botón de buscar.
- **Sugerencias al escribir.** Desde la tercera letra aparecen hasta 5 productos por nombre o marca; navegas con las flechas y eliges con Enter.
- **Escáner con la cámara del celular.** Lee códigos de barras sin lector.
- **Búsqueda visual.** Carrusel de productos con foto, precio y stock.
- **Crear producto desde la venta.** Si un código no existe, el sistema ofrece crearlo en ese momento. Se activa en las opciones del negocio.
- **Checar precio.** Consulta el precio de un producto sin agregarlo al carrito.
- **Venta a granel.** En productos por kilo o litro eliges vender por kilo, por fracción (desde 0.1) o por monto ("dame $20 de queso").
- **Cobro en efectivo, tarjeta, transferencia o mixto.** El pago mixto combina efectivo con tarjeta o con transferencia. El sistema calcula el cambio y pide la referencia en los pagos electrónicos.
- **Intercambio de mercancía.** Aplica una devolución anterior como parte del pago de una nueva compra.
- **Totales redondeados para dar cambio fácil.** Los centavos suben a 50 centavos o al siguiente peso; el carrito y la pantalla de cobro muestran el mismo total.
- **Descuento por cliente.** Selecciona al cliente y su descuento se aplica al cobrar. También puedes crear un cliente nuevo desde la pantalla de cobro.
- **Mayoreo manual.** Aplica el precio de mayoreo a un producto del carrito con una casilla.
- **Protección contra cobros dobles.** Evita registrar dos veces la misma venta.
- **Aviso de verificación.** Al agregar un producto marcado para conteo físico, el administrador o el dueño ven un aviso.
- **Fijar resultados.** Mantén la búsqueda abierta para agregar varios productos seguidos.
- **Vista en tabla o tarjetas** del carrito en computadora.
- **Impresión de tickets** en impresoras térmicas (recomendada Epson TM-88V). También reimprime desde ventas y apartados.
- **Estado de la impresora a la vista.** Indicador de conectada o desconectada que se reconecta solo.
- **Vender desde el celular.** Búsqueda, carrito y cobro adaptados a teléfono y tableta; en celular no se imprimen tickets.

**Atajos de teclado para vender sin mouse:**

| Atajo | Acción | Atajo | Acción |
|---|---|---|---|
| Ctrl+B | Ir a la búsqueda | Ctrl+E | Venta (tienda) |
| Ctrl+Q | Buscar por código | Ctrl+I | Apartado (tienda) |
| Ctrl+L | Buscar por nombre | Ctrl+D | Distribución (almacén) |
| Ctrl+K | Búsqueda visual | Ctrl+R | Confirmar traspaso (varias sucursales) |
| Ctrl+J | Buscar cliente | Ctrl+Y | Agregar a inventario |
| Ctrl+1…5 | Elegir cliente de la lista | Ctrl+U | Checar precio |
| Ctrl+P | Cobrar | Ctrl+G | Confirmar el pago |
| Ctrl+O | Quitar cliente | Ctrl+F | Abonar sin imprimir ticket |

Los atajos de cobro respetan las mismas validaciones que el botón: no confirman un pago incompleto.

### 🔀 Una sola pantalla para todas las operaciones

Desde la pantalla de venta cambias de operación sin cambiar de página. El carrito se vacía al cambiar, para no mezclar operaciones.

| Operación | Tienda | Almacén |
|---|:---:|:---:|
| Venta | ✅ | — |
| Apartado | ✅ | — |
| Confirmar traspaso | ✅ (varias sucursales) | ✅ |
| Distribución | — | ✅ |
| Agregar a inventario | ✅ | ✅ |
| Checar precio | ✅ | ✅ |

Al confirmar un traspaso o una distribución eliges el destino dos veces, para no enviar mercancía a la sucursal equivocada.

### 🏪 Control de sucursales (dueño)

- **Vista general de tiendas y almacenes.** Indicadores de productos, ventas, monto y ganancia del periodo, con totales y filtro por departamento.
- **Semáforo de desempeño.** Cada sucursal se marca por encima, en o por debajo del promedio.
- **Catálogo incompleto.** Filtro para ver qué sucursales no tienen todos los productos.
- **Filtros rápidos por sucursal:** pagos, ventas, administradores, inversión, impresoras y acciones.
- **Inversión por sucursal.** Valor del inventario de cada sucursal, calculado cuando lo pides.
- **Administradores por sucursal.** Edita sus datos y cambia su contraseña desde la lista.
- **Entrar a una sucursal** con un clic; la sucursal actual se resalta.
- **Cambiar de sucursal desde el menú,** en computadora y celular.
- **Crear tienda o almacén** con nombre, dirección y teléfono, respetando el límite de tu plan.
- **Vaciar stock con doble confirmación:** hay que escribir el nombre de la sucursal.
- **Avisos del negocio** visibles en la lista de sucursales.

### 📦 Inventario

- **Inventario por sucursal** con filtros por código, nombre, marca, departamento y stock máximo.
- **Solo lo que tienes.** Por defecto muestra productos con existencia.
- **Stock en otras sucursales** (varias sucursales). Consúltalo desde la venta y pide un traspaso con un botón.
- **Stock del producto en todas las sucursales.** El dueño lo consulta desde el catálogo.
- **Agregar mercancía** desde la pantalla de venta.
- **Ajuste directo** (dueño) o **solicitud de ajuste** (administrador), con historial.
- **Solicitudes de ajuste.** Lista con estado (pendiente o aplicada) y quién la pidió. El dueño aprueba; quien la pidió puede borrarla. El encabezado muestra un contador por sucursal.
- **Inventario a verificar.** Lista de productos por contar, descargable a Excel.
- **Importar inventario desde Excel.** Suma o sustituye existencias con plantilla y validación previa; muestra solo las filas con error.
- **Exportar inventario a Excel.**
- **Unidad visible:** pieza, kilo, costal, litro, metro, rollo o caja, en tablas y carrito.

### 🚚 Traspasos y distribuciones (varias sucursales)

- **Pedir mercancía a otra sucursal** desde el stock de otras tiendas, con un botón.
- **Confirmar escaneando.** El traspaso se aplica al escanear los productos y elegir destino.
- **Traspasos pendientes y aplicados.** Pendientes sin límite de fecha y aplicados del día, con tiempo transcurrido y hora de confirmación. Los pendientes se pueden eliminar.
- **Distribución desde almacén.** El almacén arma el envío viendo el stock de todas las tiendas.
- **Confirmación de distribuciones.** Revisa los productos antes de confirmar. El dueño puede corregir cantidades, quitar productos o eliminar la distribución completa.
- **Movimientos pendientes** siempre a la vista en el encabezado.

### 🔄 Desempaque de productos

- **Convierte bultos en unidades.** Define una vez la equivalencia ("1 costal = 10 kilos") y desempaca desde la página de conversiones dentro de la tienda. Cada clic desempaca una unidad, con confirmación.
- **Equivalencias controladas.** Solo el dueño crea, cambia o elimina equivalencias.

### 🛒 Apartados

- **Aparta desde el punto de venta** con cliente obligatorio y anticipo, en una sola forma de pago.
- **Abonos y liquidación.** Registra abonos parciales o liquida el total, con o sin ticket. Los pagos con tarjeta o transferencia guardan su referencia.
- **Control de saldos.** Apartados activos y cancelados, con total, pagado y lo que falta.
- **Cancelación con devolución.** Al cancelar muestra el monto a regresar.

### ↩️ Ventas, devoluciones y cancelaciones

- **Lista de ventas** con filtros rápidos (todas, duplicadas, canceladas y con devolución) y búsqueda por fecha, folio o cliente.
- **Devolución parcial** por producto y cantidad.
- **Cancelación total** de las ventas que el sistema marca como cancelables.
- **Motivo obligatorio.** Siempre queda registrado por qué se canceló o devolvió; se consulta en la misma lista.
- **Alerta de ventas duplicadas** en el encabezado y en el corte de caja.
- **Importar ventas desde Excel** (dueño y administrador), con plantilla y validación previa.

### 💵 Caja

- **Corte de caja diario.** Ventas y apartados por forma de pago, entradas y salidas de dinero y resumen general.
- **Movimientos de caja.** Entradas y salidas con concepto y monto. El vendedor registra y consulta los del día; solo el dueño edita o elimina.
- **Exportar el corte a Excel** con un clic.

### 👥 Clientes y vendedores

- **Clientes** con nombre, teléfono, descuento asignado y total comprado en el periodo que elijas.
- **Descuentos predefinidos.** El dueño crea porcentajes para asignarlos a clientes; no se repiten.
- **Búsqueda de cliente al vender** por nombre o número.
- **Vendedores ilimitados.** Cuentas por tienda con nombre de usuario sugerido. El dueño edita y cambia contraseñas, y ve lo vendido por cada uno.

### 📋 Catálogo de productos

- **Alta de producto completa:** código, nombre, marca, departamento, unidad, costo, precios, mayoreo y foto.
- **Código repetido bloqueado.** Te avisa al escribir si el código ya existe y no deja crearlo.
- **Stock inicial al crear** (una sucursal). Dentro de tu tienda, el producto se crea con su existencia en un solo paso.
- **Importación desde Excel en 4 pasos:** subir, configurar, validar e importar.
  - Puede crear las marcas y departamentos que falten.
  - Muestra los errores por página.
- **Marcas y departamentos** con su número de productos. No se borran mientras tengan productos, y solo el dueño los elimina.
- **Reasignación masiva.** Pasa todos los productos de una marca o departamento a otro y, si quieres, elimina el de origen.
- **Formatear códigos** (dueño). Unifica todos los códigos en mayúsculas.
- **Borrado seguro.** Solo se borran productos sin existencia.
- **Historial de precios** por producto y general.
- **Exportar catálogo a Excel** con precios y enlace de imagen.

### 📈 Tableros (dueño)

- **Ventas.** Monto, ganancia, margen, ticket promedio y promedio por mes o día; también número de transacciones. Por mes o por año, en línea o barras, con la línea de hoy marcada.
- **Mejor y peor.** Sucursal, día del mes, día de la semana y hora con más y menos ventas.
- **Comparativo por sucursal.** Ventas, ganancia, margen y ticket de cada tienda.
- **Mapa de calor.** Días y horas de mayor venta por tienda.
- **Cancelaciones.** Monto y porcentaje cancelado o devuelto, separado por tipo, cuándo y dónde ocurre más, y sus motivos.
- **Marcas y productos.** Marcas más vendidas y productos más y menos vendidos, por tienda y periodo.
- **Verificación de stock.** Productos por verificar, cobertura y promedio por tienda.
- **Traspasos pendientes** (varias sucursales). Por tienda, hoy contra días anteriores.
- **Cálculo en segundo plano.** Los tableros pesados muestran una barra de progreso mientras se calculan.

### 🔍 Auditoría (dueño)

- **Transacciones.** Ventas duplicadas, movimientos de inventario inconsistentes y discrepancias de stock, por sucursal y fecha.
- **Productos.** Códigos repetidos, problemas de costo, mayoreo inconsistente, productos faltantes en sucursales y productos sin movimiento.
- **Resultados descargables** a Excel.

### ⚙️ Configuración y ayuda

- **Perfil.** Nombre, correo y contraseña de cada usuario. El dueño ve además los datos del negocio.
- **Opciones del negocio.** Mostrar el stock de almacenes y permitir crear productos desde la venta.
- **Modo oscuro o claro** en computadora y tableta; se recuerda en tu equipo.
- **Ayuda en pantalla.** Botón que explica qué puedes hacer en las pantallas principales.
- **Soporte por WhatsApp** (dueño y administrador), con los datos del negocio y la tienda ya escritos.
- **Aviso de conexión.** Te avisa si se pierde Internet y cuando regresa.
- **Sincronizar servicio** (dueño). Si el sistema está lento, lo reinicia en unos 3 minutos.

---

## 7. Roles y permisos

| Rol | Qué hace |
|---|---|
| **Dueño** | Todo: vista general, tableros, auditoría, sucursales, vendedores, precios, costos, ajustes de stock, aprobaciones, equivalencias, plan y pagos. Cambia entre sucursales. |
| **Administrador** | Opera su sucursal: venta, apartados, caja y corte, clientes, catálogo, inventario, importaciones, traspasos y distribuciones, historial de stock e inventario a verificar. Pide ajustes de stock. |
| **Vendedor** | En tienda: vende, aparta, consulta ventas, registra movimientos de caja del día y ve traspasos (varias sucursales). En almacén: distribuye, consulta catálogo e inventario y confirma traspasos. |

Cada rol solo ve y abre las pantallas que le corresponden. Además:
- Solo el dueño ve costos, edita precios de productos existentes, ajusta stock, aprueba solicitudes, vacía stock, crea sucursales y administra el plan.
- El vendedor no ve el total de la lista de ventas ni las notificaciones.

---

## 8. Contratación, planes y pagos

- **Registro en línea en 3 pasos:** negocio, propietario y plan.
  - Te dice al momento si la clave de tu negocio está disponible y te sugiere alternativas.
  - Al terminar recibes tu usuario de acceso.
- **Pago con tarjeta.** Cobro mensual recurrente y seguro con Mercado Pago.
- **Planes por número de sucursales.** El sistema respeta el límite de tu plan al crear sucursales.
- **Mi plan.** Plan, precio, sucursales, tarjeta, fechas del negocio y de la suscripción.
  - Avisa cuando la tarjeta está por vencer (2 meses antes) o si falló un cobro.
- **Cambiar tarjeta** sin cargo en ese momento.
- **Domiciliación con ahorro.** Opción de cobro automático a un precio menor, cuando tu plan la ofrece.
- **Reactivación.** Si la suscripción vence, el dueño entra directo a su plan para reactivarla. Mientras tanto, el resto del sistema queda en pausa.
- **Cancelación cuando quieras** desde Mi plan, con motivo. Cierra la sesión de todos los usuarios del negocio.
- **Historial de pagos y de suscripciones.**
- **Servicios adicionales** (catálogo dentro del sistema): sucursales extra, impresora USB, impresora WiFi, módulo de vendedores ilimitados e integraciones con terceros.

---

## 9. Preguntas frecuentes

**¿Necesito instalar algo?**
No. Funciona en el navegador de tu computadora, tableta o celular. Si usas impresora de tickets, soporte te ayuda a configurarla.

**¿Funciona sin Internet?**
No. SmartVenta necesita conexión para vender y sincronizar el inventario entre sucursales. Si se pierde la conexión, el sistema te avisa y también cuando regresa.

**¿Puedo empezar con una sola tienda?**
Sí. Con una sucursal el sistema muestra solo lo que necesitas. Cuando abras más tiendas o un almacén, las funciones de varias sucursales se activan solas.

**¿Cuántos vendedores puedo tener?**
Ilimitados y sin costo.

**¿Puedo cargar mi catálogo actual?**
Sí. Importas productos, inventario y ventas desde Excel con plantilla, y el sistema valida antes de guardar.

**¿Qué impresora necesito?**
Cualquier impresora térmica de tickets compatible; recomendamos la Epson TM-88V, por USB o WiFi.

**¿Puedo vender a granel?**
Sí: por kilo, por fracción o por monto. También desempacas bultos a unidades.

**¿Mis vendedores pueden ver costos o cambiar precios?**
No. Solo el dueño ve costos y edita precios.

**¿Cómo funciona el soporte?**
Por WhatsApp, directo desde el sistema.

---

## 10. Ficha técnica

Para compradores y equipos de TI.

| Tema | Detalle |
|---|---|
| Modelo | Software como servicio (SaaS) multi-negocio: cada negocio es una cuenta con sus sucursales, productos y usuarios |
| Acceso | Aplicación web en cualquier navegador moderno. Se puede agregar a la pantalla de inicio como app |
| Dispositivos | Computadora, tableta y celular (diseño adaptable) |
| Conexión | Requiere Internet; no trabaja sin conexión |
| Tiempo real | Avisos al momento de traspasos, distribuciones, ajustes y apartados entre 8:00 y 21:00 |
| Seguridad | Acceso con usuario y contraseña; sesión por token; tres roles con pantallas restringidas; la sesión se cierra si la cuenta se desactiva |
| Trazabilidad | Historial de stock, de precios y de cancelaciones con usuario, fecha y motivo |
| Procesos pesados | Tableros y auditorías se calculan en segundo plano, sin bloquear la venta |
| Hardware | Lector de código de barras USB (funciona como teclado); cámara del celular como escáner; impresoras térmicas USB o WiFi mediante un servicio local de impresión |
| Datos | Importación y exportación a Excel (catálogo, inventario, ventas, historiales, auditorías y corte de caja) |
| Imágenes | Optimización automática a WebP al subir fotos |
| Pagos de suscripción | Mercado Pago (tarjeta, cobro recurrente) |
| Actualizaciones | Automáticas; sin reinstalar |

**Arquitectura:**

| Capa | Tecnología |
|---|---|
| Aplicación web | React 18, Material UI 5, React Query 5, Redux (carritos), React Router 6 |
| API | Django / Django REST Framework |
| Tiempo real | WebSocket (Django Channels) |
| Tareas en segundo plano | Celery |
| Códigos de barras | ZXing |
| Excel | SheetJS (xlsx) |
| Pagos | Mercado Pago SDK |

---

## 11. Diccionario de términos

### Negocio

| Término | Definición |
|---|---|
| **Negocio** | Tu cuenta completa: sucursales, productos y usuarios. |
| **Sucursal** | Cualquier tienda o almacén del negocio. |
| **Tienda** | Sucursal donde se atiende y se vende a clientes. |
| **Almacén** | Sucursal que surte a las tiendas. No vende directamente. |
| **Vista general** | Panel del dueño con todas las sucursales. |
| **Traspaso** | Movimiento de mercancía de una sucursal a otra. Se pide desde la tienda que necesita y se confirma escaneando. |
| **Distribución** | Envío de mercancía desde un almacén a una tienda. |
| **Venta** | Cobro en efectivo, tarjeta, transferencia o mixto. |
| **Apartado** | Venta con anticipo; el cliente abona hasta liquidar. |
| **Devolución** | El cliente regresa uno o más productos de una venta. Puede ser parcial. |
| **Cancelación** | Anulación completa de una venta, con motivo registrado. |
| **Intercambio de mercancía** | Uso de una devolución como parte del pago de una nueva compra. |
| **Desempaque** | Conversión de un producto en otro según una equivalencia (1 costal = 10 kg). |
| **Corte de caja** | Resumen diario de ventas por forma de pago y movimientos de dinero. |
| **Movimiento de caja** | Entrada o salida de dinero que no es venta (retiro, gasto). |
| **Solicitud de ajuste** | Petición para corregir el stock; la aprueba el dueño. |
| **Ticket promedio** | Monto promedio de cada venta. |
| **Stock** | Cantidad disponible de un producto en una sucursal. |
| **Catálogo** | Productos dados de alta. Una sucursal tiene catálogo incompleto si le faltan productos. |
| **Inversión** | Valor del inventario de una sucursal. |

### Producto y precio

| Término | Definición |
|---|---|
| **Código** | Identificador único del producto; normalmente su código de barras. |
| **Costo** | Lo que pagaste por el producto; se usa para calcular la ganancia. |
| **Precio unitario** | Precio de venta de una pieza. |
| **Precio de mayoreo** | Precio menor que se aplica al llegar a la cantidad mínima. |
| **Cantidad mínima de mayoreo** | Piezas necesarias para aplicar el precio de mayoreo (mínimo 2). |
| **Descuento de cliente** | Porcentaje asignado a un cliente que se aplica al cobrar. |
| **Unidad** | Pieza, kilo, costal, litro, metro, rollo o caja. |

### Auditoría

| Término | Definición |
|---|---|
| **Venta duplicada** | Dos ventas iguales registradas en poco tiempo; normalmente un error. |
| **Movimiento inconsistente** | Registro de inventario que no cuadra con el anterior. |
| **Discrepancia de stock** | Diferencia entre el stock registrado y el calculado por movimientos. |
| **Producto por verificar** | Producto marcado para conteo físico. |
| **Producto sin movimiento** | Producto que no se ha vendido ni movido en el periodo revisado. |

### Formas de pago

| Clave | Definición |
|---|---|
| **EF** | Efectivo |
| **TA** | Tarjeta de débito o crédito |
| **TR** | Transferencia bancaria |

---

## 12. Para desarrolladores

Este repositorio es el frontend web. Reglas, arquitectura, convenciones, permisos por ruta y guía de estilos: **[AGENTS.md](AGENTS.md)**. Backlog técnico: [pendientes.md](pendientes.md).

```bash
npm ci
cp .env.template .env   # configurar URL de la API, impresora, WhatsApp y Mercado Pago
npm start               # http://localhost:3000
npm run build           # build de producción en /build
```
