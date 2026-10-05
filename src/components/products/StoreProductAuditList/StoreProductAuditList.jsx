import React, { useCallback, useMemo, useState } from "react";
import { Grid, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import StockRequestAlert from "../StockRequestAlert/StockRequestAlert";
import ProductFilterFields from "../shared/ProductFilterFields";
import StoreProductModals from "../shared/StoreProductModals";
import { STORE_PRODUCT_BASE_COLUMNS, getStoreProductActionsColumn } from "../shared/storeProductColumns";
import { useCatalogOptions } from "../shared/useCatalogOptions";
import { useStoreProductActions } from "../shared/useStoreProductActions";
import { useStoreProductList, downloadStoreProducts } from "../shared/useStoreProductList";
import { useUser } from "../../../context/UserContext";

const INITIAL_PARAMS = { only_stock: true, requires_stock_verification: true };
const CATALOG_PARAMS = { audit: true };

const StoreProductAuditList = () => {
  const { user } = useUser();
  const {
    items: storeProducts, setItems: setStoreProducts, params, setParams, loading, fetchItems: fetchStoreProducts,
  } = useStoreProductList(INITIAL_PARAMS);
  const { brands, departments, loaded } = useCatalogOptions(CATALOG_PARAMS);
  const { logsModal, requestModal, onAdjust, onLogs, onRequest } = useStoreProductActions();
  const [showAlert, setShowAlert] = useState(true);

  // Un producto ajustado ya quedó verificado: sale de la lista
  const handleUpdateStoreProductList = useCallback((updated) => {
    setStoreProducts((prev) => prev.filter((item) => item.id !== updated.id));
  }, [setStoreProducts]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const columns = useMemo(() => [
    ...STORE_PRODUCT_BASE_COLUMNS,
    getStoreProductActionsColumn({ onAdjust, onLogs, onRequest }),
  ], [onAdjust, onLogs, onRequest]);

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <StoreProductModals logsModal={logsModal} requestModal={requestModal} onUpdate={handleUpdateStoreProductList} />

      <Grid container>
        <Grid item xs={12} className="card">
          <PageHeader title="Inventario a verificar" childrenMd={8}>
            {showAlert && <StockRequestAlert onClose={() => setShowAlert(false)} />}
          </PageHeader>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Código" type="text"
                value={params.code || ""} onChange={handleDataChange} name="code"
                onKeyDown={(e) => e.key === "Enter" && fetchStoreProducts()}
              />
            </Grid>
            <ProductFilterFields
              params={params}
              setParams={setParams}
              brands={brands}
              departments={departments}
              loaded={loaded}
            />
            <Grid item xs={12} md={3}>
              <CustomButton fullWidth onClick={fetchStoreProducts} startIcon={<SearchIcon />}>
                Buscar
              </CustomButton>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton
                fullWidth
                onClick={() => downloadStoreProducts(storeProducts, "Reporte Inventario a verificar " + user.store_name)}
                disabled={storeProducts.length === 0}
                startIcon={<DownloadIcon />}
              >
                Descargar inventario
              </CustomButton>
            </Grid>
          </Grid>

          <DataTable
            searcher
            progressPending={loading}
            noDataComponent="Sin productos"
            data={storeProducts}
            columns={columns}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default StoreProductAuditList;
