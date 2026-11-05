# SmartVenta — Auditoría visual

Fecha: 3 de noviembre de 2026. Alcance: solo diagnóstico; no se modificó código de la aplicación.
Método: lectura de `src/theme/`, `src/App.css`, `src/components/ui/`, layout, tableros y búsquedas sobre `src/`. Cada hallazgo cita su evidencia.

## 0. Hallazgo principal

SmartVenta **ya pasó por una modernización visual sistemática** (identidad navy, tokens únicos en `theme/colors.js`, modo claro y oscuro, componentes compartidos). Esta auditoría no encuentra un producto "genérico" que haya que rehacer, sino un sistema sólido con **inconsistencias puntuales y patrones repetitivos**. El plan propone una evolución dirigida, no un rediseño global.

Dos premisas del encargo no aplican al proyecto:

- **No hay Tailwind ni TypeScript.** El sistema es MUI 5 + Emotion + `App.css`/`variables.css` (`package.json`, AGENTS.md §4). No hay conflicto de especificidad entre sistemas ni comprobaciones de tipos que correr.
- **Hay una especificación visual vigente** en AGENTS.md §11 (paleta, radios 16/14/10/8, sombras teñidas de navy, tipografía Inter). Cualquier cambio de tema debe actualizar ese archivo en el mismo cambio.

## 1. Estado actual del diseño

| Área | Estado | Evidencia |
|---|---|---|
| Color | Navy `#121a45` de marca, acento ámbar `#ffb020`, neutros fríos. Tokens por modo (`modes.light/dark`) | `theme/colors.js` |
| Tokens | Sin hex fuera de `colors.js` salvo 3 casos justificados (ver §5) | grep de `#hex` y `rgba(` en `src/components` |
| Estilos inline | 0 usos de `style={{}}` en componentes | grep |
| Tipografía | Inter en todo, escala h1–h6 con tracking negativo, números tabulares en tablas | `theme/typography.js`, `components.js` (`MuiTableBody`) |
| Movimiento | Animaciones definidas en `App.css`; `prefers-reduced-motion` desactiva todo | `App.css:51-112`, `components.js` (`MuiCssBaseline`) |
| Componentes compartidos | 30+ en `components/ui/`, con documentación | AGENTS.md §8 |
| Calidad de base | ESLint sin errores; 23 suites y 185 pruebas en verde | corrida del 3-nov-2026 |

## 2. Problemas identificados

Severidad según el encargo: crítico / alto / medio / bajo. **No se encontraron problemas críticos.**

### Altos

**A1. Radios fuera de la especificación por usar números de MUI.** El tema fija `shape.borderRadius = 10` (`theme/base.js`), así que `borderRadius: 1` equivale a 10 px, `1.5` a 15 px, `2` a 20 px y `3` a 30 px. La especificación define 16/14/10/8. Conteo en `src/components`: `"10px"` ×17, `"50%"` ×8, `"8px"` ×6, `2` ×6, `1` ×6, `"14px"` ×7, `1.5` ×4, `3` ×3, además de `"12px"` ×2, `"4px"` ×2 y `"2px"` ×2. Los valores 15, 20 y 30 px no existen en el sistema y son el origen visual más probable de "tarjetas que no se parecen entre sí".

**A2. Patrón repetitivo de tarjetas de indicadores idénticas.** `KPICard` (`xs: 6, md: 3`) se usa en `Dashboard`, `DepartmentDashboard` y `CancellationsDashboard`; `StatCard` en `PendingTransfersDashboard` y `StockVerificationDashboard`. Cada pantalla abre con una fila de cuatro tarjetas del mismo tamaño y peso, exactamente el patrón que el encargo pide evitar. Los datos son reales; el problema es solo de jerarquía (todas pesan igual).

### Medios

**M1. Elevación al pasar el cursor por todas partes.** `MuiButton contained` aplica `translateY(-1px)` más sombra de marca al hover (`theme/components.js`); `.card-interactive:hover` cambia sombra y borde (`App.css:46-49`); `MuiCard` agrega sombra al hover. Son 7 usos de `translateY` en componentes y tema. En una pantalla de venta con uso continuo, el botón que se desplaza al pasar el ratón distrae y no comunica nada.

**M2. Dos nombres para el mismo gradiente plano.** `SIDEBAR` y `SIDEBAR_DARK` valen lo mismo, así que `gradient.sidebar` es un color plano disfrazado de gradiente (`colors.js:5-6, 54`). Funciona, pero induce a error y dificulta distinguir qué usa gradiente real. Hay 8 archivos que mencionan `gradient`; hay que clasificar cuáles son decorativos (`PlanCard`, `Registration.styles`, `StoreKpiTiles`, `ProductCard`, `Login`) y cuáles estructurales (sidebar, encabezado de modal).

**M3. Animación de entrada en 13 sitios con escalonado fijo de 60 ms.** Aceptable por sí sola, pero `KPICard` combina `fade-in-up` con `card-interactive`, y las páginas ya tienen `page-enter`. Dos entradas anidadas (página y tarjeta) en cada carga de tablero.

**M4. Encabezado de tabla muy contrastado en modo oscuro.** `tableHead` oscuro es `#1b2766`, un azul más saturado que las superficies (`#171b2e`) y que el resto del tema oscuro, que usa neutros fríos. Requiere revisión visual con el tablero abierto, no se puede concluir solo por código.

### Bajos

- **B1.** `borderRadius: "50%"` ×8 es correcto para avatares y puntos, pero conviene unificarlo con un token (`pill`/`circle`).
- **B2.** `Modal.jsx:39` escribe el encabezado con `sx` en una línea larga con 10 propiedades; legible solo con esfuerzo. Es estilo de código, no visual.
- **B3.** El patrón "icono Outlined de 22 px a la derecha, gris" de `KPICard` es decorativo: no aporta información que el título no diga.

## 3. Componentes que deben conservarse

Funcionan, están documentados y tienen pruebas o uso amplio. No tocar salvo ajustes de tokens:

- `CustomModal` + `ModalBody`, `DataTable`, `PageHeader` + `SectionTabs`, `Field/` (iconos por etiqueta), `HeaderPopoverMenu` y menús del header, `EmptyState`, `CardGallery`, `ViewModeToggle`.
- Layout (`MainLayout`, `SidebarMenu`, `SidebarDrawer`): navegación, permisos y estados activos funcionan y están cubiertos por pruebas de menú.
- `theme/colors.js` como fuente única de color y la regla "no hex en componentes".

## 4. Componentes que necesitan mejoras

| Componente | Mejora propuesta | Hallazgo |
|---|---|---|
| `KPICard`, `StatCard` y las filas de 4 indicadores | Jerarquía: un indicador principal más grande y los demás secundarios; quitar el icono decorativo | A2, B3 |
| Radios ad hoc en `sx` | Reemplazar números por valores del sistema (16/14/10/8) | A1 |
| `MuiButton contained` | Quitar el desplazamiento vertical; conservar sombra y color en hover | M1 |
| `.card-interactive` | Aplicarla solo a tarjetas realmente clicables | M1 |
| `colors.gradient.*` | Renombrar o eliminar el gradiente plano; dejar gradientes solo donde aportan | M2 |
| `KPICard` + `page-enter` | Quitar la entrada de tarjeta cuando la página ya anima | M3 |
| Encabezado de tabla (oscuro) | Evaluar un tono más cercano a las superficies | M4 |

## 5. Inconsistencias y excepciones aceptadas

Hex o `rgba` fuera de `colors.js` en `src/components`:

1. `CreateStoreModal.jsx:100`: es el texto de un `placeholder` ("#123"), no un color.
2. `catalogPdf.js:29`: `"#fff"` en un canvas para exportar PDF. Debe seguir blanco en ambos modos.
3. `AuthLayout.jsx:29`: `rgba(255,255,255,0.07)` en un patrón de puntos decorativo sobre el navy del login. Candidato a token si se reutiliza.

No hay otras violaciones de la regla de colores, ni `<Typography onClick>`. Se anotan como límites del sistema, no como defectos.

## 6. Oportunidades de modernización

1. Jerarquía en tableros (A2): mayor impacto visual con cambios solo de presentación.
2. Radios en el sistema (A1): mejora de coherencia sin tocar el aspecto general.
3. Estados hover más sobrios (M1).
4. Estado de tablas: revisar densidad y acciones en `DataTable` con datos reales (el DataGrid no se pinta en jsdom, así que no hay pruebas visuales).
5. Revisión de contraste en ambos modos con una herramienta (no se midió en esta auditoría).

## 7. Riesgos técnicos

- **No hay pruebas visuales.** Las pruebas existentes mockean `DataTable`; ningún cambio de estilo se valida automáticamente. La verificación es manual en navegador, en ambos modos y tres anchos.
- **AGENTS.md y `README.md` se desactualizan** si cambia el tema (radios, hover, gradientes). Deben actualizarse en el mismo cambio, según AGENTS.md §14.
- **Cambios en `theme/components.js` afectan toda la app.** Un ajuste de hover o radio se propaga a toda la app; conviene hacerlos en commits separados y revisables.
- **Los tableros dependen de tareas Celery** y de datos reales; sin datos de prueba es difícil ver los estados cargados.
- **Datos ficticios prohibidos:** cualquier jerarquía nueva en tableros debe usar solo valores que ya se calculan.

## 8. Plan de implementación

Orden adaptado a la arquitectura real; cada paso es un commit atómico con lint, pruebas y revisión manual.

| # | Paso | Archivos principales | Riesgo |
|---|---|---|---|
| 1 | Tokens de radio (`radius.card/panel/field/tag/pill`) en `colors.js`/`variables.css` y regla única en AGENTS.md | `theme/`, `variables.css` | Bajo |
| 2 | Sustituir radios numéricos por tokens (A1) | `src/components/**` (≈40 sitios) | Medio: cambia tamaños visibles |
| 3 | Hover sobrio de botones y tarjetas (M1, M3) | `theme/components.js`, `App.css`, `KPICard` | Bajo |
| 4 | Gradientes: limpiar el plano, clasificar los decorativos (M2) | `colors.js`, 8 archivos | Medio |
| 5 | Jerarquía de indicadores en tableros (A2, B3) | `KPICard`, `StatCard`, 5 tableros | Medio |
| 6 | Revisar encabezado de tabla en oscuro y contrastes (M4) | `colors.js` (`modes.dark`) | Bajo, requiere revisión visual |
| 7 | Revisión de pantallas clave: venta, productos, inventario, traspasos | solo estilos | Medio |
| 8 | Actualizar AGENTS.md §11 y README | docs | Bajo |

Fuera de alcance, por la restricción funcional: lógica, API, permisos, flujos y cálculos. Los hallazgos funcionales encontrados se registran en `pendientes.md`, no se corrigen aquí.

## 9. Estrategia de verificación funcional

Por cada paso:

1. `npx eslint --ext .js,.jsx src` sin errores ni warnings.
2. `CI=true npm test -- --watchAll=false` en verde (base: 23 suites, 185 pruebas).
3. `npm run build` cuando se toquen tema, rutas o imports compartidos.
4. Revisión manual en navegador: modo claro y oscuro, anchos 375, 768 y 1280, y los flujos de las pantallas tocadas (venta, cobro, traspaso, alta de producto).
5. Revisión de consola sin errores nuevos.

**Limitación declarada:** al no existir pruebas de capturas, la ausencia de regresiones visuales solo puede afirmarse para lo que se revise a mano; el informe final lo indicará pantalla por pantalla.

## 10. Estado de las correcciones (3 de noviembre de 2026)

Aplicado y **commiteado en `develop`** el 4 de noviembre de 2026 (bajo riesgo, solo estilos; ESLint limpio y `npm run build` compila). Commits:
`style(radius): use spec px radii…`, `refactor(theme): drop flat gradient.sidebar…`, `style(dashboard): calmer hover…` y `docs: update AGENTS color notes…`.

- **A1 (parcial):** nueve radios numéricos de 15, 20 y 30 px llevados a 14, 16 o 10 px según el tipo de elemento (`PaymentModal`, `Skeleton`, `BarcodeScanner`, `PageHelp`, `HeaderPopoverMenu`, `SearchSuggestions`, `ProductImageField`, `ZeroStockSelector`, `SidebarFooter`). Las barras de progreso e indicadores delgados conservan su valor: se ven como píldora y no cambian.
- **M1:** el botón principal ya no se desplaza al pasar el cursor; `KPICard`, `InsightCard` y la tarjeta de `CancellationsDashboard` dejaron de reaccionar al hover porque no son clicables.
- **M2:** se eliminó `colors.gradient.sidebar` (era un color plano); `Modal`, `Login` y `MainLayout.styles` usan `colors.sidebar`. AGENTS.md actualizado.
- **M3 (4 nov 2026):** se quitó la animación de entrada anidada de `KPICard` (`fade-in-up` + `animationDelay`) y la prop `index`; la página ya anima con `page-enter`. Limpiados los `index={…}` de `Dashboard`, `CancellationsDashboard` y `DepartmentDashboard`.
- **B3 (4 nov 2026):** se retiró el ícono decorativo de `KPICard` (gris, sin información) y la prop `icon`; limpiados los `icon={…}` e imports sin uso en `Dashboard`, `CancellationsDashboard` y `DepartmentDashboard`. `StatCard`/`InsightCard` sin cambios (ícono funcional).

Pendiente de aprobación (cambian la presentación visible):

- **A2:** jerarquía de los indicadores en tableros (indicador principal más grande). No aplicado: estético, subjetivo y no verificable sin navegador.

### M4 — Encabezado de tabla en modo oscuro — aplicado el 5 de noviembre de 2026

`modes.dark.tableHead` pasó de `#1b2766` (índigo saturado, destacaba frente a los neutros fríos del tema oscuro) a `#1f2440` (navy desaturado, por encima de `paper #171b2e` y `border #2a3050` para mantener contraste con el texto blanco). El cambio se propaga a `DataTable`, `SimpleTable`, `StoreComparisonTable`, el header de `Skeleton`, el filtro activo de `StoreQuickFilters` y el botón de `StoreList.columns`. `heroBg` conserva `#1b2766` a propósito (tarjeta destacada del dueño, uso distinto). Bajo riesgo: ESLint limpio, 23 suites / 185 pruebas en verde y `npm run build` compila. Verificación visual en navegador (modo oscuro) pendiente de hacerse a mano.

### Tokens de radio (pasos 1–2) — aplicado el 5 de noviembre de 2026

Bajo riesgo: ESLint limpio, 23 suites / 185 pruebas en verde y `npm run build` compila.

- **Paso 1 — tokens creados.** `colors.radius` en `theme/colors.js` (`card` 16, `panel` 14, `field` 10, `tag` 8, `tooltip` 6, `pill` 999). `cssVariables.js` los publica como `--radius-*` al cambiar de modo; `variables.css` los repite como respaldo estático. `theme/components.js` ahora lee `colors.radius.*` en Button, Paper, Card, Chip, TextField, Select, Dialog, Tooltip, Alert, MenuItem y Skeleton.
- **Paso 2 — radios numéricos a tokens.** Los `borderRadius` sueltos en `sx`/`styled` que coincidían con la spec se cambiaron a `var(--radius-*)`: `14px`→panel (DataTable, Login, Skeleton, DashboardLoading, StoreList, StoreKpiTiles, GridCardBase, ProductCard, SearchSuggestions, PaymentModal, PageHelp, HeaderPopoverMenu, CartItemCard), `16px`→card (BarcodeScanner), `10px`→field (Registration, Login.styles, MainLayout.styles, SidebarFooter, StoreQuickFilters, StorePeriodFilters, TenantSection, ProfileCard, ProductImageField, SearchProduct, ZeroStockSelector, AuthLayout, ConnectionStatusBanner, StockVerificationSnackbar, MultiCart, ConsultDialog, BarcodeScanner), `8px`→tag (StockModal, SaleModeButton, StoreList.columns, ProductCard, subItem, DropZone, tableButtonSx), `6px`→tooltip (BusinessStep), `999`→pill (StoreQuickFilters) y el modal (`{ xs: 2, sm: 3 }` = 20/30px fuera de spec) → card.
- **Se conservan** (excepciones vivas, sin cambio): `"50%"` de círculos/avatares/puntos, `"4px"`/`"2px"` de barras e indicadores delgados y celdas del mapa de calor, `"12px"` de los bloques destacados del registro, `borderRadius: 0` plano y `borderRadius={4}` de `@mui/x-charts` (prop numérica, no CSS).

### Paso 4 — Gradientes decorativos — aplicado el 5 de noviembre de 2026

Revisados todos los usos de gradiente (mucho menos de los 8 que estimaba la auditoría: el `gradient.sidebar` plano ya se había quitado en M2). Clasificación y acción:

- **Conservados (gradientes reales que aportan):** banner superior de la card de registro (`Registration.styles` `headerBannerSx`, navy→navy claro), barra del stepper de registro (`Registration.styles`), barra del `LinearProgress` global (`theme/components.js`, navy→cyan), glows radiales y patrón de puntos del fondo del login (`AuthLayout`, `Login`), glow radial de la tarjeta destacada (`StoreKpiTiles`).
- **Eliminado (plano disfrazado / inconsistente):** el botón "Cambiar tarjeta" de `PlanCard` era el único botón de la app con gradiente; se dejó como `CustomButton` estándar (navy plano, como el resto). Se quitó el import de `colors` que quedó huérfano.
- **Token muerto eliminado:** `colors.gradient.brandHover` ya no se usaba tras quitar `PlanCard`; se eliminó. `colors.gradient.brand` se conserva (lo usa el banner de registro). `colors.shadow.brandHover` (sombra, distinta) no se tocó.
- **Comentario corregido:** `ProductCard` mencionaba un "gradiente primario" que el código ya no tiene.

Bajo riesgo: ESLint limpio, 23 suites / 185 pruebas en verde y `npm run build` compila.

Pendiente:

- **A2:** jerarquía de indicadores en tableros.
