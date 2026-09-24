import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getStoreProducts } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { useUser } from "../../../context/UserContext";
import { exportToExcel } from "../../../utils/utils";
import { useModal } from "../../../hooks/useModal";
import StoreProductLogsModal from "../StoreProductLogsModal/StoreProductLogsModal";
import StockUpdateRequestModal from "../../inventory/StockUpdateRequestModal/StockUpdateRequestModal";
import StoreProductGallery from "./StoreProductGallery";
import ProductViewToggle from "../ProductList/ProductViewToggle";
import { useViewModePreference } from "../../../hooks/useViewModePreference";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getBrands } from "../../../api/brands";
import { getDepartments } from "../../../api/departments";
import { Grid, TextField, Alert, Autocomplete, Select, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import TuneIcon from "@mui/icons-material/Tune";
import HistoryIcon from "@mui/icons-material/History";
import SendIcon from "@mui/icons-material/Send";
import { Link } from "react-router-dom";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import PageHeader from "../../ui/PageHeader";
import CustomTooltip from "../../ui/Tooltip";

const StoreProductList = () => {
  const { user } = useUser();
  const logsModal = useModal();
  const requestModal = useModal();
  const [viewMode, setViewMode] = useViewModePreference("storeProductList.viewMode", "table");
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
    
    setStoreProducts((prev) => {
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
      delete newParams.name;
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
            {showAlert && (
            <Alert 
              severity="info" 
              variant="filled" 
              sx={{ py: 0, borderRadius: 2 }}
              icon={<NotificationImportantIcon fontSize="inherit" />}
              onClose={() => setShowAlert(false)}
            >
              {user.role === "owner" ? (
                <>
                  <strong>Revisa y aprueba las solicitudes de stock en{" "}
                  <Link to="/solicitudes-ajustes-stock/" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                    Solicitudes de Ajuste
                  </Link>.</strong>
                </>
              ) : (
                <>
                  <strong>¿Ves un stock incorrecto?</strong> Usa el icono <SendIcon sx={{ fontSize: 14, verticalAlign: "middle" }} /> para solicitar un ajuste.
                </>
              )}
            </Alert>
            )}
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
            <Grid item xs={12} md={3}>
              <ProductViewToggle value={viewMode} onChange={setViewMode} />
            </Grid>

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
            <StoreProductGallery
              storeProducts={storeProducts}
              loading={loading}
              onAdjustStock={handleAdjustStockGallery}
              onLogs={handleLogsGallery}
              onRequest={handleRequestGallery}
              role={user.role}
            />
          ) : (
            <DataTable
              searcher={false}
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
                  <>
                    {user.role === "owner" && (
                      <CustomTooltip text="Ajustar cantidad">
                        <CustomButton onClick={() => logsModal.open({ storeProduct: row, adjustStock: true })}>
                          <TuneIcon />
                        </CustomButton>
                      </CustomTooltip>
                    )}
                    {user.role !== "seller" && (
                    <CustomTooltip text="Movimientos de stock">
                      <CustomButton onClick={() => logsModal.open({ storeProduct: row, adjustStock: false })}>
                        <HistoryIcon />
                      </CustomButton>
                    </CustomTooltip>
                    )}
                    {user.role !== "owner" && (
                      <CustomTooltip text="Solicitar ajuste de stock">
                        <CustomButton onClick={() => requestModal.open(row)}>
                          <SendIcon />
                        </CustomButton>
                      </CustomTooltip>
                    )}
                  </>
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
