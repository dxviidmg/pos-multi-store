import React, { useEffect, useState } from "react";
import { useForm } from "../../../hooks/useForm";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { getBrands } from "../../../api/brands";
import Swal from "sweetalert2";
import {
  createProduct,
  getStoreProducts,
  updateProduct,
} from "../../../api/products";
import noPhoto from "../../../assets/images/noPhoto.jpg";
import { getDepartments } from "../../../api/departments";
import CustomTable from "../../ui/Table/Table";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Box, Checkbox, FormControlLabel, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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

  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [storeProduct, setStoreProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (productData.id) {
        setFormData(productData);
        setPreviewImage(productData.image || noPhoto);

        if (showStoreProducts) {
          const r = await getStoreProducts({
            code: productData.code,
            all_stores: "Y",
          });
          setStoreProduct(r.data);
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
    const apiCall = formData.id ? updateProduct : createProduct;
    const response = await apiCall(formData);

    if ([200, 201].includes(response.status)) {
      onClose();
      onUpdate(response.data);
      setFormData(INITIAL_FORM_DATA);
      setSelectedImage(null);
      setPreviewImage(null);
      Swal.fire({
        icon: "success",
        title: `Producto ${formData.id ? "actualizado" : "creado"}`,
        timer: 5000,
      });
    } else {
      handleClientError(response);
    }
  };

  const handleClientError = (response) => {
    let message = "Error desconocido. Por favor, contacte soporte.";
    if (response.response?.status === 400 && response.response.data?.code) {
      const codeError = response.response.data.code[0];
      if (codeError === "product with this code already exists.") {
        message = "El código ya existe.";
      }
    }
    Swal.fire({
      icon: "error",
      title: `Error al ${formData.id ? "actualizar" : "crear"} producto`,
      text: message,
      timer: 5000,
    });
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
      title={showStoreProducts? "Ver stock": formData.id ? "Actualizar producto" : "Crear producto"}
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="custom-section">
        <Grid container spacing={2} hidden={showStoreProducts}>
          <Grid item xs={12} md={4}>
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
            <Box sx={{ mt: 2 }}>
              <CustomButton
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
              >
                Seleccionar imagen
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </CustomButton>
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
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="P. unitario" type="number"
                  value={formData.unit_price}
                  placeholder="Precio unitario"
                  name="unit_price"
                  onChange={handleDataChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="P. mayoreo" type="number"
                  value={formData.wholesale_price}
                  placeholder="Precio de mayoreo"
                  name="wholesale_price"
                  onChange={handleDataChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField size="small" fullWidth label="Min. mayoreo" type="number"
                  value={formData.min_wholesale_quantity}
                  placeholder="Cantidad minima mayoreo"
                  name="min_wholesale_quantity"
                  onChange={handleDataChange}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControlLabel
                  control={
                    <Checkbox size="small"
                      checked={formData.wholesale_price_on_client_discount === true}
                      onChange={handleDataChange}
                      name="wholesale_price_on_client_discount"
                    />
                  }
                  label="Precio de mayoreo en descuento de cliente registrado"
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <CustomButton
                  fullWidth={true}
                  onClick={(e) => handleProductSubmit(e)}
                  disabled={isFormIncomplete()}
                  marginTop="10px"
                  startIcon={<SaveIcon />}
                >
                  {formData.id ? "Actualizar" : "Crear"} producto
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2} hidden={!showStoreProducts}>
          <CustomTable
            data={storeProduct}
            columns={[
              {
                name: "Nombre",
                selector: (row) => row.store.full_name,
              },
              {
                name: "Stock",
                selector: (row) => row.stock,
              },
            ]}
          />
        </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default ProductModal;
