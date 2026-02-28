# 🔄 Hook useFetchWithRetry - Implementado

## ✅ ¿Qué se hizo?

Se creó un hook reutilizable para manejar peticiones con reintentos automáticos y timeout.

## 📁 Archivos

### Creado:
- ✅ `src/hooks/useFetchWithRetry.js` (56 líneas)

### Modificado:
- ✅ `src/components/products/SearchProduct/SearchProduct.jsx` (eliminadas ~60 líneas)

## 🎯 Problema que resuelve

**ANTES:** Cada componente que necesitaba reintentos tenía que implementar su propia lógica:

```javascript
// ❌ Código duplicado en cada componente (~60 líneas)
async function fetchWithTimeout(query, queryType, maxRetries = 2) {
  let attempts = 0;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  
  while (attempts <= maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    try {
      const response = await getStoreProducts(
        { [queryType]: query },
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      return response.data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "CanceledError") {
        attempts++;
        if (attempts > maxRetries) return null;
        await delay(1000);
      } else {
        throw err;
      }
    }
  }
  return null;
}
```

**DESPUÉS:** Un hook simple y reutilizable:

```javascript
// ✅ Hook reutilizable (3 líneas de uso)
const { fetchWithRetry } = useFetchWithRetry(2, 3000);
const data = await fetchWithRetry(getStoreProducts, { code: query });
```

## 💡 Características del hook

### Parámetros:
- `maxRetries` (default: 2) - Número de reintentos
- `timeout` (default: 3000ms) - Tiempo máximo por intento

### Funcionalidad:
- ✅ Timeout automático por intento
- ✅ Reintentos automáticos en caso de timeout
- ✅ Delay de 1 segundo entre reintentos
- ✅ Logs informativos de cada intento
- ✅ Manejo de errores diferenciado (timeout vs otros errores)

## 📊 Impacto

```
Antes: ~60 líneas por componente que necesite reintentos
Después: 1 hook (56 líneas) + 3 líneas de uso

Ahorro en SearchProduct: 57 líneas
Ahorro potencial si se usa en 5 componentes: ~240 líneas
```

## 🎓 Ejemplo de uso

### Uso básico:
```javascript
import { useFetchWithRetry } from '../hooks/useFetchWithRetry';

const MyComponent = () => {
  const { fetchWithRetry } = useFetchWithRetry();
  
  const loadData = async () => {
    const data = await fetchWithRetry(getProducts, { category: 'electronics' });
    if (data) {
      setProducts(data);
    }
  };
};
```

### Uso con configuración personalizada:
```javascript
// 3 reintentos, 5 segundos de timeout
const { fetchWithRetry } = useFetchWithRetry(3, 5000);
```

### Uso con múltiples APIs:
```javascript
const { fetchWithRetry } = useFetchWithRetry();

// Funciona con cualquier función que retorne una promesa
const products = await fetchWithRetry(getProducts, { id: 1 });
const clients = await fetchWithRetry(getClients, { active: true });
const sales = await fetchWithRetry(getSales, { date: today });
```

## 🔍 Componentes que pueden beneficiarse

Buscar en el código componentes que:
- Hacen peticiones a APIs lentas
- Necesitan manejar timeouts
- Tienen lógica de reintentos manual

**Candidatos potenciales:**
- ✅ SearchProduct (ya migrado)
- ProductList (búsquedas)
- StoreProductList (búsquedas)
- SaleList (cargas pesadas)
- Cualquier componente con `AbortController`

## 📝 Beneficios

1. **Reutilizable:** Un hook para todos los componentes
2. **Configurable:** Ajusta reintentos y timeout según necesidad
3. **Mantenible:** Cambios en un solo lugar
4. **Testeable:** Fácil de probar de forma aislada
5. **Logs consistentes:** Mismo formato de logs en toda la app
6. **Menos código:** ~60 líneas → 3 líneas por uso

## 🎯 Próximos pasos

1. ✅ **Completado:** Hook useFetchWithRetry
2. ⏭️ **Siguiente:** Identificar otros componentes que puedan usarlo
3. ⏭️ **Después:** Hook useForm para formularios

---

**Fecha:** 2026-02-27
**Líneas del hook:** 56
**Líneas ahorradas en SearchProduct:** 57
**Ahorro potencial:** ~240 líneas (si se usa en 5 componentes)
