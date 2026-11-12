import React from "react";
import { Grid, FormControl, InputLabel, MenuItem, Alert } from "@mui/material";
import { TextField, Select } from "../../ui/Field/Field";
import SaveIcon from "@mui/icons-material/Save";
import CustomButton from "../../ui/Button/Button";
import CatalogAutocomplete from "../shared/CatalogAutocomplete";
import ProductImageField from "./ProductImageField";
import ProductPriceFields from "./ProductPriceFields";

/** Campos y botón de guardar del alta/edición de producto; `form` viene de `useProductForm`. */
const ProductFormFields = ({ form }) => {
  const {
    user, formData, handleDataChange, setCatalogValue, previewImage, handleImageChange,
    isLoading, codeExists, canEditPrices, isSingleStoreInside, brands, departments,
    optionsLoaded, units, priceErrors, isSubmitDisabled, submit,
  } = form;

  return (
    <>
      {!user.multistore && !user.store_id && !formData.id && (
        <Alert severity="warning" variant="filled" sx={{ mb: 2 }}>
          Para crear un producto con stock inicial, entra primero a tu tienda y hazlo desde ahí.
        </Alert>
      )}

      <Grid container className="fill-row" spacing={2}>
        <Grid item xs={12} md={4}>
          <ProductImageField src={previewImage} onChange={handleImageChange} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container className="fill-row" spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Código" type="text"
                value={formData.code}
                placeholder="Código"
                name="code"
                onChange={handleDataChange}
                error={codeExists}
                helperText={codeExists ? "El código ya existe" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField size="small" fullWidth label="Nombre" type="text"
                value={formData.name}
                placeholder="Nombre"
                name="name"
                onChange={handleDataChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CatalogAutocomplete
                label="Marca"
                options={brands}
                value={formData.brand}
                onChange={setCatalogValue("brand")}
                loaded={optionsLoaded}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CatalogAutocomplete
                label="Departamento"
                options={departments}
                value={formData.department}
                onChange={setCatalogValue("department")}
                loaded={optionsLoaded}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Unidad</InputLabel>
                <Select value={formData.unit} onChange={handleDataChange} name="unit" label="Unidad">
                  {units.map((u) => (
                    <MenuItem key={u.value} value={u.value}>
                      {u.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <ProductPriceFields
              values={formData}
              onChange={handleDataChange}
              errors={priceErrors}
              disabled={!canEditPrices}
            />

            {isSingleStoreInside && !formData.id && (
              <Grid item xs={12}>
                <TextField size="small" fullWidth label="Stock inicial" type="number"
                  value={formData.initial_stock}
                  placeholder="Stock"
                  name="initial_stock"
                  onChange={handleDataChange}
                />
              </Grid>
            )}

            <Grid item xs={12} sx={{ mt: -1.5 }}>
              <CustomButton fullWidth onClick={submit} disabled={isSubmitDisabled} startIcon={<SaveIcon />}>
                {isLoading ? "Guardando..." : formData.id ? "Editar" : "Crear"}
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductFormFields;
