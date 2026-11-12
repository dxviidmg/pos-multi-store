# Catálogo de productos para clientes — Dise_ño

## Ruta y permisos
- `App.js`: `<Route path="/catalogo/" element={<Lazy><ProductCatalog /></Lazy>} />`, con `lazyRetry`.
- `routeAccess.js`: `"/catalogo/": { G: OWNER }`.
- `menu-sections.js`, sección `products`: pestaña `{ label: "Catálogo", fullLabel: "Catálogo", href: "/catalogo/" }`.
- `helpTexts.js`: ayuda de `/catalogo/`.

## Archivos
```
src/components/products/ProductCatalog/
├── ProductCatalog.jsx          # Pantalla: PageHeader, filtros, tabla, botón PDF
├── ProductCatalog.columns.jsx  # Columnas (código, nombre, precio)
├── useCatalogPdf.js            # Estado de generación + import() dinámico + alertas
└── catalogPdf.js               # Construye el PDF con jsPDF (función pura de datos → Blob)
src/api/catalog-products.js     # getProducts ya existe; se reutiliza
```
Reglas puras (nombre de archivo, filas del PDF) en `catalogPdf.js` para probarlas sin DOM.

## Pantalla
- `PageHeader` con título "Catálogo" y `PageHelp`.
- Campos obligatorios `TextField` "Nombre del catálogo" y "Válido hasta" (`type="date"`, `min` hoy); `Switch` "Incluir precio de mayoreo". El botón PDF se habilita solo con selección, productos, nombre y fecha válida (`isValidUntilDate`).
- Fila de filtros (`Grid`): `Select` "Filtrar por" (Marca/Departamento), `CatalogAutocomplete` del valor elegido (opciones de `useCatalogOptions`), `Switch` "Incluir productos sin stock" y `Switch` "Incluir imágenes" (bloqueado por `getImagePolicy`), más un `Alert` con la cobertura de imágenes. Reglas puras en `catalogData.js`: `filterCatalogProducts`, `getImageCoverage`, `getImagePolicy`.
- `DataTable` con `noDataComponent` ("Elige una marca o un departamento para ver sus productos") y `progressPending`.
- `DataTable` con `setSelectedRows` y `selectedIds`: el estado guarda los ids **excluidos** (`excludedIds`), así los productos nuevos entran marcados. Se reinicia al cambiar el filtro.
- Botón `CustomButton` "Descargar PDF" en las acciones del `PageHeader`.
- Carga de productos con `useFilteredList(getProducts, params, "cargar los productos")`; se dispara al cambiar el valor elegido. Al cambiar el tipo, se limpia el otro filtro (`brand_id` / `department_id`).

## PDF (`catalogPdf.js`)
- `jspdf` + `jspdf-autotable` importados con `import()` dentro de `useCatalogPdf`.
- Encabezado: negocio (`user`/`useTenantInfo`), título de la marca o departamento, fecha.
- Sin imágenes: tabla de 3 columnas (Código, Producto, Precio).
- Con imágenes: filas con miniatura a la izquierda; las imágenes se descargan en paralelo con `fetch` → `blob` → `convertImageToWebp`-like reducción a ≤300 px, para no inflar el PDF. Falla de una imagen → marcador, no aborta.
- Pie con número de página.
- Salida: `doc.save(nombre)`.

## Verificación del API (18 de octubre de 2026, lectura del backend)
- `ProductViewSet.get_queryset` (`products/views.py`) filtra por `brand_id` y `department_id`, limita al tenant y ordena por `brand__name, name`.
- `REST_FRAMEWORK` no define paginación y `ProductViewSet` no tiene `pagination_class`: `GET product/` devuelve la lista completa. El PDF no sale truncado.
- `department_id=0` ("Sin departamento") **no** lo maneja `ProductViewSet` (filtra `department__id=0` y devuelve vacío). El selector del catálogo no ofrece esa opción.
- `ProductSerializer` expone `unit_price`, `brand_name`, `department_name`, `image`.
- Imágenes: viven en S3 (`AWS_S3_CUSTOM_DOMAIN`, `AWS_QUERYSTRING_AUTH = False`, URL pública). `CORS_ALLOW_ALL_ORIGINS` de Django no aplica a S3; la política CORS es del bucket y no se pudo comprobar desde aquí. **Prueba pendiente:** abrir `/catalogo/` y cargar una imagen con `fetch` desde `localhost:3000`. Si falla, anotar en `pendientes.md` (configurar CORS GET en el bucket) y dejar "con imagen" detrás de ese arreglo.

## Riesgos
| Riesgo | Mitigación |
|---|---|
| CORS en imágenes | Verificar con `getStaticUrl`; si bloquea, anotar en `pendientes.md` y ofrecer solo "sin imagen" |
| Muchos productos con imagen (PDF pesado, lento) | Miniaturas ≤300 px, carga con concurrencia limitada, indicador de progreso |
| Peso del bundle | `import()` dinámico; verificar con `npm run build` |

## Pruebas
- `catalogPdf.test.js`: nombre de archivo y armado de filas (precio formateado, marcador sin imagen).
- `ProductCatalog.test.jsx`: mockea hooks de datos y `DataTable`; sin selección muestra mensaje, botón deshabilitado; con productos habilita el botón.
