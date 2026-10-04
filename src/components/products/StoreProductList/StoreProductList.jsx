import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getStoreProducts } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { useUser } from "../../../context/UserContext";
import { exportToExcel, upsertById } from "../../../utils/utils";
import { useModal } from "../../../hooks/useModal";
import StoreProductLogsModal from "../StoreProductLogsModal/StoreProductLogsModal";
import StockUpdateRequestModal from "../../inventory/StockUpdateRequestModal/StockUpdateRequestModal";
import StoreProductGridCard from "./StoreProductGridCard";
import CardGallery from "../../ui/CardGallery/CardGallery";
import ProductViewToggle from "../ProductList/ProductViewToggle";
import { useViewModePreference } from "../../../hooks/useViewModePreference";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getBrands } from "../../../api/brands";
import { getDepartments } from "../../../api/departments";
import { Grid, TextField, Autocomplete, Select, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import PageHeader from "../../ui/PageHeader";
import StoreProductActions from "../StoreProductActions/StoreProductActions";
import StockRequestAlert from "../StockRequestAlert/StockRequestAlert";

const StoreProductList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useUser();
  const logsModal = useModal();
  const requestModal = useModal();
  const [viewModePref, setViewModePref] = useViewModePreference("storeProductList.viewMode");
  const viewMode = isMobile ? "gallery" : viewModePref;
  const [storeProducts, setStoreProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ only_stock: true });
  const [showAlert, setShowAlert] = useState(true);
  const [searchField, setSearchField] = useState("code");

  useEffect(() => {
    const fetchOptions = async () => {
      const [brandsRes, deptsRes] = await Promise.all([getBrands(), getDepartments()]);
      setBrands(brandsRes.data);
      setDepartments(deptsRes.data);
      setOptionsLoaded(true);
    };
    fetchOptions();
  }, []);

  const fetchStoreProducts = async () => {
    setLoading(true);
    const response = await getStoreProducts(params);
    const data = response.data;
    setStoreProducts(data);
    setLoading(false);
  };

  const handleDownload = () => {
    const data = storeProducts.map(({ product: { code, brand_name, name }, stock }) => ({
      Código: code, Marca: brand_name, Nombre: name, Stock: stock,
    }));
    exportToExcel(data, "Reporte Inventario " + user.store_name);
  };

  const handleUpdateStoreProductList = (updated) => {
    // Guardar posición del scroll antes de actualizar
    const scrollTop = document.querySelector('[role="grid"]')?.scrollTop || 0;
    
    setStoreProducts((prev) => upsertById(prev, updated));

    // Restaurar posición del scroll después de la actualización
    setTimeout(() => {
      const grid = document.querySelector('[role="grid"]');
      if (grid) grid.scrollTop = scrollTop;
    }, 0);
  };

  // Handlers para galería (reutilizan los flujos existentes)
  const handleLogsGallery = (storeProduct) => logsModal.open({ storeProduct, adjustStock: false });
  const handleAdjustStockGallery = (storeProduct) => logsModal.open({ storeProduct, adjustStock: true });
  const handleRequestGallery = (storeProduct) => requestModal.open(storeProduct);

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

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <StoreProductLogsModal
        isOpen={logsModal.isOpen}
        logs={logsModal.data}
        onClose={logsModal.close}
        onUpdate={handleUpdateStoreProductList}
      />
      <StockUpdateRequestModal isOpen={requestModal.isOpen} storeProduct={requestModal.data} onClose={requestModal.close} />

      <Grid container>
        <Grid item xs={12} className="card">
          <PageHeader title="Inventario" childrenMd={8}>
            {showAlert && <StockRequestAlert role={user.role} onClose={() => setShowAlert(false)} />}
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
                <MenuItem value="name">Nombre</MenuItem>
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
                onKeyDown={(e) => e.key === "Enter" && fetchStoreProducts()}
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton 
                fullWidth 
                onClick={fetchStoreProducts}
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
            <Grid item xs={12} md={3}>
              <Autocomplete
                size="small"
                options={departments}
                getOptionLabel={(option) => `${option.name} (${option.product_count})`}
                value={departments.find((d) => d.id === params.department_id) || null}
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
            {!isMobile && (
              <Grid item xs={12} md={3}>
                <ProductViewToggle value={viewModePref} onChange={setViewModePref} />
              </Grid>
            )}

            {/* Fila 3: DESCARGA */}
            {user.role !== "seller" && (
            <Grid item xs={12} md={12}>
              <CustomButton 
                fullWidth 
                onClick={handleDownload} 
                disabled={storeProducts.length === 0} 
                startIcon={<DownloadIcon />}
              >
                Descargar
              </CustomButton>
            </Grid>
            )}
          </Grid>

          {viewMode === "gallery" ? (
            <CardGallery
              items={storeProducts}
              loading={loading}
              emptyText="Sin inventario"
              renderItem={(storeProduct) => (
                <StoreProductGridCard
                  storeProduct={storeProduct}
                  onAdjustStock={handleAdjustStockGallery}
                  onLogs={handleLogsGallery}
                  onRequest={handleRequestGallery}
                  role={user.role}
                />
              )}
            />
          ) : (
            <DataTable
              progressPending={loading}
              noDataComponent="Sin inventario"
              data={storeProducts}
              columns={[
                { name: "Código", selector: (row) => row.product.code },
                { name: "Marca", selector: (row) => row.product.brand_name },
              { name: "Departamento", selector: (row) => row.product.department_name },
              { name: "Nombre", selector: (row) => row.product.name },
              { name: "Stock", selector: (row) => row.stock },
              { name: "Unidad", selector: (row) => row.product.unit },
              {
                name: "Acciones",
                cell: (row) => (
                  <StoreProductActions
                    row={row}
                    role={user.role}
                    onAdjust={handleAdjustStockGallery}
                    onLogs={handleLogsGallery}
                    onRequest={handleRequestGallery}
                  />
                ),
              },
            ]}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default StoreProductList;
