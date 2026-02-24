import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Form, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { getBrands } from "../apis/brands";
import Swal from "sweetalert2";
import { hideProductModal } from "../redux/productModal/ProductModalActions";
import {
  createProduct,
  getStoreProducts,
  updateProduct,
} from "../apis/products";
import noPhoto from "../../assets/images/noPhoto.jpg";
import { getDepartments } from "../apis/departments";
import CustomTable from "../commons/customTable/customTable";
import { Grid } from "@mui/material";

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

const ProductModal = ({ onUpdateProductList }) => {
  const { showProductModal, product, showStoreProducts } = useSelector(
    (state) => state.ProductModalReducer
  );

  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [storeProduct, setStoreProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (product) {
        setFormData(product);
        setPreviewImage(product.image || noPhoto);

        if (showStoreProducts) {
          const r = await getStoreProducts({
            code: product.code,
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

  const dispatch = useDispatch();

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
      dispatch(hideProductModal());
      onUpdateProductList(response.data);
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
      showOut={showProductModal}
      onClose={() => dispatch(hideProductModal())}
      title={showStoreProducts? "Ver stock": formData.id ? "Actualizar producto" : "Crear producto"}
    >
      <div className="custom-section">
        <Grid container hidden={showStoreProducts}>
          <Grid item xs={12} md={4} className="">
            <Image src={previewImage} fluid rounded />
            <Form.Group controlId="formFile" className="mt-3">
              <Form.Label>Selecciona una imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Form.Label>Marca</Form.Label>
                <Form.Select
                  value={formData.brand}
                  onChange={handleDataChange}
                  name="brand"
                >
                  <option value="0">Selecciona una marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </Form.Select>
              </Grid>

              <Grid item xs={12} md={6}>
                <Form.Label>Departamento</Form.Label>
                <Form.Select
                  value={formData.department}
                  onChange={handleDataChange}
                  name="department"
                >
                  <option value="0">Selecciona un departamento</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Form.Select>
              </Grid>

              <Grid item xs={12} md={6}>
                <Form.Label>Código</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.code}
                  placeholder="Código"
                  name="code"
                  onChange={handleDataChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  placeholder="Nombre"
                  name="name"
                  onChange={handleDataChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Form.Label>Costo</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.cost}
                  placeholder="Costo"
                  name="cost"
                  onChange={handleDataChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Form.Label>P. unitario</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.unit_price}
                  placeholder="Precio unitario"
                  name="unit_price"
                  onChange={handleDataChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Form.Label>P. mayoreo</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.wholesale_price}
                  placeholder="Precio de mayoreo"
                  name="wholesale_price"
                  onChange={handleDataChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Form.Label>Min. mayoreo</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.min_wholesale_quantity}
                  placeholder="Cantidad minima mayoreo"
                  name="min_wholesale_quantity"
                  onChange={handleDataChange}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Form.Check // prettier-ignore
                  type="checkbox"
                  id={`default-checkbox`}
                  label="Precio de mayoreo en descuento de cliente registrado"
                  checked={formData.wholesale_price_on_client_discount === true}
                  onChange={handleDataChange}
                  name="wholesale_price_on_client_discount"
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <CustomButton
                  fullWidth={true}
                  onClick={(e) => handleProductSubmit(e)}
                  disabled={isFormIncomplete()}
                  marginTop="10px"
                >
                  {formData.id ? "Actualizar" : "Crear"} producto
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container hidden={!showStoreProducts}>
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
      </div>
    </CustomModal>
  );
};

export default ProductModal;
