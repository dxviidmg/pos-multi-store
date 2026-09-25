import React, { useEffect, useRef, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { deleteProducts, getProducts, updateProduct, upperCodeProducts } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { useModal } from "../../../hooks/useModal";
import ProductModal from "../ProductModal/ProductModal";
import { exportToExcel } from "../../../utils/utils";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getBrands } from "../../../api/brands";
import { getDepartments } from "../../../api/departments";
import { useUser } from "../../../context/UserContext";
import { showSuccess, showError, showConfirm } from "../../../utils/alerts";
import CustomTooltip from "../../ui/Tooltip";
import PageHeader from "../../ui/PageHeader";
import { Grid, TextField, Autocomplete, Select, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import HistoryIcon from "@mui/icons-material/History";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PriceLogsModal from "../PriceLogsModal/PriceLogsModal";
import PriceUpdateModal from "../PriceUpdateModal/PriceUpdateModal";
import ProductViewToggle from "./ProductViewToggle";
import ProductGallery from "./ProductGallery";
import { useViewModePreference } from "../../../hooks/useViewModePreference";
import { convertImageToWebp } from "../../../utils/image";

const ProductList = () => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [params, setParams] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewMode, setViewMode] = useViewModePreference("productList.viewMode", "table");
  const [searchField, setSearchField] = useState("code");
  const productModal = useModal();
  const priceLogsModal = useModal();
  const priceUpdateModal = useModal();
  const cameraInputRef = useRef(null);
  const cameraProductRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      const [brandsRes, deptsRes] = await Promise.all([getBrands(), getDepartments()]);
      setBrands(brandsRes.data);
      setDepartments(deptsRes.data);
      setOptionsLoaded(true);
    };
    fetchOptions();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const response = await getProducts(params);
    const data = response.data;
    setProducts(data);
    setLoading(false);
  };

  const handleUpdateProductList = (updated) => {
    // Guardar posición del scroll antes de actualizar
    const scrollTop = document.querySelector('[role="grid"]')?.scrollTop || 0;
    
    setProducts((prev) => {
      const exists = prev.some((item) => item.id === updated.id);
      return exists
        ? prev.map((item) => (item.id === updated.id ? updated : item))
        : [...prev, updated];
    });

    // Restaurar posición del scroll después de la actualización
    setTimeout(() => {
      const grid = document.querySelector('[role="grid"]');
      if (grid) grid.scrollTop = scrollTop;
    }, 0);
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
      "Permitir mayoreo con descuento de cliente": wholesale_price_on_client_discount,
      Imagen: image,
    }));
    exportToExcel(data, "Productos");
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
    setParams((prev) => {
      const newParams = { ...prev };
      delete newParams.code;
      delete newParams.q;
      return newParams;
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setParams((prev) => ({
      ...prev,
      [searchField === "code" ? "code" : "q"]: value,
      [searchField === "code" ? "q" : "code"]: undefined,
    }));
  };

  const isSearchDisabled = !params.code && !params.q && !params.brand_id && !params.department_id && !params.max_stock;

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

  const handleUpdatePrices = () => {
    priceUpdateModal.open();
  };

  // Handlers de acciones para la vista de galería (reutilizan los flujos existentes).
  const handleEditProduct = (product) => productModal.open({ product, showStoreProducts: false });
  const handlePriceLogs = (product) => priceLogsModal.open(product);
  const handleStoreStock = (product) => productModal.open({ product, showStoreProducts: true });

  const handleCameraClick = (product) => {
    cameraProductRef.current = product;
    cameraInputRef.current.value = "";
    cameraInputRef.current.click();
  };

  const handleCameraCapture = async (e) => {
    const file = e.target.files[0];
    const product = cameraProductRef.current;
    if (!file || !product) return;

    try {
      const webpFile = await convertImageToWebp(file, { quality: 0.85, maxWidth: 1000, maxHeight: 1000 });
      const response = await updateProduct({ id: product.id, image: webpFile });
      if (response.status === 200) {
        handleUpdateProductList(response.data);
        showSuccess("Imagen actualizada");
      }
    } catch {
      showError("Error al actualizar imagen");
    }
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
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        style={{ display: "none" }}
      />
      <CustomSpinner isLoading={loading} />
      <ProductModal isOpen={productModal.isOpen} product={productModal.data} onClose={productModal.close} onUpdate={handleUpdateProductList} />
      <PriceLogsModal isOpen={priceLogsModal.isOpen} product={priceLogsModal.data} onClose={priceLogsModal.close} />
      <PriceUpdateModal isOpen={priceUpdateModal.isOpen} onClose={priceUpdateModal.close} selectedProducts={selectedRows} onSuccess={fetchProducts} />

      <Grid container>
        <Grid item xs={12} className="card">
          <PageHeader title="Productos">
            <CustomButton fullWidth onClick={() => productModal.open({ product: null, showStoreProducts: false })} startIcon={<AddIcon />}>
              Nuevo Producto
            </CustomButton>
          </PageHeader>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Fila 1: BÚSQUEDA + BOTÓN BUSCAR */}
            <Grid item xs={12} md={3}>
              <Select
                size="small"
                fullWidth
                value={searchField}
                onChange={handleSearchFieldChange}
                sx={{ backgroundColor: "rgba(4, 53, 107, 0.05)" }}
              >
                <MenuItem value="code">Código</MenuItem>
                <MenuItem value="q">Nombre</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                size="small" 
                fullWidth 
                placeholder={searchField === "code" ? "Ej: SKU-001" : "Ej: Producto..."} 
                type="text"
                value={searchField === "code" ? (params.code || "") : (params.q || "")} 
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton 
                fullWidth 
                onClick={fetchProducts}
                startIcon={<SearchIcon />}
                disabled={isSearchDisabled}
              >
                Buscar
              </CustomButton>
            </Grid>

            {/* Fila 2: FILTROS SECUNDARIOS */}
            <Grid item xs={12} md={3}>
              <Autocomplete
                size="small"
                options={brands}
                getOptionLabel={(option) => `${option.name} (${option.product_count})`}
                value={brands.find((b) => b.id === params.brand_id) || null}
                onChange={(_, newValue) => {
                  setParams((prev) => ({ ...prev, brand_id: newValue?.id || "" }));
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disabled={optionsLoaded && brands.length === 0}
                renderInput={(inputProps) => (
                  <TextField {...inputProps} label="Marca" />
                )}
              />
            </Grid>
            {departments.length > 0 && (
              <Grid item xs={12} md={3}>
                <Autocomplete
                  size="small"
                  options={[{ id: "0", name: "Sin departamento", product_count: 0 }, ...departments]}
                  getOptionLabel={(option) => option.id === "0" ? option.name : `${option.name} (${option.product_count})`}
                  value={
                    params.department_id === "0"
                      ? { id: "0", name: "Sin departamento", product_count: 0 }
                      : departments.find((d) => d.id === params.department_id) || null
                  }
                  onChange={(_, newValue) => {
                    setParams((prev) => ({ ...prev, department_id: newValue?.id || "" }));
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={optionsLoaded && departments.length === 0}
                  renderInput={(inputProps) => (
                    <TextField {...inputProps} label="Departamento" />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12} md={3}>
              <TextField 
                size="small" 
                fullWidth 
                label="Stock máximo" 
                type="number"
                value={params.max_stock || ""} 
                onChange={handleDataChange} 
                name="max_stock"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <ProductViewToggle value={viewMode} onChange={setViewMode} />
            </Grid>

            {/* Fila 3: ACCIONES */}
            <Grid item xs={12} md={3}>
              <CustomButton fullWidth onClick={handleDownload} disabled={products.length === 0} startIcon={<DownloadIcon />}>
                Descargar
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
              <CustomTooltip text="Formatea a mayúsculas y reemplaza la comilla simple (') por guión medio (-)" fullWidth>
                <CustomButton fullWidth onClick={handleUpperCodeProducts} startIcon={<TextFormatIcon />}>
                  Formatear códigos
                </CustomButton>
              </CustomTooltip>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton
                fullWidth
                onClick={handleUpdatePrices}
                disabled={selectedRows.length < 2 || user.role !== "owner"}
                startIcon={<PriceChangeIcon />}
              >
                Actualizar precios
              </CustomButton>
            </Grid>
          </Grid>

          {viewMode === "gallery" ? (
            <ProductGallery
              products={products}
              loading={loading}
              onEdit={handleEditProduct}
              onPriceLogs={handlePriceLogs}
              onStoreStock={handleStoreStock}
              onCameraPhoto={handleCameraClick}
              role={user.role}
            />
          ) : (
            <DataTable
              setSelectedRows={setSelectedRows}
              searcher={false}
              progressPending={loading}
              noDataComponent="Sin productos"
              data={products}
              columns={[
                { name: "Código", selector: (row) => row.code },
                { name: "Marca", selector: (row) => row.brand_name },
                { name: "Departamento", selector: (row) => row.department_name },
                { name: "Nombre", selector: (row) => row.name },
                { name: "Stock", selector: (row) => row.stock, omit: user.role !== "owner" },
                {
                  name: "Precios",
                  cell: (row) => (
                    row.apply_wholesale
                      ? <>Men: ${row.unit_price}<br />May: ${row.wholesale_price} ({row.min_wholesale_quantity}+)</>
                      : `$${row.unit_price}`
                  ),
                },
                ...(user.role !== "seller" ? [{
                  name: "Acciones",
                  width: 220,
                  cell: (row) => (
                    <>
                      <CustomTooltip text="Editar producto">
                        <CustomButton onClick={() => productModal.open({ product: row, showStoreProducts: false })}>
                          <EditIcon />
                        </CustomButton>
                      </CustomTooltip>
                      <CustomTooltip text="Tomar foto">
                        <CustomButton onClick={() => handleCameraClick(row)}>
                          <CameraAltIcon />
                        </CustomButton>
                      </CustomTooltip>
                      <CustomTooltip text="Historial de precios">
                        <CustomButton onClick={() => priceLogsModal.open(row)}>
                          <HistoryIcon />
                        </CustomButton>
                      </CustomTooltip>
                      {user.role === "owner" && (
                        <CustomTooltip text="Mostrar stock en todas las tiendas y almacenes">
                          <CustomButton onClick={() => productModal.open({ product: row, showStoreProducts: true })}>
                            <ChecklistIcon />
                          </CustomButton>
                        </CustomTooltip>
                      )}
                    </>
                  ),
                }] : []),
              ]}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ProductList;
