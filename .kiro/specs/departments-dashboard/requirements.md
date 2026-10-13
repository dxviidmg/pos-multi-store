# Tablero Por departamento — Requisitos

## Historia
Como dueño quiero elegir un departamento y ver, por cada tienda, cuánto vendió y cuánto tengo invertido en inventario, para decidir dónde surtir o liquidar.

## Criterios de aceptación
1. Enlace "Por departamento" en el menú Tableros, ruta `/tablero-departamentos/`, solo dueño en vista general.
2. Filtros: departamento (select, incluye "Sin departamento"), año y mes ("Todo el año" = 0). Sin departamento elegido se pide seleccionarlo y no se consulta.
3. El cálculo corre como tarea asíncrona: progreso y cuenta regresiva como los demás tableros.
4. Una gráfica de barras por tienda (no almacenes) con tres series: **Ventas**, **Inversión** y **Total** (ventas + inversión).
5. **Ventas**: solo ventas exitosas del departamento dentro del año y mes elegidos (excluye canceladas y apartados en curso).
6. **Inversión**: existencia actual × costo del departamento en esa tienda; no depende del periodo.
7. Montos con `formatCurrency`. Ayuda de la ruta en `helpTexts.js` y README actualizado.

## Fuera de alcance
Utilidad, rotación, comparativo contra otro periodo, exportación a Excel (posibles siguientes pasos).
