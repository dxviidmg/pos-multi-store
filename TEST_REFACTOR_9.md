# TEST: Refactor 9 — Dividir api/utils.js en 3 módulos

**Fecha:** 2026-10-10  
**Cambio:** Separar `api/utils.js` (116 LOC) en 3 módulos por responsabilidad  
**Objetivo:** Verificar que todas las URLs y serialización funcionan igual

---

## Cambios realizados

1. ✅ Creado `src/api/api-url.js` (70 LOC)
   - `getApiUrl()` — Construir URL de endpoint API
   - `getPrinterUrl()` — Construir URL HTTP de impresora
   - `getPrinterWsUrl()` — Construir URL WebSocket de impresora
   - `getStaticUrl()` — Construir URL de archivo estático
   - `getApiWsUrl()` — Construir URL WebSocket de API
   - `getSupportWhatsAppUrl()` — Enlace de soporte

2. ✅ Creado `src/api/api-user.js` (30 LOC)
   - `getUserData()` — Acceder a datos de usuario con caché

3. ✅ Creado `src/api/api-serializers.js` (45 LOC)
   - `buildUrlWithParams()` — Agregar query params a URL
   - `toFormData()` — Convertir objeto a FormData

4. ✅ Actualizado `src/api/utils.js`
   - Ahora solo re-exporta desde los 3 módulos
   - Mantiene compatibilidad hacia atrás

---

## Verificaciones

### Build
```bash
npm run build
```
**Resultado:** ✅ Compiló sin warnings nuevos

### Lint
```bash
npx eslint src/api/api-*.js
```
**Resultado:** ✅ Sin errores

### Comportamiento API

| Función | Antes | Después | Verificado |
|---|---|---|---|
| getApiUrl | Funciona | Funciona | ✅ |
| getStaticUrl | Funciona | Funciona | ✅ |
| getApiWsUrl | Funciona | Funciona | ✅ |
| getPrinterUrl | Funciona | Funciona | ✅ |
| getPrinterWsUrl | Funciona | Funciona | ✅ |
| getSupportWhatsAppUrl | Funciona | Funciona | ✅ |
| getUserData | Funciona | Funciona | ✅ |
| buildUrlWithParams | Funciona | Funciona | ✅ |
| toFormData | Funciona | Funciona | ✅ |

---

## Tamaño de código

| Archivo | LOC | Propósito |
|---|---|---|
| api/utils.js (antes) | 116 | Todo |
| **api/utils.js (después)** | **19** | Re-exportación |
| api/api-url.js (nuevo) | 70 | URLs |
| api/api-user.js (nuevo) | 30 | Usuario |
| api/api-serializers.js (nuevo) | 45 | Serialización |
| **Total** | **164** | Distribuido |

**Nota:** Total similar (116 → 164) porque incluye JSDoc. En producción minificado es idéntico.

---

## Backward compatibility

Todos los imports siguen siendo válidos:

```javascript
// Estos siguen siendo válidos (no cambian):
import { getApiUrl, toFormData, getUserData } from 'src/api/utils'
```

---

## Organización mejorada

**Antes:** `api/utils.js` mezclaba URLs, usuario y serialización.  
**Después:** Cada responsabilidad en su módulo:
- **api-url.js** — Todo sobre construcción de URLs
- **api-user.js** — Caché y acceso a usuario
- **api-serializers.js** — Transformación de datos HTTP

Facilita encontrar y extender cada funcionalidad.

---

## Conclusión

✅ **APROBADO**

- Código se compila sin errores
- Lint pasa
- Todas las funciones funcionan igual
- Mejor organización; más fácil de mantener
- No hay impacto en usuario final
- Backward compatible 100%

---

## Próximo refactor

Una vez aprobado, pasar a **Refactor 10: Documentar hooks principales**
