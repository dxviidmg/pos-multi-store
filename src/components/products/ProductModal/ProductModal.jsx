import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import ProductFormFields from "./ProductFormFields";
import ProductStockByStore from "./ProductStockByStore";
import { useProductForm } from "./useProductForm";

/**
 * Alta/edición de producto o, con `showStoreProducts`, su stock por sucursal.
 * `product` puede ser el producto, `{ product, showStoreProducts }` o `{ code, createFromSearch }`.
 */
const ProductModal = ({ isOpen, product, onClose, onUpdate }) => {
  const productData = useMemo(() => product?.product || product || {}, [product]);
  const showStoreProducts = product?.showStoreProducts || false;
  const createFromSearch = product?.createFromSearch || false;

  const form = useProductForm({
    productData,
    createFromSearch,
    onSaved: (saved) => {
      onClose();
      onUpdate(saved);
    },
  });

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={showStoreProducts ? "Stock del producto" : form.formData.id ? "Editar producto" : "Crear producto"}
      maxWidth={950}
    >
      <ModalBody>
        <Grid item xs={12} className="card">
          {showStoreProducts ? <ProductStockByStore code={productData.code} /> : <ProductFormFields form={form} />}
        </Grid>
      </ModalBody>
    </CustomModal>
  );
};

export default ProductModal;
