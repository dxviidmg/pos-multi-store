import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { deleteProducts, getProducts, upperCodeProducts } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { useModal } from "../../../hooks/useModal";
import ProductModal from "../ProductModal/ProductModal";
import { exportToExcel } from "../../../utils/utils";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getBrands } from "../../../api/brands";
import { getDepartments } from "../../../api/departments";
import { getUserData } from "../../../api/utils";
import { showSuccess, showError, showConfirm } from "../../../utils/alerts";
import CustomTooltip from "../../ui/Tooltip";
import { UI_TEXT } from "../../../constants";
import {
  Grid, TextField, Select, MenuItem, FormControl, InputLabel, Box, Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import TextFormatIcon from "@mui/icons-material/TextFormat";

const ProductList = () => {
  const user = getUserData();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [params, setParams] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [outOfStockPercentage, setOutOfStockPercentage] = useState(0);
  const productModal = useModal();

  useEffect(() => {
    const fetchOptions = async () => {
      const [brandsRes, deptsRes] = await Promise.all([getBrands(), getDepartments()]);
      setBrands(brandsRes.data);
      setDepartments(deptsRes.data);
    };
    fetchOptions();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const response = await getProducts(params);
    const data = response.data;
    setProducts(data);
    const outOfStock = data.filter((p) => p.stock === 0).length;
    setOutOfStockPercentage((outOfStock / data.length) * 100);
    setLoading(false);
  };

  const handleUpdateProductList = (updated) => {
    setProducts((prev) => {
      const exists = prev.some((item) => item.id === updated.id);
      return exists
        ? prev.map((item) => (item.id === updated.id ? updated : item))
        : [...prev, updated];
    });
  };

  const handleDownload = () => {
    const data = products.map(({
      code, brand_name, department_name, name, stock, cost,
      unit_price, wholesale_price, min_wholesale_quantity,
      wholesale_price_on_client_discount, image,
    }) => ({
      Código: code, Marca: brand_name, Departamento: department_name,
      Nombre: name, Stock: stock, Costo: cost,
      "Precio unitario": unit_price, "Precio mayoreo": wholesale_price,
      "Cantidad mínima mayoreo": min_wholesale_quantity,
      "Precio Mayoreo en descuento de clientes": wholesale_price_on_client_discount,
      Imagen: image,
    }));
    exportToExcel(data, "Productos");
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteProducts = async () => {
    const stockCount = selectedRows.reduce((sum, el) => sum + el.stock, 0);
    if (stockCount > 0) {
      showError("Error al borrar productos", "Los productos no deben tener stock cero para ser borrados");
      return;
    }
    const confirmed = await showConfirm("¿Eliminar productos seleccionados?", `Se eliminarán ${selectedRows.length} producto(s)`);
    if (!confirmed) return;

    const selectedIds = selectedRows.map((el) => el.id);
    const response = await deleteProducts(selectedIds);

    if (response.status === 200) {
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      showSuccess("Productos eliminados");
    } else {
      showError("Error al borrar productos");
    }
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
      })
      .catch(() => showError("Error al generar código de barras"));
  };

  const handleUpperCodeProducts = async () => {
    const response = await upperCodeProducts();
    if (response.status === 200) {
      await fetchProducts();
      showSuccess("Códigos pasaron a mayúsculas");
    } else {
      showError("Error al procesar códigos de productos");
    }
  };

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <ProductModal isOpen={productModal.isOpen} product={productModal.data} onClose={productModal.close} onUpdate={handleUpdateProductList} />

      <Grid container>
        <Grid item xs={12} className="card">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <h1>Productos</h1>
            <CustomButton onClick={() => productModal.open({ product: null, showStoreProducts: false })} startIcon={<AddIcon />}>
              Nuevo Producto
            </CustomButton>
          </Stack>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField
                size="small" label="Buscar por código" fullWidth
                value={params.code || ""} onChange={handleDataChange} name="code"
                onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Marca</InputLabel>
                <Select value={params.brand_id || ""} onChange={handleDataChange} name="brand_id" label="Marca">
                  <MenuItem value="">Todas las marcas</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand.id} value={brand.id}>{brand.name} ({brand.product_count})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {departments.length > 0 && (
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Departamento</InputLabel>
                  <Select value={params.department_id || ""} onChange={handleDataChange} name="department_id" label="Departamento">
                    <MenuItem value="">{UI_TEXT.ALL_DEPARTMENTS}</MenuItem>
                    <MenuItem value="0">Sin departamento</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>{dept.name} ({dept.product_count})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} md={3}>
              <TextField size="small" label="Stock Máximo" fullWidth type="number"
                value={params.max_stock || ""} onChange={handleDataChange} name="max_stock"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton fullWidth onClick={fetchProducts} startIcon={<SearchIcon />}>
                Buscar
              </CustomButton>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton fullWidth onClick={handleDownload} disabled={products.length === 0} startIcon={<DownloadIcon />}>
                Descargar productos
              </CustomButton>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton
                fullWidth
                onClick={handleDeleteProducts}
                disabled={selectedRows.length === 0 || user.role !== "owner"}
                startIcon={<DeleteIcon />}
              >
                Eliminar
              </CustomButton>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTooltip text="Formatea a mayúsculas y reemplaza la comilla simple (') por guión medio (-)">
                <CustomButton fullWidth onClick={handleUpperCodeProducts} startIcon={<TextFormatIcon />}>
                  Formatear códigos
                </CustomButton>
              </CustomTooltip>
            </Grid>
            {products.length > 0 && (
              <Grid item xs={12} md={3}>
                <Box sx={{ fontSize: '0.875rem' }}>
                  {outOfStockPercentage.toFixed(0)}% de los productos está vacío
                </Box>
              </Grid>
            )}
          </Grid>

          <DataTable
            setSelectedRows={setSelectedRows}
            searcher={true}
            progressPending={loading}
            data={products}
            columns={[
              { name: "Código", selector: (row) => row.code },
              { name: "Marca", selector: (row) => row.brand_name },
              { name: "Departamento", selector: (row) => row.department_name },
              { name: "Nombre", selector: (row) => row.name },
              { name: "Stock", selector: (row) => row.stock, omit: user.role !== "owner" },
              { name: "Costo", selector: (row) => "$" + row.cost },
              {
                name: "Precios",
                cell: (row) => (
                  <>
                    Unitario: ${row.unit_price}<br />
                    Mayoreo: {row.apply_wholesale
                      ? `$${row.wholesale_price} (${row.min_wholesale_quantity}+)`
                      : "NA"}
                  </>
                ),
              },
              {
                name: "Acciones",
                cell: (row) => (
                  <>
                    <CustomTooltip text="Editar producto">
                      <CustomButton onClick={() => productModal.open({ product: row, showStoreProducts: false })}>
                        <EditIcon />
                      </CustomButton>
                    </CustomTooltip>
                    {user.role === "owner" && (
                      <CustomTooltip text="Mostrar stock en todas las tiendas y almacenes">
                        <CustomButton onClick={() => productModal.open({ product: row, showStoreProducts: true })}>
                          <ChecklistIcon />
                        </CustomButton>
                      </CustomTooltip>
                    )}
                    <CustomTooltip text="Generar código de barras">
                      <CustomButton onClick={() => handleGenerate(row.code)}>
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
