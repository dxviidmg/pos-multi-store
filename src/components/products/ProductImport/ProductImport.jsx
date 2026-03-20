import React, { useEffect, useState, useRef } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import {
  getImportCanIncludeQuantity,
  importProducts,
  importProductsValidation,
} from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showError } from "../../../utils/alerts";
import { chooseIcon } from "../../ui/Icons/Icons";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { Alert, Grid, Select, MenuItem, FormControl, InputLabel, Typography, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PublishIcon from "@mui/icons-material/Publish";
import DownloadIcon from "@mui/icons-material/Download";

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

const URL_TEMPLATE =
  process.env.REACT_APP_API_URL +
  "/static/templates/SmartVenta_plantilla_importacion_productos.xlsx";

const DATA_SAMPLE = [
  { code: 1, brand: "Marca 1", name: "Nombre del producto 1", departament: "Departamento 1", cost: 10, unit_price: 20, wholesale_price: 15, min_wholesale_quantity: 3, wholesale_price_on_client_discount: "Si" },
  { code: 2, brand: "Marca 2", name: "Nombre del producto 2", departament: "Departamento 1", cost: 12, unit_price: 22 },
  { code: 3, brand: "Marca 3", name: "Nombre del producto 3", departament: "", cost: 14, unit_price: 22, wholesale_price: 15, min_wholesale_quantity: 3 },
];

const CREATE_OPTIONS = [
  { value: "Y", label: "Si" },
  { value: "N", label: "No" },
];

const productColumns = [
  { name: "# Col", selector: (row) => row.excel_row },
  { name: "Código", selector: (row) => row.code },
  { name: "Marca", selector: (row) => row.brand },
  { name: "Departamento", selector: (row) => row.departament },
  { name: "Nombre", selector: (row) => row.name },
  { name: "Costo", selector: (row) => row.cost },
  { name: "Precio unitario", selector: (row) => row.unit_price },
  { name: "Precio mayoreo", selector: (row) => row.wholesale_price },
  { name: "Cantidad mínima mayoreo", selector: (row) => row.min_wholesale_quantity },
  { name: "Precio mayoreo en descuentos de clientes", selector: (row) => row.wholesale_price_on_client_discount },
];

const ProductImport = () => {
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState([]);
  const [formData, setFormData] = useState({
    file: "",
    create_brands: "",
    create_departments: "",
    departments_mandatory: "",
    import_stock: "N",
  });
  const [showExample, setShowExample] = useState(false);
  const [canIncludeQuantity, setCanIncludeQuantity] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getImportCanIncludeQuantity();
      setCanIncludeQuantity(!response.data);
      if (response.data) {
        setFormData((prev) => ({ ...prev, import_stock: "" }));
      }
    };
    fetchData();
  }, []);

  const handleDataChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "file" ? files[0] : value,
    }));
  };

  const handleValidation = async () => {
    setLoading(true);
    const response = await importProductsValidation(formData);
    setLoading(false);

    if (response.status === 200) {
      setProducts(response.data);
      const errors = response.data.filter((item) => item.status !== "Exitoso");
      setProductsError(errors);
      const text = errors.length > 0
        ? errors.length + " filas tienen errores"
        : "Todas las filas están bien";
      showSuccess("Archivo cargado", text);
    } else if (response.status === 400) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      showError("Error al cargar archivo", response.response.data.error);
    } else {
      if (fileInputRef.current) fileInputRef.current.value = "";
      showError("Error al cargar archivo", "Llame a soporte");
    }
  };

  const handleImport = async () => {
    setLoading(true);
    const response = await importProducts(formData);
    setLoading(false);

    if (response.status === 200) {
      setProducts([]);
      setFormData({ ...formData, file: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      showSuccess("Productos importados");
    } else if (response.status === 400) {
      showError("Error al cargar archivo", "Archivo incorrecto");
    } else {
      showError("Error al cargar archivo", "Llame a soporte");
    }
  };

  const handleShowErrors = () => {
    setProducts(productsError);
    showSuccess("Mostrando productos con error");
  };

  const isFormIncomplete = formData.file === "" || formData.create_brands === "" ||
    formData.create_departments === "" || formData.departments_mandatory === "" || formData.import_stock === "";

  return (
    <>
      <CustomSpinner isLoading={loading} />

      <Grid item xs={12} className="card" sx={{ mb: '1.5rem' }}>
        <h1>Importación de productos</h1>
        {formData.file && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            Archivo: {formData.file.name}
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <CustomButton component="label" fullWidth startIcon={<CloudUploadIcon />}>
              Subir archivo
              <VisuallyHiddenInput type="file" ref={fileInputRef} onChange={handleDataChange} name="file" />
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>¿Crear marcas si no existen?</InputLabel>
              <Select value={formData.create_brands} onChange={handleDataChange} name="create_brands" label="¿Crear marcas si no existen?">
                <MenuItem value="">Crear marcas</MenuItem>
                {CREATE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>¿Crear departamentos si no existen?</InputLabel>
              <Select value={formData.create_departments} onChange={handleDataChange} name="create_departments" label="¿Crear departamentos si no existen?">
                <MenuItem value="">Crear departamentos</MenuItem>
                {CREATE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>¿Departamentos obligatorios?</InputLabel>
              <Select value={formData.departments_mandatory} onChange={handleDataChange} name="departments_mandatory" label="¿Departamentos obligatorios?">
                <MenuItem value="">Departamentos obligatorios</MenuItem>
                {CREATE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {!canIncludeQuantity && (
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Alert severity="info" sx={{ mb: 1 }}>
                Posiblemente sea tu primera vez aquí y tienes solo una tienda, por
                lo que aparte de importar tus productos puedes ponerle tu stock en
                tu tienda/almacén.
              </Alert>
              <FormControl fullWidth size="small">
                <InputLabel>¿Agregar inventario a la primera tienda?</InputLabel>
                <Select value={formData.import_stock} onChange={handleDataChange} name="import_stock" label="¿Agregar inventario a la primera tienda?">
                  <MenuItem value="">Agregar inventario</MenuItem>
                  {CREATE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} md={3}>
            <CustomButton onClick={handleValidation} disabled={isFormIncomplete} fullWidth startIcon={<CheckCircleIcon />}>
              Validar
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3}>
            {productsError.length > 0 ? (
              <CustomButton onClick={handleShowErrors} fullWidth startIcon={<VisibilityIcon />}>
                Ver registros con error
              </CustomButton>
            ) : (
              <CustomButton
                onClick={handleImport}
                fullWidth
                disabled={products.length === 0 || products.some((item) => item.status !== "Exitoso")}
                startIcon={<PublishIcon />}
              >
                Importar
              </CustomButton>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton href={URL_TEMPLATE} fullWidth startIcon={<DownloadIcon />}>
              Descargar plantilla
            </CustomButton>
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton
              onClick={() => setShowExample(!showExample)}
              fullWidth
              startIcon={showExample ? <VisibilityOffIcon /> : <VisibilityIcon />}
            >
              {showExample ? "Ocultar ejemplo" : "Ver ejemplo"}
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>

      {showExample && (
        <Grid item xs={12} className="card" sx={{ mb: '1.5rem' }}>
          <h1>Ejemplo de plantilla</h1>
          <SimpleTable data={DATA_SAMPLE} columns={productColumns} />
        </Grid>
      )}

      <Grid item xs={12} className="card">
        <h1>Archivo actual</h1>
        <SimpleTable
          data={products}
          columns={[
            ...productColumns,
            ...(formData.import_stock === "Y"
              ? [{ name: "Cantidad", selector: (row) => row.quantity }]
              : []),
            {
              name: "Status",
              selector: (row) => (
                <>
                  {chooseIcon(row.status === "Exitoso")}
                  {row.status !== "Exitoso" && row.status}
                </>
              ),
            },
          ]}
        />
      </Grid>
    </>
  );
};

export default ProductImport;
