# Corregir errores de importación en la tabla — Requisitos

> Mejora de `.kiro/specs/eleventa-import/` (modo Especial de `/importar-productos/`). Fecha: 11 de octubre de 2026. Estado: borrador.

## Problema

Hoy, si el archivo tiene filas con error (por ejemplo 184), el usuario debe salir, corregir el archivo, volver a cargarlo y validar de nuevo. Quiere corregir en la misma tabla de errores.

## Historias y criterios de aceptación

### R1. Editar una fila con error
- R1.1 En el modo Especial, la tabla "Filas con error" muestra campos editables: código, costo, precio unitario y, solo con "Usar una cantidad mínima", precio mayoreo (con "Solo precio de menudeo" esa columna no existe). "Número de fila", "Nombre", "Departamento" y "Estado" son de solo lectura (una fila "Sin nombre" solo se puede quitar). La tabla no muestra "Cantidad mínima mayoreo" ni "Inventario".
- R1.2 Cada fila tiene un botón "Guardar" (solo ícono, con tooltip) que se habilita cuando el usuario cambió algún valor de esa fila.
- R1.3 Al guardar, el sistema vuelve a validar. Si la fila ya no tiene error, desaparece de la tabla. Si sigue con error, se queda con el motivo nuevo en "Estado" y una alerta "No se pudo corregir la fila N" muestra el motivo.
- R1.4 La revalidación considera todo el archivo: corregir un código repetido o existente puede dejar válida la otra fila involucrada.
- R1.5 La revalidación no muestra alertas mientras queden errores. Cuando ya no queda ninguno, muestra "Archivo cargado: Todas las filas están bien" (igual que la validación normal) y aparece la selección de inventario 0 si aplica.
- R1.6 Los valores editados no se pierden al paginar la tabla ni al guardar otra fila. La tabla conserva la página actual cuando una fila sale de la lista (si la página queda vacía, retrocede a la última con filas).

### R2. Quitar productos
- R2.1 Cada fila tiene un botón "Quitar" (solo ícono, con tooltip). El producto quitado no se importa y sale de la tabla.
- R2.2 Botón "Quitar todas" en el encabezado de la tabla, con confirmación ("Se quitarán N productos con error y no se importarán").
- R2.3 Quitar filas también revalida (una fila "Código existente en la fila N" queda válida si se quita la fila N).

### R3. Resultado y resumen
- R3.1 Las filas editadas se importan con sus valores corregidos; las quitadas no.
- R3.2 El resumen "Se importarán X de Y productos" cuenta solo las filas que no se quitaron.
- R3.3 Cambiar el archivo, o terminar una importación, descarta todas las ediciones y quitados.
- R3.4 El archivo original no se modifica.

### R4. Reglas de edición
- R4.0 Los campos de costo, precio unitario y precio mayoreo solo aceptan números de 0 o más, con hasta dos decimales; cualquier otro carácter (letras, signo menos, símbolos) no se escribe. El código acepta texto libre.
- R4.1 Se aplican las mismas validaciones de siempre (R4 de `eleventa-import`); no hay validación distinta en la tabla.
- R4.2 Un precio mayoreo vacío equivale a sin mayoreo. Con "Solo precio de menudeo" no hay precio mayoreo en la tabla.

## Fuera de alcance
- Editar filas que no tienen error.
- Descargar el archivo corregido.
- Editar la cantidad mínima de mayoreo por fila.
- Deshacer una edición o un quitado (se reinicia cargando el archivo otra vez).

## Preguntas abiertas
Ninguna: decisiones tomadas en el diseño (ver `design.md`).
