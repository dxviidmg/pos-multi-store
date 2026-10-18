# Importar productos desde un reporte de Eleventa — Requisitos

> Ruta: `/importar-productos/`. Fecha: 11 de octubre de 2026. Estado: borrador para aprobación.

## Contexto

Varios clientes llegan de Eleventa y entregan su reporte de inventario. Hoy tendrían que reacomodarlo a mano en la plantilla de importación. La pantalla ofrecerá **dos modos**: el actual (plantilla) y uno nuevo (reporte de Eleventa), con sus propias validaciones.

Archivo de referencia: `inventario jugueteria.xls` (4,947 productos). Es un archivo de texto separado por tabuladores en codificación Latin-1 con extensión `.xls`, no un Excel real. Columnas:

`Codigo · Descripcion · Precio Costo · Precio Venta · Precio Mayoreo · Inventario · Inv. Minimo · Departamento`

Hallazgos en ese archivo que la funcionalidad debe manejar:

| Hallazgo | Cantidad |
|---|---|
| Códigos con espacios al inicio o al final | muchos |
| Dinero con formato `$1,234.00` | todas las filas |
| Departamento `- Sin Departamento -` | 185 |
| Costo `$0.00` | 139 |
| Precio de venta menor que el costo | 6 |
| Precio mayoreo mayor que 0 (sin cantidad mínima) | 97 |
| Inventario `0` | 603 |
| Códigos duplicados | 0 (pero puede haberlos en otros reportes) |

## Reparto de responsabilidades

El **backend** lee el archivo de Eleventa, lo valida (R2, R3, R4) y lo importa, con endpoints nuevos (ver `design.md`). El **frontend** sube el archivo, muestra errores, deja elegir los productos con inventario 0 (R6) y manda la lista de exclusiones. Este repositorio no modifica el backend; el contrato queda en `design.md` y el pendiente en `pendientes.md`.

## Historias y criterios de aceptación

### R1. Elegir el modo de importación
Como usuario quiero elegir entre "Tradicional" (plantilla) y "Especial" (reporte de inventario de otro sistema).
- R1.1 La pantalla muestra un selector de modo arriba. El modo por defecto es "Tradicional".
- R1.2 El modo actual no cambia en nada de su comportamiento.
- R1.3 Cambiar de modo reinicia archivo, validación y selección. No se arrastra estado entre modos.
- R1.4 El botón "Descargar plantilla" solo aparece en el modo Tradicional.

### R2. Leer el reporte de Eleventa
- R2.1 Acepta el archivo tal como lo exporta Eleventa: texto con tabuladores (también coma o punto y coma, por si se guardó como CSV) en Latin-1 (`.xls`/`.txt`/`.csv`) y también Excel real (`.xls`/`.xlsx`).
- R2.2 Reconoce las columnas por su encabezado (sin distinguir acentos, mayúsculas ni espacios extra). Si falta `Codigo`, `Descripcion`, `Precio Costo` o `Precio Venta`, muestra "No se pudo leer el archivo" con las columnas que faltan.
- R2.3 Convierte el dinero (`$1,234.00`) y el inventario a número. Las columnas `Precio Mayoreo` e `Inventario` son opcionales; si faltan se tratan como vacías.
- R2.4 Ignora `Inv. Minimo`.
- R2.5 Quita espacios al inicio y al final de código, descripción y departamento.
- R2.6 Límite de 10,000 filas, igual que el modo actual. Si se excede, se rechaza el archivo completo.
- R2.8 Codificación: el archivo de referencia usa Latin-1 (`ñ` = byte `F1`), así que se decodifica como Windows-1252 y la `ñ` sale bien. Como respaldo, si tras decodificar queda el carácter `�` (U+FFFD) en código, nombre o departamento, se sustituye por `ñ`.
- R2.7 Archivo sin filas de datos: "El archivo está vacío".

### R3. Valores fijos y por defecto
- R3.1 **Marca:** campo de texto obligatorio con valor inicial `Sin marca`. Todos los productos importados llevan esa marca; se crea si no existe.
- R3.2 **Departamento:** se usa el de Eleventa y se crean los que no existan. Si el departamento dice textualmente `- Sin Departamento -` (tras quitar espacios) o viene vacío, el producto se importa con departamento `null`; ese texto nunca se crea como departamento.
- R3.3 **Unidad:** `PZ` para todos (Eleventa no la trae).
- R3.4 **Mayoreo con descuento de cliente:** No.
- R3.6 **Mayoreo:** antes de validar, un aviso explica que el reporte no incluye la cantidad mínima de mayoreo y se debe elegir (obligatorio): "Usar una cantidad mínima" (campo entero ≥ 2, por defecto 2, que se aplica a todos los productos con precio mayoreo mayor a 0) o "Solo precio de menudeo" (se ignora el precio mayoreo).
- R3.5 No se muestran las preguntas "¿Crear marcas?", "¿Crear departamentos?" ni "¿Deptos obligatorios?"; en este modo son fijas (sí, sí, no).

### R4. Validaciones por fila (modo Eleventa)
Cada fila con problema aparece en la tabla de errores con su número de fila del archivo y el motivo. Se importa solo si no queda ningún error (misma regla que el modo actual).
- R4.1 Código vacío → "Sin código".
- R4.2 Descripción vacía → "Sin nombre".
- R4.3 Código repetido en el archivo → "Código existente en la fila N" (la primera aparición es la válida).
- R4.4 Costo vacío o ≤ 0 → "Costo debe ser mayor a 0".
- R4.5 Precio de venta vacío o ≤ 0 → "Precio de venta debe ser mayor a 0".
- R4.6 Costo ≥ precio de venta → "Costo debe ser menor que precio de venta".
- R4.7 Mayoreo (aplica solo si se eligió usar cantidad mínima, R3.6): precio mayoreo inválido → "Precio mayoreo inválido"; mayor que el precio de venta → "Mayoreo mayor al precio de venta"; menor que el costo → "Mayoreo menor que el costo". Mayoreo en 0 o vacío es válido (sin mayoreo).
- R4.8 Inventario negativo o no numérico → "Inventario debe ser un número mayor o igual a 0".
- R4.9 Nombre de más de 100 caracteres: se recorta a 100 (igual que el backend) y no es error.
- R4.10 Además de R4.1–R4.8, el backend valida lo que ya valida hoy (código ya existente en el sistema, etc.). Todos los errores se muestran en la misma tabla.
- R4.11 El backend devuelve todas las filas con su estado en una sola respuesta; el usuario corrige el archivo y vuelve a validar.
- R4.12 Resultado de validación igual al modo actual: "N filas correctas, M con errores".

### R5. Inventario (stock)
- R5.1 Si el backend permite agregar stock (negocio con una sola tienda, primera importación; `getImportCanIncludeQuantity`), se pregunta "¿Agregar inventario?" y, si es sí, la columna `Inventario` se importa como cantidad.
- R5.2 Si no lo permite (varias sucursales o ya hay stock), no se pregunta y el inventario del archivo se ignora; se muestra un aviso breve que lo explica.

### R6. Productos con inventario 0
Después de validar sin errores, si el inventario se importa y hay productos con inventario 0:
- R6.1 Se muestra un aviso con el conteo ("603 productos tienen inventario 0") y una tabla seleccionable con esos productos (código, nombre, departamento, costo, precio).
- R6.2 La explicación indica los dos casos: productos que no hay por ahora pero se volverán a surtir (conviene importarlos) y productos que ya no se venderán (conviene no importarlos).
- R6.3 Por defecto todos quedan **seleccionados** (se importan). El usuario desmarca los que no quiere. Hay acciones "Seleccionar todos" y "Quitar todos".
- R6.4 Los productos con inventario 0 que se desmarcan **no se importan**; el resto sí.
- R6.5 Solo aplica cuando el inventario se importa (R5.1). Si el inventario se ignora (R5.2, varias tiendas), no se muestra la sección y se importan todos los productos.
- R6.6 Antes de importar se ve el resumen: renglones originales del archivo, cuántos se quitaron por errores (filas quitadas en la tabla de errores) y cuántos por inventario 0 (desmarcados), y cuántos se importarán con su porcentaje del total original (por ejemplo "Se importarán 4,171 (78%)").
- R6.7 Sin productos en 0, no aparece la sección.

### R7. Importar
- R7.1 El botón Importar se habilita con archivo validado, sin errores y al menos un producto seleccionado para importar.
- R7.2 Al terminar: mensaje "Productos importados", se limpia el formulario y se invalidan las opciones de catálogo (marcas/departamentos), como hoy.
- R7.3 Errores del servidor se muestran con `showRequestError`.

### R8. Permisos y ayuda
- R8.1 Mismos permisos de ruta que hoy (`ROUTE_ACCESS`); no se agregan rutas.
- R8.2 Actualizar la ayuda de la ruta en `helpTexts.js` y la descripción en `pageMeta.js`.
- R8.3 Actualizar `README.md` en lenguaje de cliente (importar desde Eleventa, qué pasa con inventario en 0).

## Fuera de alcance
- Implementar el backend desde este repositorio (otro repositorio; se documenta el contrato).
- Actualizar productos existentes (el backend los marca "Código existente en el sistema").
- Importar clientes, ventas o proveedores de Eleventa.
- Mapeo de columnas manual por el usuario.

## Preguntas abiertas
1. Decidido: productos con inventario 0 quedan todos seleccionados por defecto (R6.3).
2. Decidido: el usuario elige entre cantidad mínima por defecto o solo menudeo (R3.6); ya no es error.
