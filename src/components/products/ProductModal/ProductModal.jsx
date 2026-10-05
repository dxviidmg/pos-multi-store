import React, { useEffect, useMemo, useState } from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import CatalogAutocomplete from "../shared/CatalogAutocomplete";
import { useCatalogOptions, useInvalidateCatalogOptions } from "../shared/useCatalogOptions";
import ProductImageField from "./ProductImageField";
import ProductPriceFields from "./ProductPriceFields";
import ProductStockByStore from "./ProductStockByStore";
import { getPriceErrors, isProductFormIncomplete } from "./productValidation";
import { createProduct, getStoreProducts, updateProduct, addProducts } from "../../../api/products";
import { useUser } from "../../../context/UserContext";
import { useForm } from "../../../hooks/useForm";
import { useConversionUnits } from "../../../hooks/useConversions";
import { isOwner } from "../../../constants/routeAccess";
import { convertImageToWebp } from "../../../utils/image";
import { showSuccess, showRequestError, showWarning } from "../../../utils/alerts";
import noPhoto from "../../../assets/images/noPhoto.webp";

const INITIAL_FORM_DATA = {
  brand: "",
  department: "",
  code: "",
  name: "",
  unit: "PZ",
  cost: "",
  unit_price: "",
  wholesale_price: "",
  min_wholesale_quantity: "",
  wholesale_price_on_client_discount: false,
  image: null,
  initial_stock: "",
};

const CODE_CHECK_DELAY = 500;

/** Lee un archivo como data URL para la vista previa. */
const readAsDataUrl = (file, onLoad) => {
  const reader = new FileReader();
  reader.onloadend = () => onLoad(reader.result);
  reader.readAsDataURL(file);
};

/**
 * Alta/edición de producto o, con `showStoreProducts`, su stock por sucursal.
 * `product` puede ser el producto, `{ product, showStoreProducts }` o `{ code, createFromSearch }`.
 */
const ProductModal = ({ isOpen, product, onClose, onUpdate }) => {
  const productData = useMemo(() => product?.product || product || {}, [product]);
  const showStoreProducts = product?.showStoreProducts || false;
  const createFromSearch = product?.createFromSearch || false;
  const { user } = useUser();

  const isCreating = !productData.id;
  const canEditPrices = createFromSearch || isCreating || isOwner(user);
  const isSingleStoreInside = !user.multistore && !!user.store_id;

  const { brands, departments, loaded: optionsLoaded } = useCatalogOptions();
  const invalidateCatalogOptions = useInvalidateCatalogOptions();
  const { values: formData, handleChange: handleDataChange, setValues: setFormData, setValue: setFormValue } = useForm(INITIAL_FORM_DATA);
  const { data: units = [] } = useConversionUnits();

  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [codeExists, setCodeExists] = useState(false);

  useEffect(() => {
    if (productData.id) {
      setFormData({
        ...INITIAL_FORM_DATA,
        ...productData,
        brand: productData.brand || "",
        department: productData.department || "",
        code: productData.code || "",
        name: productData.name || "",
        unit: productData.unit || "PZ",
        cost: productData.cost || "",
        unit_price: productData.unit_price || "",
        wholesale_price: productData.wholesale_price || "",
        min_wholesale_quantity: productData.min_wholesale_quantity || "",
      });
      setPreviewImage(productData.image || noPhoto);
    } else {
      setFormData({
        ...INITIAL_FORM_DATA,
        code: productData.code || "",
        initial_stock: createFromSearch ? "1" : "",
      });
      setPreviewImage(noPhoto);
    }
  }, [productData, createFromSearch, setFormData]);

  // Validar si el código ya existe (solo al crear); se descarta la respuesta si el código cambió
  useEffect(() => {
    if (!isCreating || !formData.code) {
      setCodeExists(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await getStoreProducts({ code: formData.code, all_stores: "Y" }, { signal: controller.signal });
        if (!controller.signal.aborted) setCodeExists(response.data.length > 0);
      } catch {
        if (!controller.signal.aborted) setCodeExists(false);
      }
    }, CODE_CHECK_DELAY);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [formData.code, isCreating]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Convertir a WebP (más ligero) antes de guardar; con fallback al original
    const webpFile = await convertImageToWebp(file);
    setFormValue("image", webpFile);
    readAsDataUrl(webpFile, setPreviewImage);
  };

  const addInitialStock = async (createdProduct, quantity) => {
    try {
      const storeProducts = await getStoreProducts({ code: formData.code });
      if (storeProducts.data.length > 0) {
        await addProducts({ store_products: [{ id: storeProducts.data[0].id, quantity }] });
        createdProduct.stock = (createdProduct.stock || 0) + quantity;
      }
    } catch {
      showWarning("Producto creado sin stock inicial", "No se pudo agregar el stock. Ajústalo desde Inventario.");
    }
  };

  const handleProductSubmit = async () => {
    setIsLoading(true);
    const apiCall = formData.id ? updateProduct : createProduct;

    // department "0" o vacío no se envía; initial_stock tampoco (se agrega aparte)
    const { initial_stock: initialStockValue, ...cleanFormData } = formData;
    if (cleanFormData.department === "0" || !cleanFormData.department) {
      delete cleanFormData.department;
    }

    try {
      const response = await apiCall(cleanFormData);
      if (!formData.id && isSingleStoreInside && initialStockValue && parseInt(initialStockValue) > 0) {
        await addInitialStock(response.data, parseInt(initialStockValue));
      }
      onClose();
      onUpdate(response.data);
      invalidateCatalogOptions();
      setFormData(INITIAL_FORM_DATA);
      setPreviewImage(null);
      showSuccess(`Producto ${formData.id ? "actualizado" : "creado"}${isSingleStoreInside && initialStockValue ? ` con stock de ${initialStockValue}` : ""}`);
    } catch (error) {
      showRequestError(`${formData.id ? "actualizar" : "crear"} el producto`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const priceErrors = getPriceErrors(formData);
  const isFormIncomplete = isProductFormIncomplete(formData, { requiresInitialStock: !formData.id && isSingleStoreInside });
  const setCatalogValue = (name) => (value) => setFormValue(name, value);

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={showStoreProducts ? "Stock del producto" : formData.id ? "Editar producto" : "Crear producto"}
      maxWidth={950}
    >
      <ModalBody>
        <Grid item xs={12} className="card">
          {!showStoreProducts && !user.multistore && !user.store_id && !formData.id && (
            <Alert severity="warning" variant="filled" sx={{ mb: 2 }}>
              Para crear un producto con stock inicial, entra primero a tu tienda y hazlo desde ahí.
            </Alert>
          )}

          {showStoreProducts ? (
            <ProductStockByStore code={productData.code} />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <ProductImageField src={previewImage} onChange={handleImageChange} />
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
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
                    <CustomButton
                      fullWidth
                      onClick={handleProductSubmit}
                      disabled={isFormIncomplete || priceErrors.hasAnyError || isLoading || codeExists}
                      startIcon={<SaveIcon />}
                    >
                      {isLoading ? "Guardando..." : formData.id ? "Editar" : "Crear"}
                    </CustomButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </ModalBody>
    </CustomModal>
  );
};

export default ProductModal;
