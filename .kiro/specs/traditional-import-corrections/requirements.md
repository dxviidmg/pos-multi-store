# Importación Tradicional: correcciones en tabla e inventario 0 — Requisitos

> Replica en el modo Tradicional de `/importar-productos/` la lógica del modo Especial de `.kiro/specs/eleventa-import/` y `.kiro/specs/eleventa-import-error-editing/`. Fecha: 11 de octubre de 2026. Estado: borrador.

## Qué se replica

1. Corregir en la tabla de errores (editar y guardar, o quitar) sin volver a cargar el archivo.
2. Alerta con el motivo cuando una fila sigue con error tras guardar.
3. "Quitar todas" con confirmación.
4. Selección de productos con inventario 0 (con el resumen y porcentaje).
5. Mensajes, desplazamiento a la tabla, botones, íconos y avisos iguales a los del modo Especial.

No se replica lo propio del reporte de otro sistema: marca fija, opción de mayoreo (cantidad mínima por defecto o solo menudeo), lectura del archivo.

## Historias y criterios de aceptación

### R1. Corregir filas con error
- R1.1 Tras validar, la tabla "Filas con error" muestra "Estado" y campos editables, y "Acciones" al final (mismo orden y botones que el modo Especial). Texto de apoyo: "Tu archivo tiene errores, pero puedes corregirlos desde aquí: el sistema te indica el error de cada fila en la columna Estado."
- R1.2 Campos editables (todos los de la plantilla): código, marca, departamento, nombre, costo, precio unitario, precio mayoreo, cantidad mínima mayoreo, "Permitir mayoreo con descuento de cliente" (Sí/No), unidad (Pieza, Kilogramo, Litro, Bote, Costal) e inventario. "Número de fila" y "Estado" son de solo lectura. La columna de inventario solo aparece con "¿Agregar inventario?" = Sí.
- R1.3 Costo, precio unitario y precio mayoreo solo aceptan números de 0 o más con hasta dos decimales; cantidad mínima mayoreo solo enteros; inventario solo números de 0 o más con hasta tres decimales. Código, marca, departamento y nombre aceptan texto.
- R1.4 Guardar vuelve a validar todo el archivo (con las mismas reglas de siempre). La fila corregida sale de la tabla; si sigue con error se queda con el motivo nuevo y una alerta "No se pudo corregir la fila N" lo muestra.
- R1.5 Quitar descarta el producto. "Quitar todas" pide confirmación. Las revalidaciones no muestran alertas mientras queden errores; al llegar a cero muestra "Archivo cargado: Todas las filas están bien".
- R1.6 El mensaje de la alerta tras validar con errores es: "N filas tienen errores. Corrígelos en la tabla o quita esos productos."
- R1.7 Los valores en edición se conservan al paginar y la tabla mantiene la página.
- R1.8 Cambiar el archivo o terminar la importación descarta ediciones y quitados. El archivo original no se modifica.

### R2. Productos con inventario 0
- R2.1 Con "¿Agregar inventario?" = Sí y sin errores, si hay productos con inventario 0 (o vacío), aparece la tarjeta "Productos con inventario 0" igual que en el modo Especial: texto de apoyo, indicadores (renglones del archivo, quitados por errores, quitados por inventario 0, se importarán con porcentaje), botones Seleccionar todos / Quitar todos / espacio / Importar, y la tabla con búsqueda. Todos vienen marcados.
- R2.2 La pantalla baja sola a la tarjeta cuando se cierra la alerta.
- R2.3 Los desmarcados no se importan. Con "¿Agregar inventario?" = No la tarjeta no aparece.

### R3. Reglas de validación y avisos
- R3.1 Las reglas de validación del modo Tradicional no cambian de significado (mismos mensajes y condiciones), con estas correcciones: la columna "Departamento" de la tabla deja de salir vacía; con "¿Crear departamentos?" = No, un departamento inexistente ya no provoca error 500; costo o precio unitario vacío se marca "Costo y precio(s) deben ser mayores a 0" en lugar de fallar al importar.
- R3.2 Los avisos del formulario son rellenos como en el modo Especial.
- R3.3 La importación vuelve a validar el archivo con las correcciones; con errores no importa nada (antes omitía en silencio los códigos ya existentes).

## Fuera de alcance
- Cambios al formulario de configuración del modo Tradicional (¿Crear marcas?, etc.).
- Editar filas sin error; deshacer ediciones.
- Cambiar la plantilla de importación.

## Decisiones tomadas
- Todos los campos de la plantilla son editables (la usuaria/el usuario lo eligió).
- La selección de inventario 0 aplica igual que en el modo Especial.
