# Tablero Por departamento — Diseño

## Backend (se tocó con permiso de David, solo esta vez)
- `GET /api/department-dashboard/?department_id=&year=&month=` → `{ task }`. `department_id=0` = sin departamento; `month=0` = todo el año.
- Tarea `get_department_dashboard` en `sales/tasks.py`; vista `DepartmentDashboardView` en `sales/views.py`; ruta en `sales/urls.py`; documentado en `BENCHMARK_FEATURES_API.md` §17.3b.
- Resultado: `{ "stores": [{ "id", "name", "sales", "investment", "total" }] }`, solo tiendas (`T`).

## Frontend
- `api/dashboards.js`: `getDepartmentDashboard`.
- `admin/Dashboard/DepartmentDashboard.jsx`: `useTaskPolling`, `Filters` con select de `useDepartments`, `DashboardLoading`, `EmptyState` y un `BarChart` por tienda.
- `App.js`, `ROUTE_ACCESS`, `menu-config.js`, `helpTexts.js`.
