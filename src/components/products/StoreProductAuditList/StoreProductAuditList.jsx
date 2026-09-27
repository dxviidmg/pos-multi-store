import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getStoreProducts } from "../../../api/products";
import CustomButton from "../../ui/Button/Button";
import { useUser } from "../../../context/UserContext";
import { exportToExcel } from "../../../utils/utils";
import { useModal } from "../../../hooks/useModal";
import StoreProductLogsModal from "../StoreProductLogsModal/StoreProductLogsModal";
import StockUpdateRequestModal from "../../inventory/StockUpdateRequestModal/StockUpdateRequestModal";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getBrands } from "../../../api/brands";
import { getDepartments } from "../../../api/departments";
import { Grid, TextField, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import PageHeader from "../../ui/PageHeader";
import StoreProductActions from "../StoreProductActions/StoreProductActions";
import StockRequestAlert from "../StockRequestAlert/StockRequestAlert";


const StoreProductAuditList = () => {
  const { user } = useUser();
  const logsModal = useModal();
  const requestModal = useModal();
  const [storeProducts, setStoreProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ only_stock: true, requires_stock_verification: true });
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      const [brandsRes, deptsRes] = await Promise.all([
        getBrands({ audit: true }),
        getDepartments({ audit: true })
      ]);
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
    exportToExcel(data, "Reporte Inventario a verificar " + user.store_name);
  };

  const handleUpdateStoreProductList = (updated) => {
    setStoreProducts((prev) => prev.filter((item) => item.id !== updated.id));
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
          <PageHeader title="Inventario a verificar" childrenMd={8}>
            {showAlert && <StockRequestAlert role={user.role} onClose={() => setShowAlert(false)} />}
          </PageHeader>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Código" type="text"
                value={params.code || ""} onChange={handleDataChange} name="code"
                onKeyDown={(e) => e.key === "Enter" && fetchStoreProducts()}
              />
            </Grid>
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
                Descargar inventario
              </CustomButton>
            </Grid>
          </Grid>

          <DataTable
            searcher
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
                  <StoreProductActions
                    row={row}
                    role={user.role}
                    onAdjust={(storeProduct) => logsModal.open({ storeProduct, adjustStock: true })}
                    onLogs={(storeProduct) => logsModal.open({ storeProduct, adjustStock: false })}
                    onRequest={requestModal.open}
                  />
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
