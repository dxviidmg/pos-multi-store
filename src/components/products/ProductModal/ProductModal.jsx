import React, { useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { getBrands } from "../../../api/brands";
import { showSuccess, showError } from "../../../utils/alerts";
import {
  createProduct,
  getStoreProducts,
  updateProduct,
} from "../../../api/products";
import { getStores } from "../../../api/stores";
import { getUserData } from "../../../api/utils";
import noPhoto from "../../../assets/images/noPhoto.jpg";
import { getDepartments } from "../../../api/departments";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Box, Checkbox, FormControlLabel } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import VisuallyHiddenInput from "../../ui/VisuallyHiddenInput";

const INITIAL_FORM_DATA = {
  brand: "",
  department: "",
  code: "",
  name: "",
  cost: "",
  unit_price: "",
  wholesale_price: "",
  min_wholesale_quantity: "",
  wholesale_price_on_client_discount: false,
  image: null,
};

const ProductModal = ({ isOpen, product, onClose, onUpdate }) => {
  const productData = product?.product || product || {};
  const showStoreProducts = product?.showStoreProducts || false;
  const user = getUserData();
  const isOwner = user?.role === "owner";

  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [storeProduct, setStoreProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (productData.id) {
        setFormData(productData);
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
        setFormData(INITIAL_FORM_DATA);
        setPreviewImage(noPhoto);
        setStoreProduct([]);
      }

      const response = await getBrands();
      setBrands(response.data);

      const response2 = await getDepartments();
      setDepartments(response2.data);
    };

    fetchData();
  }, [product, showStoreProducts]);


  const handleDataChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e) => {
    setIsLoading(true);
    const apiCall = formData.id ? updateProduct : createProduct;
    const response = await apiCall(formData);

    if ([200, 201].includes(response.status)) {
      onClose();
      onUpdate(response.data);
      setFormData(INITIAL_FORM_DATA);
      setSelectedImage(null);
      setPreviewImage(null);
      showSuccess(`Producto ${formData.id ? "actualizado" : "creado"}`);
    } else {
      let message = "Error desconocido. Por favor, contacte soporte.";
      if (response.response?.status === 400 && response.response.data?.code) {
        const codeError = response.response.data.code[0];
        if (codeError === "product with this code already exists.") {
          message = "El código ya existe.";
        }
      }
      showError(`Error al ${formData.id ? "actualizar" : "crear"} producto`, message);
    }
    setIsLoading(false);
  };

  const isFormIncomplete = () => {
    const {
      wholesale_price,
      min_wholesale_quantity,
      wholesale_price_on_client_discount,
      image,
      department,
      department_name,
      ...requiredFields
    } = formData;

    const areRequiredFieldsComplete = !Object.values(requiredFields).some(
      (value) => value === ""
    );

    const areOptionalFieldsConsistent =
      (wholesale_price === "") === (min_wholesale_quantity === "");

    return !areRequiredFieldsComplete || !areOptionalFieldsConsistent;
  };

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={showStoreProducts ? "Stock del producto" : formData.id ? "Actualizar producto" : "Crear producto"}
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
              <InputLabel>Marca</InputLabel>
              <Select fullWidth size="small" value={formData.brand}
                  onChange={handleDataChange}
                  name="brand"
                 label="Marca">
                  <MenuItem value="0">Selecciona una marca</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
            </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
              <InputLabel>Departamento</InputLabel>
              <Select fullWidth size="small" value={formData.department}
                  onChange={handleDataChange}
                  name="department"
                 label="Departamento">
                  <MenuItem value="0">Selecciona un departamento</MenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
                </Select>
            </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField size="small" fullWidth label="Código" type="text"
                  value={formData.code}
                  placeholder="Código"
                  name="code"
                  onChange={handleDataChange}
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

              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="Costo" type="number"
                  value={formData.cost}
                  placeholder="Costo"
                  name="cost"
                  onChange={handleDataChange}
                  disabled={!isOwner}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="P. unitario" type="number"
                  value={formData.unit_price}
                  placeholder="Precio unitario"
                  name="unit_price"
                  onChange={handleDataChange}
                  disabled={!isOwner}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="P. mayoreo" type="number"
                  value={formData.wholesale_price}
                  placeholder="Precio de mayoreo"
                  name="wholesale_price"
                  onChange={handleDataChange}
                  disabled={!isOwner}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="Min. mayoreo" type="number"
                  value={formData.min_wholesale_quantity}
                  placeholder="Cantidad minima mayoreo"
                  name="min_wholesale_quantity"
                  onChange={handleDataChange}
                  disabled={!isOwner}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControlLabel
                  control={
                    <Checkbox size="small"
                      checked={formData.wholesale_price_on_client_discount === true}
                      onChange={handleDataChange}
                      name="wholesale_price_on_client_discount"
                      disabled={!isOwner}
                    />
                  }
                  label="Permitir precio de mayoreo para clientes registrados"
                />
              </Grid>

              <Grid item xs={12}>
                <CustomButton
                  fullWidth={true}
                  onClick={(e) => handleProductSubmit(e)}
                  disabled={isFormIncomplete() || isLoading}
                  marginTop="10px"
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
