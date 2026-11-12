# Menú con secciones y pestañas — Diseño

## Datos: `layout/MainLayout/menu-sections.js`
Configuración pura. Una lista `SECTIONS` con `id`, `label` (entrada del menú) y `tabs`: `{ label, fullLabel, href }`.
- `label` es el texto de la pestaña; `fullLabel` es el nombre de la entrada cuando solo queda esa pestaña ("Movimientos en caja", "Historial de cambio de precios").
- Helpers puros: `getSectionByPath(pathname)` y `getAccessibleTabs(user, section)` (filtra con `canAccessRoute`).
- Cada ruta pertenece a una sola sección.

## Menú: `menu-config.js` y `menu-builders.js`
- `buildLinksByType` deja de repetir enlaces por vista. Cada vista lista sus entradas en orden, y las secciones por `id`: `{ section: "sales" }`.
- `filterMenu` convierte una entrada de sección en `{ label, href, sectionId }` con la primera pestaña accesible, o en enlace directo con `fullLabel` si solo queda una. Sin pestañas accesibles, la quita.
- Se eliminan los duplicados por rol (`hidden: seller` en Ventas, Caja, Movimientos): `ROUTE_ACCESS` ya los resuelve.
- El estado activo del sidebar usa `sectionId` además de la ruta exacta.
- "Tableros" sigue como `dropdown`.

## Componente: `ui/SectionTabs.jsx` (lo dibuja `PageHeader`)
- `Tabs` de MUI con `Tab component={Link} to={href}`, `value` = ruta actual, `variant="scrollable"` con `allowScrollButtonsMobile`.
- Recibe `user` y `section` (o `pathname`); si hay menos de dos pestañas accesibles, no renderiza nada.
- Lo renderiza `PageHeader` (salvo con `plain`) al inicio de la card de la página, según `getSectionByPath(pathname)`. Así las tabs quedan dentro de la card blanca y las páginas no cambian.

## Importación de productos
`ProductImport.jsx` cambia sus `Tabs` por un `ToggleButtonGroup` con `fullWidth` y `exclusive`. Mantiene el estado local, el `key` que remonta y el prop `tabs` que reciben `TraditionalImport` y `EleventaImport`.

## Riesgos
- Rutas repetidas en `App.js` (`/pagos/`, `/suscripciones/`, `/mi-plan-actual/` están también en el bloque de acceso bloqueado): los tabs deben funcionar en ambos.
- Con `access_blocked` el menú solo debe mostrar Facturación y Perfil.
- La barra de pestañas no debe aparecer en Vender ni Distribuir.
