# Ejemplo: Antes y Después con React Query

## ❌ ANTES (StoreList actual)

```javascript
const [loading, setLoading] = useState(false);
const [stores, setStores] = useState([]);
const [tenantInfo, setTenantInfo] = useState([]);
const [totals, setTotals] = useState({...});

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const response = await getTenantInfo();
    setTenantInfo(response.data);

    const response2 = await getStores({ ...params });
    setStores(response2.data);

    // Calcular totales...
    const totals = response2.data.reduce(...);
    setTotals(totals);
    
    setLoading(false);
  };

  fetchData();
}, [params]); // ⚠️ PROBLEMA: Si cambias params rápido, requests se acumulan
```

**Problemas:**
- 50+ líneas de código boilerplate
- No cancela requests anteriores
- No maneja errores correctamente
- No cachea datos
- Loading state manual

---

## ✅ DESPUÉS (Con React Query)

```javascript
import { useStores } from '../../hooks/useStores';
import { useTenantInfo } from '../../hooks/useTenantInfo';

const StoreList = () => {
  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
    store_type: "T",
  });

  // ✨ Esto reemplaza TODO el useEffect anterior
  const { data: tenantInfo, isLoading: loadingTenant } = useTenantInfo();
  const { data, isLoading: loadingStores } = useStores(params);
  
  const stores = data?.stores || [];
  const totals = data?.totals || {};
  const loading = loadingTenant || loadingStores;

  // ... resto del componente igual
}
```

**Beneficios:**
- 5 líneas vs 50 líneas
- ✅ Cancela automáticamente requests anteriores
- ✅ Cachea datos (no refetch innecesarios)
- ✅ Manejo de errores incluido
- ✅ Loading/error states automáticos
- ✅ Refetch automático en foco de ventana (opcional)

---

## 🔧 Los hooks (hooks/useStores.js)

```javascript
import { useQuery } from '@tanstack/react-query';
import { getStores } from '../components/apis/stores';

export const useStores = (params) => {
  return useQuery({
    queryKey: ['stores', params], // 🔑 Clave única por params
    queryFn: () => getStores(params),
    select: (response) => {
      // Transformar datos aquí
      const stores = response.data;
      const totals = stores.reduce(...); // Cálculo de totales
      return { stores, totals };
    },
  });
};
```

**Magia de queryKey:**
- `['stores', { store_type: 'T', start_date: '2026-01-01' }]` → Request 1
- `['stores', { store_type: 'T', start_date: '2026-01-02' }]` → Request 2 (cancela el 1)
- `['stores', { store_type: 'T', start_date: '2026-01-01' }]` → Usa caché (no hace request)

---

## 🎯 Siguiente paso

¿Quieres que refactorice StoreList completo con React Query?
O prefieres empezar con un componente más simple como ClientList?
