import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getStoreProducts } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { getUserData } from "../../../api/utils";
import { exportToExcel } from "../../../utils/utils";
import { useModal } from "../../../hooks/useModal";
import StoreProductLogsModal from "../StoreProductLogsModal/StoreProductLogsModal";
import StockUpdateRequestModal from "../../inventory/StockUpdateRequestModal/StockUpdateRequestModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getBrands } from "../../../api/brands";
import { getDepartments } from "../../../api/departments";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Box, Stack, Alert } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import TuneIcon from "@mui/icons-material/Tune";
import HistoryIcon from "@mui/icons-material/History";
import SendIcon from "@mui/icons-material/Send";
import { Link } from "react-router-dom";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import CustomTooltip from "../../ui/Tooltip";
import { UI_TEXT } from "../../../constants";
import PageHeader from "../../ui/PageHeader";

const StoreProductAuditList = () => {
  const user = getUserData();
  const logsModal = useModal();
  const requestModal = useModal();
  const [storeProducts, setStoreProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ only_stock: true, requires_stock_verification: true });
  const [outOfStockPercentage, setOutOfStockPercentage] = useState(0);

  useEffect(() => {
    const fetchOptions = async () => {
      const [brandsRes, deptsRes] = await Promise.all([
        getBrands({ audit: true }),
        getDepartments({ audit: true })
      ]);
      setBrands(brandsRes.data);
      setDepartments(deptsRes.data);
    };
    fetchOptions();
  }, []);

  const fetchStoreProducts = async () => {
    setLoading(true);
    const response = await getStoreProducts(params);
    const data = response.data;
    setStoreProducts(data);
    const outOfStock = data.filter((p) => p.stock === 0).length;
    setOutOfStockPercentage((outOfStock / data.length) * 100);
    setLoading(false);
  };

  const handleDownload = () => {
    const data = storeProducts.map(({ product: { code, brand_name, name }, stock }) => ({
      Código: code, Marca: brand_name, Nombre: name, Stock: stock,
    }));
    exportToExcel(data, "Reporte Inventario a verificar " + user.store_name);
  };

  const handleUpdateStoreProductList = (updated) => {
    setStoreProducts((prev) => {
      const exists = prev.some((item) => item.id === updated.id);
      return exists
        ? prev.map((item) => (item.id === updated.id ? updated : item))
        : [...prev, updated];
    });
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

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
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <h1>Inventario a verificar</h1>
          </Stack>

          <Alert 
            severity="info" 
            variant="filled" 
            sx={{ mb: 2, py: 1.5, borderRadius: 2 }}
            icon={<NotificationImportantIcon fontSize="inherit" />}
          >
            {user.role === "owner" ? (
              <>
                <strong>Mantente atento a las solicitudes de ajuste.</strong>{" "}
                Revisa y aprueba las solicitudes de stock en{" "}
                <Link to="/solicitudes-ajustes-stock/" style={{ color: "#04346b", fontWeight: 600 }}>
                  Solicitudes de Ajuste
                </Link>{" "}
                para mantener el inventario actualizado.
              </>
            ) : (
              <>
                <strong>¿Ves un stock incorrecto?</strong> Si hay productos no registrados, regístralos. Si hay más productos registrados de los que realmente hay,{" "}
                usa el icono <SendIcon sx={{ fontSize: 14, verticalAlign: "middle" }} /> en la columna Acciones para solicitar un ajuste de stock. 
                El propietario revisará tu solicitud y la aprobará si es correcto. 
                Se recomienda contactar al propietario para una pronta respuesta. 
                Recuerda que tener el stock actualizado y corregido es un bien para todo el equipo.
              </>
            )}
          </Alert>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Código" type="text"
                value={params.code || ""} onChange={handleDataChange} name="code"
                onKeyDown={(e) => e.key === "Enter" && fetchStoreProducts()}
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Departamento</InputLabel>
                <Select value={params.department_id || ""} onChange={handleDataChange} name="department_id" label="Departamento">
                  <MenuItem value="">{UI_TEXT.ALL_DEPARTMENTS}</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>{dept.name} ({dept.product_count})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Stock máximo" type="number"
                value={params.max_stock || ""} onChange={handleDataChange} name="max_stock"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton fullWidth onClick={fetchStoreProducts} startIcon={<SearchIcon />}>
                Buscar
              </CustomButton>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton fullWidth onClick={handleDownload} disabled={storeProducts.length === 0} startIcon={<DownloadIcon />}>
                Descargar Inventario a verificar
              </CustomButton>
            </Grid>
            {storeProducts.length > 0 && (
              <Grid item xs={12} md={3}>
                <Box sx={{ fontSize: '0.875rem', lineHeight: '40px' }}>
                  {outOfStockPercentage.toFixed(0)}% de los productos está vacío
                </Box>
              </Grid>
            )}
          </Grid>

          <DataTable
            searcher={true}
            progressPending={loading}
            noDataComponent="Sin productos"
            data={storeProducts}
            columns={[
              { name: "Código", selector: (row) => row.product.code },
              { name: "Marca", selector: (row) => row.product.brand_name },
              { name: "Departamento", selector: (row) => row.product.department_name },
              { name: "Nombre", selector: (row) => row.product.name },
              { name: "Stock", selector: (row) => row.stock },
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
                    <CustomTooltip text="Movimientos de stock">
                      <CustomButton onClick={() => logsModal.open({ storeProduct: row, adjustStock: false })}>
                        <HistoryIcon />
                      </CustomButton>
                    </CustomTooltip>
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
        </Grid>
      </Grid>
    </>
  );
};

export default StoreProductAuditList;
