import React, { useCallback, useMemo, useState } from "react";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PageHeader from "../../ui/PageHeader";
import CardGallery from "../../ui/CardGallery/CardGallery";
import ProductModal from "../ProductModal/ProductModal";
import PriceLogsModal from "../PriceLogsModal/PriceLogsModal";
import PriceUpdateModal from "../PriceUpdateModal/PriceUpdateModal";
import ProductGridCard from "./ProductGridCard";
import ProductListToolbar from "./ProductListToolbar";
import { getProductColumns } from "./ProductList.columns";
import { useProductImageCapture } from "./useProductImageCapture";
import { useFilteredList } from "../shared/useFilteredList";
import { useInvalidateCatalogOptions } from "../shared/useCatalogOptions";
import { deleteProducts, getProducts, upperCodeProducts } from "../../../api/products";
import { useModal } from "../../../hooks/useModal";
import { useViewModePreference } from "../../../hooks/useViewModePreference";
import { useScrollPreservingUpsert } from "../../../hooks/useScrollPreservingUpsert";
import { useUser } from "../../../context/UserContext";
import { isOwner, isSeller } from "../../../constants/routeAccess";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { exportToExcel } from "../../../utils/utils";
import { showSuccess, showConfirm, showRequestError, showWarning } from "../../../utils/alerts";

const INITIAL_PARAMS = {};

const downloadProducts = (products) => {
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

const ProductList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useUser();
  const owner = isOwner(user);
  const seller = isSeller(user);
  const {
    items: products, setItems: setProducts, params, setParams, loading, fetchItems: fetchProducts,
  } = useFilteredList(getProducts, INITIAL_PARAMS, "cargar los productos");
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewModePref, setViewModePref] = useViewModePreference(STORAGE_KEYS.VIEW_MODE.PRODUCT_LIST);
  const viewMode = isMobile ? "gallery" : viewModePref;
  const productModal = useModal();
  const priceLogsModal = useModal();
  const priceUpdateModal = useModal();
  const invalidateCatalogOptions = useInvalidateCatalogOptions();

  const handleUpdateProductList = useScrollPreservingUpsert(setProducts);
  const { openCamera, inputProps: cameraInputProps } = useProductImageCapture(handleUpdateProductList);

  const handleDeleteProducts = async () => {
    const stockCount = selectedRows.reduce((sum, el) => sum + el.stock, 0);
    if (stockCount > 0) {
      showWarning("No se pudo eliminar los productos", "Solo se pueden eliminar productos sin stock.");
      return;
    }
    const confirmed = await showConfirm("¿Eliminar productos seleccionados?", `Se eliminarán ${selectedRows.length} producto(s)`);
    if (!confirmed) return;

    const selectedIds = selectedRows.map((el) => el.id);
    try {
      await deleteProducts(selectedIds);
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      invalidateCatalogOptions();
      showSuccess("Productos eliminados");
    } catch (error) {
      showRequestError("eliminar los productos", error);
    }
  };

  const handleUpperCodeProducts = async () => {
    if (!owner) return;
    try {
      await upperCodeProducts();
    } catch (error) {
      showRequestError("pasar los códigos a mayúsculas", error);
      return;
    }
    showSuccess("Códigos pasaron a mayúsculas");
    fetchProducts();
  };

  const { open: openProductModal } = productModal;
  const { open: openPriceLogs } = priceLogsModal;
  const handleEditProduct = useCallback((product) => openProductModal({ product, showStoreProducts: false }), [openProductModal]);
  const handleStoreStock = useCallback((product) => openProductModal({ product, showStoreProducts: true }), [openProductModal]);

  const handleProductSaved = useCallback((product) => {
    handleUpdateProductList(product);
    invalidateCatalogOptions();
  }, [handleUpdateProductList, invalidateCatalogOptions]);

  const columns = useMemo(() => getProductColumns({
    owner,
    seller,
    onEdit: handleEditProduct,
    onCameraPhoto: openCamera,
    onPriceLogs: openPriceLogs,
    onStoreStock: handleStoreStock,
  }), [owner, seller, handleEditProduct, openCamera, openPriceLogs, handleStoreStock]);

  return (
    <>
      <Box component="input" {...cameraInputProps} sx={{ display: "none" }} />
      <CustomSpinner isLoading={loading} />
      <ProductModal isOpen={productModal.isOpen} product={productModal.data} onClose={productModal.close} onUpdate={handleProductSaved} />
      <PriceLogsModal isOpen={priceLogsModal.isOpen} product={priceLogsModal.data} onClose={priceLogsModal.close} />
      <PriceUpdateModal isOpen={priceUpdateModal.isOpen} onClose={priceUpdateModal.close} selectedProducts={selectedRows} onSuccess={fetchProducts} />

      <Grid container>
        <Grid item xs={12} className="card">
          <PageHeader title="Productos">
            <CustomButton fullWidth onClick={() => openProductModal({ product: null, showStoreProducts: false })} startIcon={<AddIcon />}>
              Nuevo producto
            </CustomButton>
          </PageHeader>

          <ProductListToolbar
            params={params}
            setParams={setParams}
            onSearch={fetchProducts}
            showViewToggle={!isMobile}
            viewMode={viewModePref}
            onViewModeChange={setViewModePref}
            onDownload={() => downloadProducts(products)}
            canDownload={products.length > 0}
            selectedCount={selectedRows.length}
            onDelete={handleDeleteProducts}
            onFormatCodes={handleUpperCodeProducts}
            onUpdatePrices={() => priceUpdateModal.open()}
          />

          {viewMode === "gallery" ? (
            <CardGallery
              items={products}
              loading={loading}
              emptyText="Sin productos"
              renderItem={(product) => (
                <ProductGridCard
                  product={product}
                  onEdit={handleEditProduct}
                  onPriceLogs={openPriceLogs}
                  onStoreStock={handleStoreStock}
                  onCameraPhoto={openCamera}
                />
              )}
            />
          ) : (
            <DataTable
              setSelectedRows={setSelectedRows}
              progressPending={loading}
              noDataComponent="Sin productos"
              data={products}
              columns={columns}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ProductList;
