# Componentes Oversized — Oportunidades de Refactor

> **Nota:** Este documento identificalos componentes que podrían beneficiarse de división. No son críticos ahora, pero son candidatos para refactores futuros.

---

## Componentes >200 LOC (Candidates for future refactoring)

### 1. `components/layout/MainLayout/MainLayout.jsx`
**Tamaño:** ~300 LOC  
**Responsabilidad:** Layout principal (sidebar, header, drawer móvil)  
**Oportunidad de división:**
- `Header.jsx` — Header con notificaciones
- `Sidebar.jsx` — Sidebar con menú
- `DrawerMobile.jsx` — Drawer para móvil

**Impacto:** Bajo (layout ya está bien estructurado)

---

### 2. `components/products/ProductList/ProductList.jsx`
**Tamaño:** ~250 LOC  
**Responsabilidad:** Catálogo (tabla/galería, filtros, acciones)  
**Oportunidad de división:**
- Separar tabla de galería en componentes
- Extraer lógica de filtros a hook

**Impacto:** Medio (muy usado)

---

### 3. `components/sales/SaleCreate/SaleCreate.jsx`
**Tamaño:** ~280 LOC  
**Responsabilidad:** Pantalla de venta completa  
**Oportunidad de división:**
- `SearchProduct.jsx` — Ya separado
- `CartPanel.jsx` — Carrito
- `OrderSummary.jsx` — Resumen
- `PaymentModal.jsx` — Ya separado

**Impacto:** Alto (pantalla crítica)

---

### 4. `components/admin/Dashboard/ProductsDashboard.jsx`
**Tamaño:** ~200 LOC  
**Responsabilidad:** Tablero de productos  
**Oportunidad de división:**
- Separar gráficos en componentes
- Extraer lógica de datos

**Impacto:** Bajo (solo dueño)

---

## Archivo no es componente (pero es grande)

### `src/theme/components.js`
**Tamaño:** 280 LOC  
**Por qué es largo:** Define sobreescrituras para 25+ componentes MUI  
**¿Debería dividirse?**
- Podría, pero hace sentido mantenerse junto (todos MUI)
- Alternativa: Agrupar por tipo (buttons, inputs, tables, etc.)

**Decisión:** Mantener como está por ahora (coherencia)

---

## Cuando dividir un componente

### ✅ Señales de que DEBE dividirse

1. Máximo de 300 LOC excedido
2. Múltiples responsabilidades (ej: render + lógica compleja)
3. Componentes reutilizables dentro del mismo
4. Lógica de negocio pura que se puede testear

### ✅ Patrón para dividir

```javascript
// Antes: Todo en ProductList.jsx (250 LOC)
export const ProductList = () => {
  // ... lógica de búsqueda
  // ... render tabla
  // ... render galería
  // ... modales
}

// Después: Separado en componentes
export const ProductList = () => {
  const [viewMode, setViewMode] = useViewModePreference();
  
  return (
    <>
      <ProductFilters />
      {viewMode === 'table' && <ProductTable />}
      {viewMode === 'gallery' && <ProductGallery />}
      <ProductModal />
    </>
  );
};
```

---

## Plan de refactor propuesto (futuro)

Si en el futuro decides dividir oversized:

**Fase 1:** Componentes de baja importancia
- [ ] `ProductsDashboard.jsx` → Dividir gráficos

**Fase 2:** Componentes de media importancia
- [ ] `ProductList.jsx` → Separar tabla/galería/filtros

**Fase 3:** Componentes críticos (con cuidado)
- [ ] `SaleCreate.jsx` → Dividir en sub-panels

**Fase 4:** Layout (si es necesario)
- [ ] `MainLayout.jsx` → Dividir Header/Sidebar

---

## Conclusión

El proyecto **NO necesita refactor de componentes ahora**:
- Los 3-4 componentes >200 LOC funcionan bien
- Cambios de código son riesgosos (posibles bugs)
- Beneficio marginal vs. riesgo

**Mejor usar tiempo en:**
- [ ] Tests unitarios de funciones puras
- [ ] Documentación de componentes (este README)
- [ ] Optimización de performance (useMemo, memo)

---

**Recomendación:** Revisar este documento cada 6 meses. Si los componentes crecen >400 LOC, entonces refactorizar.

**Última actualización:** 2026-10-10
