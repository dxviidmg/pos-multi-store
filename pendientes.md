# Pendientes

## Backend

- **Nombre del usuario para el saludo.** `/tiendas/` saluda con `user.first_name || user.username`; confirmar que el login devuelva `first_name` (hoy no se verificó qué campos trae la respuesta).
- **Importación desde otro sistema: falta probar de punta a punta.** Los endpoints `products/eleventa/import-validation` y `products/eleventa/import` están escritos y su lectura/validación está probada con `inventario jugueteria.xls`, pero las vistas (consulta de códigos existentes, alta de productos, stock y logs) no se ejecutaron contra Django. Probar en `/importar-productos/`, modo Especial, con una tienda y con varias sucursales (tarea 12 de `.kiro/specs/eleventa-import/tasks.md`).

## Refactor

Auditoría del 13 de octubre de 2026 contra las reglas de `AGENTS.md` §12. Lo que quedó resuelto se quitó de aquí; lo siguiente se dejó a propósito o queda por vigilar.

- **Componentes cerca del límite de ~300 líneas:** `ProductModal` (284), `MainLayout` (282), `Login` (265), `Registration` (264) y `StockModal` (262). Vigilarlos si crecen.
- **Exports de permisos sin uso, conservados a propósito:** `isStoreView` e `isAdmin` (y `ROLES`/`getRole`, que solo se usan dentro del archivo) forman la API de permisos que documenta `AGENTS.md` §6.
- **Peticiones en `useEffect` convertibles a `useQuery`:** las listas simples (`SubscriptionList`, `TenantPaymentList`, `Profile`, `StockUpdateRequestList`, `DistributionList`) ya tienen guard de respuesta vieja, pero siguen cargando con `useEffect`; migrarlas a `createQueryHook` quitaría su estado de carga manual (regla 3).
- **Sin pruebas:** el guard de respuesta vieja en cada lista, `usePrinterStatus` y `BarcodeScanner` (dependen de WebSocket y cámara) y la mayoría de las pantallas.
- `admin/StoreList/StoreList.jsx` conserva el alto del contenido al cambiar de pestaña (`lockedHeight`) para que no salte el scroll; si se rediseña la carga de esa vista, valorar si sigue haciendo falta.
- `ui/Field/fieldIcons.js` elige el ícono por el texto de la etiqueta; si se renombran etiquetas, revisar sus reglas (hay pruebas en `fieldIcons.test.js`).
