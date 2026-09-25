# Instrucciones para Claude Code — SmartVenta Frontend

## Fuente única de conocimiento

Este proyecto usa **`RULES.md`** como fuente compartida de instrucciones, reglas y convenciones. No duplicar este contenido aquí. Siempre revisar `RULES.md` como referencia autorizada.

Todos los agentes (Claude Code, Kiro, Codex) deben usar los mismos archivos: consulta `RULES.md` antes de hacer cambios que afecten arquitectura, UI, backend, API, base de datos o workflow.

## Cuándo consultar RULES.md

Revisar `RULES.md` **antes de hacer cualquier cambio** en:

- **Arquitectura**: Estructura de carpetas, componentes, hooks, utilidades
- **Componentes UI**: Cambios en componentes reutilizables o creación de nuevos
- **Stack y dependencias**: Agregar, actualizar o remover librerías
- **Patrones de código**: Cambios en cómo se usan hooks, API, estado global, alertas
- **Reglas de negocio**: Roles, permisos, validaciones
- **Convenciones**: Nombres de archivos, commits, variables, idiomas
- **Tablas y datos**: Cambios en DataTable, SimpleTable, formateo de datos
- **Notificaciones y WebSocket**: Cambios en tiempo real
- **Git workflow**: Ramas, commits, README updates

## Estructura del proyecto

```
src/
├── components/        # Componentes por dominio (admin, catalog, clients, etc.)
├── api/               # Clientes HTTP y endpoints
├── hooks/             # Hooks personalizados
├── constants/         # Constantes del proyecto
├── utils/             # Funciones utilitarias
├── theme/             # Tema y colores
├── redux/             # Redux (solo para carritos multi-pestaña)
└── pages/             # Rutas/páginas

.kiro/
├── specs/             # Especificaciones de features (design, requirements, tasks)
└── settings/          # Configuración del entorno (LSP, etc.)
```

## Principios clave

- **UI en español**, código en inglés
- **Commits descriptivos** en formato convencional (feat:, fix:, refactor:, docs:, etc.)
- **Componentes reutilizables**: CustomModal, CustomButton, CustomTooltip, DataTable, SimpleTable, PageHeader, etc.
- **Sin duplicación**: Si un componente o hook existe, reutilizarlo
- **Código limpio**: No dejar imports sin usar, no comentar código muerto, eliminar variables no usadas
- **React Query** para estado del servidor, **Redux solo para carritos**
- **Lazy loading** con `lazyRetry()` + `Suspense`

## Contra-reglas (qué NO hacer)

- No usar bootstrap ni react-bootstrap (usar MUI)
- No hardcodear valores hexadecimales de colores (usar tokens del tema)
- No duplicar styled components (extraer a `components/ui/`)
- No pasar props que ya son defaults del componente
- No commitear `.env` con valores reales
- No usar `Swal.fire` directo (usar funciones de `utils/alerts.js`)
- No crear componentes nuevos sin revisar si ya existe uno reutilizable

## Cuando hay conflictos

Si hay una contradicción entre un steering file y una suposición, **prevalece el steering file** (RULES.md), a menos que se indique explícitamente lo contrario.

## Cambios que afectan el README

Al hacer cambios que afecten **funcionalidades, stack o arquitectura documentados**, actualizar:
- Fecha de última actualización en README
- Sección de "Funcionalidades principales" (lenguaje de usuario, sin términos técnicos)
- Sección de Stack si hay cambios de dependencias

---

**Última revisión**: 2026-09-24  
**Estado**: Activo — RULES.md es la fuente autorizada
