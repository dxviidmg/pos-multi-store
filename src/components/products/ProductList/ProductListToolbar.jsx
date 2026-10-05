import React from "react";
import { Grid } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import ViewModeToggle from "../../ui/ViewModeToggle/ViewModeToggle";
import CodeNameSearchBar, { hasProductFilters } from "../shared/CodeNameSearchBar";
import ProductFilterFields from "../shared/ProductFilterFields";
import { useCatalogOptions } from "../shared/useCatalogOptions";
import { useCodeNameSearch } from "../../../hooks/useCodeNameSearch";
import { useUser } from "../../../context/UserContext";
import { isOwner } from "../../../constants/routeAccess";
import { PRODUCT_VIEW_OPTIONS } from "../../../constants";

/**
 * Búsqueda, filtros y acciones masivas de /productos/.
 */
const ProductListToolbar = ({
  params,
  setParams,
  onSearch,
  showViewToggle,
  viewMode,
  onViewModeChange,
  onDownload,
  canDownload,
  selectedCount,
  onDelete,
  onFormatCodes,
  onUpdatePrices,
}) => {
  const { user } = useUser();
  const owner = isOwner(user);
  const { brands, departments, loaded } = useCatalogOptions();
  const { searchField, handleSearchFieldChange, handleSearchChange } = useCodeNameSearch(setParams);

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <CodeNameSearchBar
        searchField={searchField}
        onSearchFieldChange={handleSearchFieldChange}
        value={params[searchField]}
        onChange={handleSearchChange}
        onSearch={onSearch}
        disabled={!hasProductFilters(params)}
      />

      <ProductFilterFields
        params={params}
        setParams={setParams}
        brands={brands}
        departments={departments}
        loaded={loaded}
        withNoDepartment
      />
      {showViewToggle && (
        <Grid item xs={12} md={3}>
          <ViewModeToggle value={viewMode} onChange={onViewModeChange} options={PRODUCT_VIEW_OPTIONS} />
        </Grid>
      )}

      <Grid item xs={12} md={3}>
        <CustomButton fullWidth onClick={onDownload} disabled={!canDownload} startIcon={<DownloadIcon />}>
          Descargar
        </CustomButton>
      </Grid>
      <Grid item xs={12} md={3}>
        <CustomButton fullWidth onClick={onDelete} disabled={selectedCount === 0 || !owner} startIcon={<DeleteIcon />}>
          Eliminar
        </CustomButton>
      </Grid>
      {owner && (
        <Grid item xs={12} md={3}>
          <CustomTooltip text="Formatea a mayúsculas y reemplaza la comilla simple (') por guión medio (-)" fullWidth>
            <CustomButton fullWidth onClick={onFormatCodes} startIcon={<TextFormatIcon />}>
              Formatear códigos
            </CustomButton>
          </CustomTooltip>
        </Grid>
      )}
      <Grid item xs={12} md={3}>
        <CustomButton
          fullWidth
          onClick={onUpdatePrices}
          disabled={selectedCount < 2 || !owner}
          startIcon={<PriceChangeIcon />}
        >
          Actualizar precios
        </CustomButton>
      </Grid>
    </Grid>
  );
};

export default ProductListToolbar;
