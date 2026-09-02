# [008] Agregar campo "Unidad" al modal de producto

> **Estado:** completed  
> **Fecha de creación:** 2026-08-25  
> **Última actualización:** 2026-08-25  
> **Autor:** David  

---

## Problema / Necesidad

El endpoint de productos ya retorna el campo `unit` (ej: `"PZ"`, `"KG"`, etc.), pero el modal de crear/editar producto no tiene un selector para asignarlo. Actualmente no hay forma de cambiar la unidad desde el frontend.

---

## Solución Propuesta

Agregar un `Select` (o `Autocomplete`) al formulario del modal de producto para elegir la unidad de medida. El campo se envía al backend como parte del payload de creación/edición.

---

## Comportamiento Esperado

1. El usuario abre el modal de producto (crear o editar)
2. Ve un select "Unidad" con las opciones disponibles
3. Al crear, el valor por defecto es `"PZ"` (Pieza)
4. Al editar, se muestra la unidad actual del producto
5. El usuario puede cambiar la unidad y guardar

---

## Criterios de Aceptación

- [x] El modal muestra un Select con las unidades disponibles (dinámicas del endpoint)
- [x] Al crear producto, el valor por defecto es "PZ"
- [x] Al editar producto, se carga la unidad actual del producto
- [x] El campo se envía en el payload de creación/edición
- [x] El campo es obligatorio (no puede quedar vacío)
- [x] Funciona tanto en creación normal como en creación desde búsqueda

---

## Diseño de UI

- **Ubicación:** En la misma fila que "Nombre", a su derecha (Nombre `md={4}` + Unidad `md={2}`)
- **Componente:** `TextField` con `select` (nativo de MUI) o `FormControl` + `Select`
- **Tamaño:** `size="small"`, ocupa `xs={12} md={2}`

### Opciones del Select

Se obtienen dinámicamente del endpoint `GET /api/products/units/`:

```json
[
  {"value": "PZ", "label": "Pieza"},
  {"value": "KG", "label": "Kilogramo"},
  {"value": "CO", "label": "Costal"}
]
```

Las opciones no están hardcodeadas — se cargan al abrir el modal.

---

## Reglas de Negocio

- El valor por defecto al crear es `"PZ"`
- El campo es obligatorio (siempre tiene un valor)
- Cualquier rol que pueda crear/editar productos puede cambiar la unidad
- No afecta precios ni stock — solo es informativo/para conversiones

---

## Permisos / Roles

| Acción | Owner | Admin | Vendedor |
|--------|-------|-------|----------|
| Ver unidad | ✅ | ✅ | ✅ |
| Cambiar unidad (crear) | ✅ | ✅ (desde búsqueda) | ✅ (desde búsqueda) |
| Cambiar unidad (editar) | ✅ | ❌ | ❌ |

---

## Datos / API

### Endpoint de unidades

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/products/units/` | Lista de unidades disponibles |

Respuesta:
```json
[
  {"value": "PZ", "label": "Pieza"},
  {"value": "KG", "label": "Kilogramo"},
  {"value": "CO", "label": "Costal"}
]
```

### Payload actualizado

Se agrega `unit` al payload existente:

```
Campo    Tipo      Notas
───────  ────────  ─────────────────
unit     string    "PZ"|"KG"|"CO", default "PZ"
```

El endpoint ya soporta el campo — solo falta enviarlo desde el frontend.

### Impacto en Conversiones

El endpoint `POST /api/product-conversion/` ya **no** requiere `source_unit` ni `target_unit` — la unidad se toma del producto directamente.

---

## Impacto en Código Existente

- `src/components/products/ProductModal/ProductModal.jsx`:
  - Agregar `unit: "PZ"` a `INITIAL_FORM_DATA`
  - Agregar Select en el formulario
  - Cargar `productData.unit` al editar
  - Fetch de unidades al abrir (`GET /api/products/units/`)

- `src/components/inventory/ConversionList/ConversionModal.jsx`:
  - Eliminar `source_unit` y `target_unit` del form data
  - Eliminar los selects de unidad del formulario
  - No enviar esos campos en el payload de creación/edición

- `src/api/conversions.js`:
  - Cambiar `getConversionUnits` de `product-conversion/units` → `products/units`

- `src/hooks/useConversions.js`:
  - Sin cambios (sigue exponiendo `useConversionUnits`, misma query key)

- ProductModal reutiliza `useConversionUnits()` para obtener las unidades (mismo hook, mismo endpoint)

---

## Fuera de Alcance

- No se modifica el backend (ya soporta `unit`)
- No se muestra la unidad en la tabla de productos (otro cambio separado si se quiere)
- No se cambia la lógica de conversiones — solo se dejan de enviar `source_unit`/`target_unit` porque el backend ya los toma del producto

---

## Checklist de Implementación

- [x] Cambiar URL en `getConversionUnits`: `product-conversion/units` → `products/units`
- [x] Agregar `unit` a `INITIAL_FORM_DATA` con default `"PZ"` en ProductModal
- [x] Importar `useConversionUnits` en ProductModal
- [x] Agregar Select de unidad al formulario del ProductModal
- [x] Cargar `productData.unit` al editar
- [x] Verificar que `unit` se envía en el payload de crear/editar producto
- [x] Eliminar `source_unit` y `target_unit` del ConversionModal (form, payload, selects y validación)
- [x] Actualizar indicador visual del ConversionModal (quitar referencia a unidades de origen/destino)
- [x] Verificar que ConversionList sigue mostrando unidades (vienen como `source_unit_display`/`target_unit_display` del GET)
- [x] Probar crear producto → unidad se guarda
- [x] Probar editar producto → unidad se carga y se puede cambiar
- [x] Probar crear conversión → no envía source_unit/target_unit
