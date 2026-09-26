import React, { useEffect, useState, useRef } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { getBrands } from "../../../api/brands";
import { showSuccess, showError } from "../../../utils/alerts";
import {
  createProduct,
  getStoreProducts,
  updateProduct,
  addProducts,
} from "../../../api/products";
import { getStores } from "../../../api/stores";
import { useUser } from "../../../context/UserContext";
import { useForm } from "../../../hooks/useForm";
import noPhoto from "../../../assets/images/noPhoto.webp";
import { convertImageToWebp } from "../../../utils/image";
import { getDepartments } from "../../../api/departments";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { Grid, TextField, Box, Checkbox, FormControlLabel, Autocomplete, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import VisuallyHiddenInput from "../../ui/VisuallyHiddenInput";
import { useConversionUnits } from "../../../hooks/useConversions";

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

const ProductModal = ({ isOpen, product, onClose, onUpdate }) => {
  const productData = product?.product || product || {};
  const showStoreProducts = product?.showStoreProducts || false;
  const createFromSearch = product?.createFromSearch || false;
  const { user } = useUser();

  const isCreating = !productData?.id;

  const isOwner = user?.role === "owner";
  const canEditPrices = createFromSearch || isCreating || isOwner;

  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const { values: formData, handleChange: handleDataChange, setValues: setFormData, setValue: setFormValue } = useForm(INITIAL_FORM_DATA);

  const [previewImage, setPreviewImage] = useState(null);
  const [storeProduct, setStoreProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [codeExists, setCodeExists] = useState(false);
  const codeDebounceRef = useRef(null);
  const { data: units = [] } = useConversionUnits();

  useEffect(() => {
    const fetchData = async () => {
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

        if (showStoreProducts) {
          const [r, s] = await Promise.all([
            getStoreProducts({ code: productData.code, all_stores: "Y" }),
            getStores(),
          ]);
          const storeMap = Object.fromEntries(s.data.map((st) => [st.id, st.full_name]));
          setStoreProduct(r.data.map((sp) => ({ ...sp, store_name: storeMap[sp.store] || `Tienda #${sp.store}` })));
        }
      } else {
        setFormData({
          ...INITIAL_FORM_DATA,
          code: productData.code || "",
          initial_stock: createFromSearch ? "1" : "",
        });
        setPreviewImage(noPhoto);
        setStoreProduct([]);
      }

      const response = await getBrands();
      setBrands(response.data);

      const response2 = await getDepartments();
      setDepartments(response2.data);
      setOptionsLoaded(true);
    };

    fetchData();
  }, [product, showStoreProducts, createFromSearch]);

  // Validar si el código ya existe (solo al crear)
  useEffect(() => {
    if (!isCreating || !formData.code) {
      setCodeExists(false);
      return;
    }

    clearTimeout(codeDebounceRef.current);
    codeDebounceRef.current = setTimeout(async () => {
      try {
        const response = await getStoreProducts({ code: formData.code, all_stores: "Y" });
        setCodeExists(response.data.length > 0);
      } catch {
        setCodeExists(false);
      }
    }, 500);

    return () => clearTimeout(codeDebounceRef.current);
  }, [formData.code, isCreating]);


  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convertir a WebP (más ligero) antes de guardar; con fallback al original
      const webpFile = await convertImageToWebp(file, { quality: 0.85, maxWidth: 1000, maxHeight: 1000 });
      setFormValue("image", webpFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(webpFile);
    }
  };

  const handleProductSubmit = async () => {
    setIsLoading(true);
    const apiCall = formData.id ? updateProduct : createProduct;

    // Filtrar department si es "0" o vacío, e initial_stock del producto (no se envía al backend)
    const cleanFormData = { ...formData };
    if (cleanFormData.department === "0" || !cleanFormData.department) {
      delete cleanFormData.department;
    }
    const initialStockValue = cleanFormData.initial_stock;
    delete cleanFormData.initial_stock;

    try {
      const response = await apiCall(cleanFormData);

      if ([200, 201].includes(response.status)) {
        // Agregar stock si: no es multistore, está dentro de tienda, es creación, y hay stock > 0
        if (!formData.id && !user.multistore && user.store_id && initialStockValue && parseInt(initialStockValue) > 0) {
          try {
            const storeProducts = await getStoreProducts({ code: formData.code });
            if (storeProducts.data.length > 0) {
              const sp = storeProducts.data[0];
              const addResponse = await addProducts({
                store_products: [{ id: sp.id, quantity: parseInt(initialStockValue) }],
              });
              // Si add retorna 200, actualizar el stock en la respuesta del producto
              if (addResponse.status === 200) {
                response.data.stock = (response.data.stock || 0) + parseInt(initialStockValue);
              }
            }
          } catch (stockError) {
            showError("Producto creado, pero hubo error al agregar stock");
          }
        }
        onClose();
        onUpdate(response.data);
        setFormData(INITIAL_FORM_DATA);
        setPreviewImage(null);
        showSuccess(`Producto ${formData.id ? "actualizado" : "creado"}${!user.multistore && user.store_id && initialStockValue ? ` con stock de ${initialStockValue}` : ""}`);
      }
    } catch (error) {
      showError(`Error al ${formData.id ? "actualizar" : "crear"} producto`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormIncomplete = () => {
    const {
      wholesale_price,
      min_wholesale_quantity,
      wholesale_price_on_client_discount,
      image,
      department,
      department_name,
      initial_stock,
      ...requiredFields
    } = formData;

    const areRequiredFieldsComplete = !Object.values(requiredFields).some(
      (value) => value === ""
    );

    const areOptionalFieldsConsistent =
      (wholesale_price === "") === (min_wholesale_quantity === "");

    // Para single-store en creación, initial_stock es requerido
    const isInitialStockRequired = !formData.id && !user.multistore && user.store_id;
    const isInitialStockComplete = !isInitialStockRequired || (initial_stock !== "" && parseInt(initial_stock) > 0);

    return !areRequiredFieldsComplete || !areOptionalFieldsConsistent || !isInitialStockComplete;
  };

  const isCostHigher = formData.cost !== "" && formData.unit_price !== "" && Number(formData.cost) >= Number(formData.unit_price);
  const isWholesaleHigher = formData.wholesale_price !== "" && formData.unit_price !== "" && Number(formData.wholesale_price) >= Number(formData.unit_price);

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={showStoreProducts ? "Stock del producto" : formData.id ? "Actualizar producto" : "Crear producto"}
      maxWidth={950}
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'modalBody.main' }}>
        <Grid item xs={12} className="card">
        
        {!showStoreProducts && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              component="label"
              sx={{ display: 'block', cursor: 'pointer', '&:hover': { opacity: 0.8 }, transition: 'opacity 0.2s' }}
            >
              <Box
                component="img"
                src={previewImage}
                alt="Producto"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2
                }}
              />
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Fila 1: Identificación del producto */}
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

              {/* Fila 2: Clasificación */}
              <Grid item xs={12} md={4}>
                <Autocomplete
                  size="small"
                  options={brands}
                  getOptionLabel={(option) => `${option.name} (${option.product_count})`}
                  value={brands.find((b) => b.id === formData.brand) || null}
                  onChange={(_, newValue) => {
                    setFormData((prev) => ({ ...prev, brand: newValue?.id || "" }));
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={optionsLoaded && brands.length === 0}
                  renderInput={(inputProps) => (
                    <TextField {...inputProps} label="Marca" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  size="small"
                  options={departments}
                  getOptionLabel={(option) => `${option.name} (${option.product_count})`}
                  value={departments.find((d) => d.id === formData.department) || null}
                  onChange={(_, newValue) => {
                    setFormData((prev) => ({ ...prev, department: newValue?.id || "" }));
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={optionsLoaded && departments.length === 0}
                  renderInput={(inputProps) => (
                    <TextField {...inputProps} label="Departamento" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Unidad</InputLabel>
                  <Select
                    value={formData.unit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                    label="Unidad"
                  >
                    {units.map((u) => (
                      <MenuItem key={u.value} value={u.value}>
                        {u.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Fila 3: Precios */}
              <Grid item xs={12} md={4}>
                <TextField size="small" fullWidth label="Costo" type="number"
                  value={formData.cost}
                  placeholder="Costo"
                  name="cost"
                  onChange={handleDataChange}
                  disabled={!canEditPrices}
                  error={isCostHigher}
                  helperText={isCostHigher ? "Debe ser menor al precio unitario" : ""}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField size="small" fullWidth label="Precio unitario" type="number"
                  value={formData.unit_price}
                  placeholder="Precio unitario"
                  name="unit_price"
                  onChange={handleDataChange}
                  disabled={!canEditPrices}
                  error={isCostHigher}
                  helperText={isCostHigher ? "Debe ser mayor al costo" : ""}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField size="small" fullWidth label="Precio mayoreo" type="number"
                  value={formData.wholesale_price}
                  placeholder="Precio de mayoreo"
                  name="wholesale_price"
                  onChange={handleDataChange}
                  disabled={!canEditPrices}
                  error={isWholesaleHigher || (formData.wholesale_price !== "" && formData.min_wholesale_quantity === "")}
                  helperText={isWholesaleHigher ? "Debe ser menor al precio unitario" : (formData.wholesale_price !== "" && formData.min_wholesale_quantity === "") ? "Requiere cantidad mínima mayoreo" : ""}
                />
              </Grid>

              {/* Fila 4: Mayoreo config */}
              <Grid item xs={12} md={4}>
                <TextField size="small" fullWidth label="Cantidad mínima mayoreo" type="number"
                  value={formData.min_wholesale_quantity}
                  placeholder="Cantidad mínima"
                  name="min_wholesale_quantity"
                  onChange={handleDataChange}
                  disabled={!canEditPrices}
                  error={formData.min_wholesale_quantity !== "" && formData.wholesale_price === ""}
                  helperText={(formData.min_wholesale_quantity !== "" && formData.wholesale_price === "") ? "Requiere precio mayoreo" : ""}
                />
              </Grid>
              <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox size="small"
                      checked={formData.wholesale_price_on_client_discount === true}
                      onChange={handleDataChange}
                      name="wholesale_price_on_client_discount"
                      disabled={!canEditPrices}
                    />
                  }
                  label="Aplicar mayoreo aún con descuento de cliente"
                />
              </Grid>

              {!user.multistore && user.store_id && !formData.id && (
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
                  fullWidth={true}
                  onClick={(e) => handleProductSubmit(e)}
                  disabled={isFormIncomplete() || isCostHigher || isWholesaleHigher || isLoading || codeExists}
                  startIcon={<SaveIcon />}
                >
                  {isLoading ? "Guardando..." : formData.id ? "Actualizar" : "Crear"}
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        )}

        {showStoreProducts && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SimpleTable
                noDataComponent="Sin stock"
                data={storeProduct}
                columns={[
                  {
                    name: "Nombre",
                    selector: (row) => row.store_name,
                  },
                  {
                    name: "Stock",
                    selector: (row) => row.stock,
                  },
                ]}
              />
            </Grid>
          </Grid>
        )}
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default ProductModal;
