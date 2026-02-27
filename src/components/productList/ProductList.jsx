import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import {
  deleteProducts,
  getProducts,
  upperCodeProducts,
} from "../apis/products";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch } from "react-redux";
import {
  showProductModal,
  showProductModal2,
  hideProductModal,
} from "../redux/productModal/ProductModalActions";
import ProductModal from "../productModal/ProductModal";
import { exportToExcel } from "../utils/utils";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { getBrands } from "../apis/brands";
import { getUserData } from "../apis/utils";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { getDepartments } from "../apis/departments";
import CustomTooltip from "../commons/Tooltip";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Box,
  Stack,
  Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import TextFormatIcon from "@mui/icons-material/TextFormat";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [params, setParams] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [outOfStockPercentage, setoutOfStockPercentage] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOptions = async () => {
      const response = await getBrands();
      setBrands(response.data);
      const response2 = await getDepartments();
      setDepartments(response2.data);
    };

    fetchOptions();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const response = await getProducts(params);
    const products = response.data;

    setProducts(products);

    const totalProducts = products.length;

    const outOfStockCount = products.filter(
      (product) => product.stock === 0
    ).length;
    const outOfStockPercentage = (outOfStockCount / totalProducts) * 100;
    setoutOfStockPercentage(outOfStockPercentage);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleOpenModal = (brand) => {
    dispatch(hideProductModal());
    setTimeout(() => dispatch(showProductModal(brand)));
  };

  const handleOpenModal2 = (brand) => {
    dispatch(hideProductModal());
    setTimeout(() => dispatch(showProductModal2(brand)));
  };

  const handleUpdateProductList = (updatedProduct) => {
    setProducts((prevProducts) => {
      const productExists = prevProducts.some(
        (b) => b.id === updatedProduct.id
      );
      return productExists
        ? prevProducts.map((b) =>
            b.id === updatedProduct.id ? updatedProduct : b
          )
        : [...prevProducts, updatedProduct];
    });
  };

  const handleDownload = async () => {
    const storeProductsForReport = products.map(
      ({
        code: Código,
        brand_name: Marca,
        department_name: Departamento,
        name: Nombre,
        stock: Stock,
        cost: Costo,
        unit_price: PrecioUnitario,
        wholesale_price: PrecioMayoreo,
        min_wholesale_quantity: CantidadMinimaMayoreo,
        wholesale_price_on_client_discount: PMDC,
        image: Imagen,
      }) => ({
        Código,
        Marca,
        Departamento,
        Nombre,
        Stock,
        Costo,
        "Precio unitario": PrecioUnitario,
        "Precio mayoreo": PrecioMayoreo,
        "Cantidad minima mayoreo": CantidadMinimaMayoreo,
        "Precio Mayoreo en descuento de clientes": PMDC,
        Imagen,
      })
    );

    const prefixName = "Productos";
    exportToExcel(storeProductsForReport, prefixName);
  };

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDeleteProducts = async () => {
    const stockCount = selectedRows.reduce(
      (sum, element) => sum + element.stock,
      0
    );

    if (stockCount > 0) {
      Swal.fire({
        icon: "error",
        title: "Error al borrar productos",
        text: "Los productos no deben tener stock cero para ser borrados",
        timer: 5000,
      });
      return;
    }

    const selectedIds = selectedRows.map((element) => element.id);
    const response = await deleteProducts(selectedIds);

    if (response.status === 200) {
      const updatedProducts = products.filter(
        (product) => !selectedIds.includes(product.id)
      );

      setProducts(updatedProducts);

      Swal.fire({
        icon: "success",
        title: "Productos eliminados",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al borrar productos",
        timer: 5000,
      });
    }
  };
  const handleCheck = (e) => {
    setConfirmDeletion(e.target.checked);
  };

  const handleGenerate = (code) => {
    if (code.trim() === "") return;
    const url = `https://barcodeapi.org/api/code39/${encodeURIComponent(code)}`;
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `barcode_${code}.png`;
        link.click();
      });
  };

  const handleUpperCodeProducts = async () => {
    const response = await upperCodeProducts();

    if (response.status === 200) {
      await fetchProducts();

      Swal.fire({
        icon: "success",
        title: "Códigos pasaron a mayusculas",
        timer: 5000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al procesar códigos de productos",
        timer: 5000,
      });
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} className="custom-section">
          <CustomSpinner isLoading={loading} />
          <ProductModal onUpdateProductList={handleUpdateProductList} />
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <h1>Productos</h1>
            <Stack direction="row" spacing={1}>
              <CustomButton onClick={() => handleOpenModal()} startIcon={<AddIcon />}>
                Nuevo Producto
              </CustomButton>
            </Stack>
          </Stack>
          {/* Sección de acciones */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={confirmDeletion}
                    onChange={handleCheck}
                  />
                }
                label="Confirmar borrado"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton
                onClick={handleDeleteProducts}
                disabled={
                  selectedRows.length === 0 ||
                  !confirmDeletion ||
                  getUserData().role !== "owner"
                }
                startIcon={<DeleteIcon />}
                color="error"
                fullWidth
              >
                Eliminar
              </CustomButton>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTooltip
                text={
                  "Formatea a mayusculas y reemplaza la comilla simple (') por guión medio (-)"
                }
              >
                <CustomButton onClick={handleUpperCodeProducts} fullWidth startIcon={<TextFormatIcon />}>
                  Formatear códigos
                </CustomButton>
              </CustomTooltip>
            </Grid>
            <Grid  item xs={12} md={3}>

            <CustomButton
                onClick={handleDownload}
                disabled={products.length === 0}
                startIcon={<DownloadIcon />}
                fullWidth
              >
                Descargar
              </CustomButton>
            </Grid>
          </Grid>

          {/* Sección de filtros */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Marca</InputLabel>
                <Select
                  value={params.brand_id || ""}
                  onChange={handleDataChange}
                  name="brand_id"
                  label="Marca"
                >
                  <MenuItem value="">Todas las marcas</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name} ({brand.product_count})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {departments.length > 0 && (
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Departamento</InputLabel>
                  <Select
                    value={params.department_id || ""}
                    onChange={handleDataChange}
                    name="department_id"
                    label="Departamento"
                  >
                    <MenuItem value="">Todos los departamentos</MenuItem>
                    <MenuItem value="0">Sin departamento</MenuItem>
                    {departments.map((department) => (
                      <MenuItem key={department.id} value={department.id}>
                        {department.name} ({department.product_count})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                label="Stock Máximo"
                fullWidth
                type="number"
                value={params.max_stock || ""}
                onChange={handleDataChange}
                name="max_stock"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              
              <CustomButton fullWidth onClick={fetchProducts} startIcon={<SearchIcon />}>
                Buscar
              </CustomButton>
            </Grid>
            <Grid item xs={12} md={3}>
              {products.length > 0 && (
                <Box sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                  {outOfStockPercentage.toFixed(0)}% de los productos está vacío
                </Box>
              )}
            </Grid>
          </Grid>

          <CustomTable
            setSelectedRows={setSelectedRows}
            searcher={true}
            progressPending={loading}
            data={products}
            columns={[
              {
                name: "Código",
                selector: (row) => row.code,
                grow: 2,
              },
              {
                name: "Marca",
                selector: (row) => row.brand_name,
                wrap: true,
              },

              {
                name: "Departamento",
                selector: (row) => row.department_name,
              },
              {
                name: "Nombre",
                selector: (row) => row.name,
                grow: 2,
                wrap: true,
              },
              {
                name: "Stock",
                selector: (row) => row.stock,
                omit: getUserData().role !== "owner",
              },

              {
                name: "Costo",
                selector: (row) => "$" + row.cost,
                wrap: true,
              },

              {
                grow: 2.5,
                name: "Precios",
                cell: (row) => (
                  <>
                    Unitario: ${row.unit_price}
                    <br />
                    Mayoreo:{" "}
                    {row.apply_wholesale
                      ? "$" +
                        row.wholesale_price +
                        " (" +
                        row.min_wholesale_quantity +
                        "+)"
                      : "NA"}
                  </>
                ),
              },

              {
                name: "Acciones",
                grow: getUserData().role === "owner" ? 2.5 : 1,
                cell: (row) => (
                  <>
                    <CustomTooltip text={"Editar producto"} position={"top"}>
                      <CustomButton onClick={() => handleOpenModal(row)}>
                        <EditIcon />
                      </CustomButton>
                    </CustomTooltip>
                    <CustomTooltip
                      text={"Mostrar stock en todas las tiendas y almacenes"}
                      position={"top"}
                    >
                      <CustomButton
                        onClick={() => handleOpenModal2(row)}
                        hidden={getUserData().role !== "owner"}
                      >
                        <ChecklistIcon />
                      </CustomButton>
                    </CustomTooltip>
                    <CustomTooltip
                      text={"Generar código de barras"}
                      position={"top"}
                    >
                      <CustomButton
                        onClick={() => handleGenerate(row.code)}
                        fullWidth
                      >
                        <span style={{ fontSize: "11px" }}>BC39</span>
                      </CustomButton>
                    </CustomTooltip>
                  </>
                ),
              },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ProductList;
