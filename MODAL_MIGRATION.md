# Migración de Modales: Redux → useModal Hook

## ✅ Cambios realizados

Se migró el manejo de modales de Redux a un hook personalizado `useModal` más simple y mantenible.

### Componentes migrados:
- ✅ BrandList + BrandModal
- ✅ ClientList + ClientModal

### Componentes pendientes:
- ⏳ SellerList + SellerModal
- ⏳ DepartmentList + DepartmentModal
- ⏳ ProductList + ProductModal
- ⏳ CashFlowList + CashFlowModal
- ⏳ SaleList + SaleModal
- ⏳ StockModal
- ⏳ PaymentModal
- ⏳ PaymentModal2

## 📊 Beneficios

| Antes (Redux) | Después (useModal) |
|---------------|-------------------|
| ~150 líneas por modal | ~15 líneas totales |
| 12 reducers separados | 1 hook reutilizable |
| Estado global innecesario | Estado local apropiado |
| Difícil de mantener | Fácil de entender |

## 🔧 Cómo usar useModal

### 1. En el componente List:

```javascript
import { useModal } from '../../../hooks/useModal';

const BrandList = () => {
  const brandModal = useModal();
  
  return (
    <>
      <BrandModal 
        isOpen={brandModal.isOpen}
        brand={brandModal.data}
        onClose={brandModal.close}
        onUpdate={refetch}
      />
      
      <CustomButton onClick={() => brandModal.open()}>
        Nueva Marca
      </CustomButton>
      
      <CustomButton onClick={() => brandModal.open(brand)}>
        Editar
      </CustomButton>
    </>
  );
};
```

### 2. En el componente Modal:

```javascript
const BrandModal = ({ isOpen, brand, onClose, onUpdate }) => {
  // Ya no necesitas useSelector ni useDispatch
  
  const handleSubmit = () => {
    mutation.mutate(formData, {
      onSuccess: () => {
        onClose();      // Cierra el modal
        onUpdate();     // Actualiza la lista
      },
    });
  };
  
  return (
    <CustomModal showOut={isOpen} onClose={onClose}>
      {/* contenido */}
    </CustomModal>
  );
};
```

## 🗑️ Limpieza pendiente

Después de migrar todos los modales, se pueden eliminar:

```
src/redux/
├── brandModal/          ❌ Eliminar
├── clientModal/         ❌ Eliminar
├── sellerModal/         ❌ Eliminar
├── departmentModal/     ❌ Eliminar
├── productModal/        ❌ Eliminar
├── cashFlowModal/       ❌ Eliminar
├── saleModal/           ❌ Eliminar
├── stockModal/          ❌ Eliminar
├── paymentModal/        ❌ Eliminar
├── paymentReservationModal/ ❌ Eliminar
└── logsModal/           ❌ Eliminar
```

**Ahorro estimado:** ~1,800 líneas de código

## 📝 Patrón de migración

Para migrar los demás modales, sigue este patrón:

### Paso 1: Actualizar el List
```diff
- import { useDispatch } from "react-redux";
- import { showBrandModal } from "../../../redux/brandModal/BrandModalActions";
+ import { useModal } from "../../../hooks/useModal";

- const dispatch = useDispatch();
+ const brandModal = useModal();

- const handleOpenModal = (brand) => {
-   dispatch(showBrandModal(brand));
- };

- <BrandModal onUpdateBrandList={handleUpdateBrandList} />
+ <BrandModal 
+   isOpen={brandModal.isOpen}
+   brand={brandModal.data}
+   onClose={brandModal.close}
+   onUpdate={refetch}
+ />

- <CustomButton onClick={() => handleOpenModal(brand)}>
+ <CustomButton onClick={() => brandModal.open(brand)}>
```

### Paso 2: Actualizar el Modal
```diff
- import { useDispatch, useSelector } from "react-redux";
- import { hideBrandModal } from "../../../redux/brandModal/BrandModalActions";

- const BrandModal = ({ onUpdateBrandList }) => {
+ const BrandModal = ({ isOpen, brand, onClose, onUpdate }) => {

-   const { showBrandModal, brand } = useSelector(state => state.BrandModalReducer);
-   const dispatch = useDispatch();

    mutation.mutate(formData, {
      onSuccess: () => {
-       dispatch(hideBrandModal());
-       onUpdateBrandList();
+       onClose();
+       onUpdate();
      },
    });

    return (
-     <CustomModal showOut={showBrandModal} onClose={() => dispatch(hideBrandModal())}>
+     <CustomModal showOut={isOpen} onClose={onClose}>
    );
};
```

## 🎯 Próximos pasos

1. Migrar los 8 modales restantes usando el mismo patrón
2. Eliminar las carpetas de Redux de modales
3. Actualizar el store de Redux para remover los reducers
4. Celebrar la simplificación 🎉
