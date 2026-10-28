import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "../../ui/Button/Button";
import PageHeader from "../../ui/PageHeader";
import ProductFormFields from "../ProductModal/ProductFormFields";
import { useProductForm } from "../ProductModal/useProductForm";

const DEFAULT_RETURN_PATH = "/productos/";

/** Alta de producto como página (celular). Vuelve a `state.returnTo` con el producto creado. */
const ProductCreate = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const returnTo = state?.returnTo || DEFAULT_RETURN_PATH;
  const createFromSearch = !!state?.createFromSearch;
  const productData = useMemo(() => ({ code: state?.code || "" }), [state?.code]);

  const form = useProductForm({
    productData,
    createFromSearch,
    onSaved: (product) => navigate(returnTo, { replace: true, state: { createdProduct: product } }),
  });

  return (
    <Grid container>
      <Grid item xs={12} className="card">
        <PageHeader title="Nuevo producto">
          <CustomButton fullWidth onClick={() => navigate(returnTo)} startIcon={<ArrowBackIcon />}>
            Regresar
          </CustomButton>
        </PageHeader>
        <ProductFormFields form={form} />
      </Grid>
    </Grid>
  );
};

export default ProductCreate;
