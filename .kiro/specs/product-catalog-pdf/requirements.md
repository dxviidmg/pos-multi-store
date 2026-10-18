# Catálogo de productos para clientes — Requisitos

## Historia
Como dueño quiero elegir una marca o un departamento, ver sus productos con precio y descargar un PDF, para enviarle a mis clientes mi catálogo de productos y precios.

## Decisiones tomadas (18 de octubre de 2026)
| Tema | Decisión |
|---|---|
| Ubicación | Nueva pestaña **Catálogo** en la sección Productos (`/catalogo/`), junto a `/productos/` |
| Quién la ve | Solo el dueño, en vista general (igual que `/productos/`) |
| Precio | Precio público (`unit_price`). Sin costo ni stock en pantalla ni en el PDF |
| Selección | Una marca **o** un departamento a la vez |
| Imagen | Según el % de productos con imagen: menos de 25 % → sin imágenes (interruptor bloqueado); más de 75 % → con imágenes (bloqueado); entre 25 % y 75 % decide el usuario |
| Nombre y vigencia | El usuario escribe el nombre del catálogo (obligatorio, título del PDF) y la fecha "Válido hasta" (obligatoria, no anterior a hoy; el PDF la muestra) |
| Mayoreo | Interruptor "Incluir precio de mayoreo" (por defecto sí; la pantalla muestra el % de productos con mayoreo): agrega columnas "Precio mayoreo" y "Cantidad mínima mayoreo"; el precio público se llama "Precio unitario"; productos sin mayoreo muestran "—" |
| Excluir productos | Columna de casillas en la tabla: todos marcados por defecto; el que se desmarca no sale en el PDF aunque cumpla los requisitos. Las casillas se reinician al cambiar de marca o departamento. Los porcentajes de imagen y mayoreo cuentan solo los marcados |
| Stock 0 | Opción "Incluir productos sin stock"; por defecto se omiten (tabla y PDF) |
| Generación | En el navegador con `jsPDF` (sin backend) |
| Pantalla | Parecida a `/productos/`; la interfaz puede cambiar después |

## Criterios de aceptación
1. La pestaña "Catálogo" aparece en la sección Productos solo para el dueño en vista general; un administrador o vendedor que abra `/catalogo/` es redirigido por `RequireAccess`.
2. La pantalla tiene un selector de tipo (Marca / Departamento) y un selector del valor. Sin selección, la tabla muestra un mensaje que invita a elegir.
3. Al elegir, la tabla lista los productos de esa marca o departamento con código, nombre y precio público.
4. La pantalla muestra "X de Y productos tienen imagen (Z %)", calculado sobre los productos que entrarán al PDF. El interruptor "Incluir imágenes" solo se puede cambiar entre 25 % y 75 %. Con imagen, un producto sin imagen se imprime con un marcador neutro.
4b. Un aviso muestra "X de Y productos no tienen stock (Z %)" sobre todos los productos de la marca o departamento elegido, antes de aplicar el filtro de stock.
5. El botón "Descargar PDF" se deshabilita sin productos o mientras se genera, y muestra su estado de carga.
6. El PDF lleva: nombre del negocio, nombre del catálogo escrito por el usuario, "Válido hasta el <fecha larga>" (`formatLongDate`), y por producto nombre, código y precio con `formatCurrency`. Pagina automáticamente y repite el encabezado de columnas.
7. Precio de mayoreo: con el interruptor activo, el PDF y la tabla muestran precio de mayoreo y a partir de cuánto; sin él, solo precio público.
8. El archivo se llama `catalogo-<marca-o-departamento>-<AAAA-MM-DD>.pdf`.
9. Errores de carga o de generación se avisan con `showRequestError` / `showWarning`; nunca falla en silencio.
10. `jsPDF` y el generador se cargan bajo demanda (`import()` al pulsar el botón); no aumentan el chunk `main`.
11. Lint sin avisos, pruebas en verde y `npm run build` sin avisos.

## Fuera de alcance
- Envío del PDF por WhatsApp o correo desde la app.
- Varias marcas o departamentos a la vez.
- Mayoreo por descuento de cliente (`wholesale_price_on_client_discount`).
- Cambios en el backend. Si hace falta un endpoint (p. ej. paginación sin límite), se anota en `pendientes.md`.

## Por confirmar antes de implementar
- CORS del bucket S3 de imágenes (necesario para incrustarlas en el PDF). Ver `design.md` §Verificación del API.
