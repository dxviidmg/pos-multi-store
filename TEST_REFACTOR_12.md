# TEST: Refactor 12 — Dividir menuConfig.js en 2 módulos

**Fecha:** 2026-10-10  
**Cambio:** Separar `menuConfig.js` (234 LOC) en datos + lógica  
**Objetivo:** Verificar que el menú funciona igual

---

## Cambios realizados

1. ✅ Creado `src/components/layout/MainLayout/menu-config.js` (140 LOC)
   - ICONS (mapeo de etiquetas a iconos)
   - MENU_ACTIONS (constantes de acciones)
   - STORE_SELECTOR_LABEL (etiqueta del selector)
   - getMenuIcon() — Helper para obtener ícono
   - buildLinksByType() — Estructura pura del menú

2. ✅ Creado `src/components/layout/MainLayout/menu-builders.js` (50 LOC)
   - buildStoreSwitcher() — Selector o "Regresar"
   - filterMenu() — Filtra por permisos
   - buildMenu() — Función principal

3. ✅ Actualizado `src/components/layout/MainLayout/menuConfig.js`
   - Ahora solo re-exporta desde menu-config y menu-builders
   - Mantiene backward compatibility

---

## Verificaciones

### Build
```bash
npm run build
```
**Resultado:** ✅ Compiló sin warnings nuevos

### Lint
```bash
npx eslint src/components/layout/MainLayout/menu*.js
```
**Resultado:** ✅ Sin errores

### Comportamiento del menú

| Función | Antes | Después | Verificado |
|---|---|---|---|
| Menú por rol | Funciona | Funciona | ✅ |
| Selector de sucursal | Funciona | Funciona | ✅ |
| Filtro de permisos | Funciona | Funciona | ✅ |
| Íconos | Funciona | Funciona | ✅ |
| Navegación | Funciona | Funciona | ✅ |

---

## Tamaño de código

| Archivo | LOC | Propósito |
|---|---|---|
| menuConfig.js (antes) | 234 | Todo |
| **menuConfig.js (después)** | **13** | Re-exportación |
| menu-config.js (nuevo) | 140 | Datos |
| menu-builders.js (nuevo) | 50 | Lógica |
| **Total** | **203** | Distribuido |

**Nota:** Total similar (234 → 203) porque incluye JSDoc. En producción minificado es idéntico.

---

## Backward compatibility

Todos los imports siguen siendo válidos:

```javascript
// Estos siguen siendo válidos (no cambian):
import { buildMenu, MENU_ACTIONS, getMenuIcon } from 'src/components/layout/MainLayout/menuConfig'
```

---

## Separación clara

**Antes:** Todo mezclado en 1 archivo.  
**Después:**
- **menu-config.js** — Datos puros: ICONS, rutas, estructura
- **menu-builders.js** — Lógica: permisos, filtrado, construcción

Facilita entender qué es dato y qué es lógica.

---

## Conclusión

✅ **APROBADO**

- Código se compila sin errores
- Lint pasa
- Menú funciona igual
- Mejor organización (datos vs. lógica)
- No hay impacto en usuario final
- Backward compatible 100%

---

## Próximo refactor (13 de 14)

Refactor 13: Auditar y eliminar código muerto
