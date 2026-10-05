import React, { useMemo, useState } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import CardGallery from "../../ui/CardGallery/CardGallery";
import ViewModeToggle from "../../ui/ViewModeToggle/ViewModeToggle";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import StoreProductGridCard from "./StoreProductGridCard";
import StockRequestAlert from "../StockRequestAlert/StockRequestAlert";
import CodeNameSearchBar, { hasProductFilters } from "../shared/CodeNameSearchBar";
import ProductFilterFields from "../shared/ProductFilterFields";
import StoreProductModals from "../shared/StoreProductModals";
import { STORE_PRODUCT_BASE_COLUMNS, getStoreProductActionsColumn } from "../shared/storeProductColumns";
import { useCatalogOptions } from "../shared/useCatalogOptions";
import { useStoreProductActions } from "../shared/useStoreProductActions";
import { useStoreProductList, downloadStoreProducts } from "../shared/useStoreProductList";
import { useUser } from "../../../context/UserContext";
import { useViewModePreference } from "../../../hooks/useViewModePreference";
import { useCodeNameSearch } from "../../../hooks/useCodeNameSearch";
import { useScrollPreservingUpsert } from "../../../hooks/useScrollPreservingUpsert";
import { isSeller } from "../../../constants/routeAccess";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { PRODUCT_VIEW_OPTIONS } from "../../../constants";

const INITIAL_PARAMS = { only_stock: true };

const StoreProductList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useUser();
  const [viewModePref, setViewModePref] = useViewModePreference(STORAGE_KEYS.VIEW_MODE.STORE_PRODUCT_LIST);
  const viewMode = isMobile ? "gallery" : viewModePref;
  const {
    items: storeProducts, setItems: setStoreProducts, params, setParams, loading, fetchItems: fetchStoreProducts,
  } = useStoreProductList(INITIAL_PARAMS);
  const { brands, departments, loaded } = useCatalogOptions();
  const { searchField, handleSearchFieldChange, handleSearchChange } = useCodeNameSearch(setParams);
  const { logsModal, requestModal, onAdjust, onLogs, onRequest } = useStoreProductActions();
  const [showAlert, setShowAlert] = useState(true);

  const handleUpdateStoreProductList = useScrollPreservingUpsert(setStoreProducts);

  const columns = useMemo(() => [
    ...STORE_PRODUCT_BASE_COLUMNS,
    { name: "Unidad", selector: (row) => row.product.unit },
    getStoreProductActionsColumn({ onAdjust, onLogs, onRequest }),
  ], [onAdjust, onLogs, onRequest]);

  return (
    <>
      <CustomSpinner isLoading={loading} />
      <StoreProductModals logsModal={logsModal} requestModal={requestModal} onUpdate={handleUpdateStoreProductList} />

      <Grid container>
        <Grid item xs={12} className="card">
          <PageHeader title="Inventario" childrenMd={8}>
            {showAlert && <StockRequestAlert onClose={() => setShowAlert(false)} />}
          </PageHeader>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <CodeNameSearchBar
              searchField={searchField}
              onSearchFieldChange={handleSearchFieldChange}
              value={params[searchField]}
              onChange={handleSearchChange}
              onSearch={fetchStoreProducts}
              disabled={!hasProductFilters(params)}
            />

            <ProductFilterFields
              params={params}
              setParams={setParams}
              brands={brands}
              departments={departments}
              loaded={loaded}
            />
            {!isMobile && (
              <Grid item xs={12} md={3}>
                <ViewModeToggle value={viewModePref} onChange={setViewModePref} options={PRODUCT_VIEW_OPTIONS} />
              </Grid>
            )}

            {!isSeller(user) && (
              <Grid item xs={12} md={12}>
                <CustomButton
                  fullWidth
                  onClick={() => downloadStoreProducts(storeProducts, "Reporte Inventario " + user.store_name)}
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
                  onAdjustStock={onAdjust}
                  onLogs={onLogs}
                  onRequest={onRequest}
                />
              )}
            />
          ) : (
            <DataTable
              progressPending={loading}
              noDataComponent="Sin inventario"
              data={storeProducts}
              columns={columns}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default StoreProductList;
