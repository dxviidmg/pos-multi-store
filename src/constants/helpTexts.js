const helpTexts = {
  "/vender/": {
    title: "Punto de venta",
    text: "Aquí realizas ventas, traspasos y distribuciones. Busca productos por código de barras o nombre, agrégalos al carrito y finaliza la operación. Puedes tener varios carritos abiertos al mismo tiempo para atender a distintos clientes.",
  },
  "/ventas/": {
    title: "Historial de ventas",
    text: "Consulta todas las ventas realizadas en esta tienda. Puedes filtrar por fecha, reimprimir tickets, ver el detalle de productos vendidos o generar devoluciones.",
  },
  "/importar-ventas/": {
    title: "Importar ventas",
    text: "Carga ventas desde un archivo Excel. Útil para migrar datos de otro sistema o registrar ventas en lote.",
  },
  "/corte-caja/": {
    title: "Corte de caja",
    text: "Resumen diario de ventas desglosado por método de pago (efectivo, tarjeta, transferencia). Úsalo al final del día para cuadrar tu caja.",
  },
  "/movimientos-caja/": {
    title: "Movimientos en caja",
    text: "Registra entradas y salidas de efectivo que no son ventas: retiros, depósitos, gastos, etc. Estos movimientos se reflejan en el corte de caja.",
  },
  "/clientes/": {
    title: "Clientes",
    text: "Administra tu base de clientes. Registra datos de contacto, consulta historial de compras y asigna clientes a ventas para llevar un control personalizado.",
  },
  "/productos/": {
    title: "Catálogo de productos",
    text: "Aquí gestionas todos los productos de tu negocio: nombre, código, marca, departamento, precios de menudeo y mayoreo. Los productos son compartidos entre todas tus tiendas.",
  },
  "/inventario/": {
    title: "Inventario de tienda",
    text: "Consulta el stock disponible en esta tienda específica. Puedes ajustar cantidades manualmente y ver el historial de movimientos de cada producto.",
  },
  "/marcas/": {
    title: "Marcas",
    text: "Administra las marcas de tus productos. Las marcas te ayudan a organizar y buscar productos más rápido.",
  },
  "/departamentos/": {
    title: "Departamentos",
    text: "Organiza tus productos por departamento (ej: Electrónica, Ropa, Alimentos). Facilita la búsqueda y los reportes por categoría.",
  },
  "/reasignacion/": {
    title: "Reasignación de productos",
    text: "Cambia la marca o departamento de varios productos a la vez. Útil para reorganizar tu catálogo sin editar producto por producto.",
  },
  "/importar-productos/": {
    title: "Importar productos",
    text: "Carga productos desde un archivo Excel. Ideal para dar de alta tu catálogo inicial o agregar muchos productos nuevos de una vez.",
  },
  "/importar-inventario/": {
    title: "Importar inventario",
    text: "Carga el inventario de una tienda desde un archivo Excel. Útil para establecer el stock inicial o hacer ajustes masivos.",
  },
  "/distribuciones/": {
    title: "Distribuciones",
    text: "Las distribuciones mueven mercancía del almacén a las tiendas. Desde aquí creas envíos y las tiendas los confirman al recibir el producto.",
  },
  "/traspasos/": {
    title: "Traspasos",
    text: "Los traspasos mueven mercancía entre tiendas o de tienda a almacén. Confirma la recepción escaneando los productos al recibirlos.",
  },
  "/distribuir/": {
    title: "Distribuir mercancía",
    text: "Desde el almacén, selecciona productos y envíalos a una o varias tiendas. Las tiendas recibirán un traspaso pendiente de confirmar.",
  },
  "/logs/": {
    title: "Logs de movimientos",
    text: "Registro detallado de todos los movimientos de inventario: ventas, traspasos, distribuciones, ajustes manuales. Útil para rastrear discrepancias.",
  },
  "/tiendas/": {
    title: "Tiendas y almacenes",
    text: "Panel central de tu negocio. Desde aquí ves el resumen de todas tus sucursales y almacenes, y puedes entrar a administrar cada una.",
  },
  "/tablero/": {
    title: "Dashboard general",
    text: "Métricas generales de tu negocio: ventas totales, productos más vendidos, rendimiento por tienda. Visión global para tomar decisiones.",
  },
  "/auditoria-transacciones/": {
    title: "Auditoría",
    text: "Herramientas para detectar inconsistencias: ventas duplicadas, logs repetidos y discrepancias de stock. Ejecuta análisis por rango de fechas.",
  },
  "/vendedores/": {
    title: "Vendedores",
    text: "Administra las cuentas de tus vendedores. Asigna tiendas, gestiona accesos y consulta las ventas realizadas por cada uno.",
  },
  "/pagos/": {
    title: "Pagos del servicio",
    text: "Historial de pagos de tu suscripción a SmartVenta. Consulta vigencia, meses pagados y montos.",
  },
  "/servicios/": {
    title: "Servicios adicionales",
    text: "Conoce los servicios extra disponibles para tu negocio: tiendas adicionales, impresoras, integraciones y más.",
  },
  "/sincronizar/": {
    title: "Sincronizar",
    text: "Si el sistema está lento, usa esta opción para optimizar la velocidad. El proceso tarda aproximadamente 3 minutos.",
  },
};

export default helpTexts;
