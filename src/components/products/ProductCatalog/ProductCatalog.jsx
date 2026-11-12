import React, { useEffect, useMemo, useState } from "react";
import { Alert, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Switch } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { Select, TextField } from "../../ui/Field/Field";
import PageHeader from "../../ui/PageHeader";
import CatalogAutocomplete from "../shared/CatalogAutocomplete";
import { useCatalogOptions } from "../shared/useCatalogOptions";
import { useFilteredList } from "../shared/useFilteredList";
import { getCatalogColumns } from "./ProductCatalog.columns";
import { useCatalogPdf } from "./useCatalogPdf";
import { IMAGE_POLICY, filterCatalogProducts, getImageCoverage, getImagePolicy, getWholesaleCoverage, getZeroStockCoverage, isValidUntilDate } from "./catalogData";
import { getProducts } from "../../../api/products";
import { useUser } from "../../../context/UserContext";

const INITIAL_PARAMS = {};
const IMAGE_POLICY_MESSAGES = {
  [IMAGE_POLICY.NEVER]: { severity: "warning", text: "Muy pocos productos tienen imagen: el PDF saldrá sin imágenes." },
  [IMAGE_POLICY.ALWAYS]: { severity: "success", text: "Casi todos los productos tienen imagen: el PDF llevará imágenes." },
  [IMAGE_POLICY.OPTIONAL]: { severity: "info", text: "Tú decides si el PDF lleva imágenes." },
};
const getToday = () => new Date().toLocaleDateString("en-CA");
const FILTER_TYPES = [
  { value: "brand_id", label: "Marca" },
  { value: "department_id", label: "Departamento" },
];

const ProductCatalog = () => {
  const { user } = useUser();
  const { brands, departments, loaded } = useCatalogOptions();
  const { items: allProducts, setItems, params, setParams, loading, fetchItems } =
    useFilteredList(getProducts, INITIAL_PARAMS, "cargar los productos");
  const { generating, download } = useCatalogPdf();
  const [filterType, setFilterType] = useState("brand_id");
  const [imagesChoice, setImagesChoice] = useState(false);
  const [includeZeroStock, setIncludeZeroStock] = useState(false);
  const [excludedIds, setExcludedIds] = useState([]);
  const [withWholesale, setWithWholesale] = useState(true);
  const [catalogName, setCatalogName] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const today = getToday();

  const products = useMemo(() => filterCatalogProducts(allProducts, includeZeroStock), [allProducts, includeZeroStock]);
  const included = useMemo(() => products.filter((product) => !excludedIds.includes(product.id)), [products, excludedIds]);
  const includedIds = useMemo(() => included.map((product) => product.id), [included]);
  const stockCoverage = getZeroStockCoverage(allProducts);
  const wholesaleCoverage = getWholesaleCoverage(included);
  const coverage = getImageCoverage(included);
  const imagePolicy = getImagePolicy(coverage.percent);
  const withImages = imagePolicy === IMAGE_POLICY.OPTIONAL ? imagesChoice : imagePolicy === IMAGE_POLICY.ALWAYS;

  const value = params[filterType] || "";
  const options = filterType === "brand_id" ? brands : departments;
  const selected = options.find((option) => option.id === value);

  useEffect(() => {
    if (value) fetchItems();
    else setItems([]);
  }, [value, fetchItems, setItems]);

  const handleTypeChange = (event) => {
    setFilterType(event.target.value);
    setParams({});
    setExcludedIds([]);
  };

  const handleValueChange = (id) => {
    setParams(id ? { [filterType]: id } : {});
    setExcludedIds([]);
  };

  const handleSelectionChange = (rows) => {
    const selectedIds = new Set(rows.map((row) => row.id));
    setExcludedIds(products.filter((product) => !selectedIds.has(product.id)).map((product) => product.id));
  };

  const canDownload = Boolean(selected) && included.length > 0 && catalogName.trim() !== "" && isValidUntilDate(validUntil, today);

  const handleDownload = () => download({
    business: user.tenant_name,
    title: catalogName.trim(),
    validUntil,
    products: included,
    withImages,
    withWholesale,
  });

  return (
    <Grid container>
      <Grid item xs={12} className="card">
        <PageHeader title="Catálogo">
          <CustomButton
            fullWidth
            startIcon={<PictureAsPdfIcon />}
            onClick={handleDownload}
            disabled={!canDownload || loading || generating}
          >
            {generating ? "Generando PDF..." : "Descargar PDF"}
          </CustomButton>
        </PageHeader>

        <Grid container className="fill-row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por</InputLabel>
              <Select value={filterType} onChange={handleTypeChange} label="Filtrar por">
                {FILTER_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <CatalogAutocomplete
              key={filterType}
              label={FILTER_TYPES.find((type) => type.value === filterType).label}
              options={options}
              value={value}
              onChange={handleValueChange}
              loaded={loaded}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              fullWidth
              required
              label="Nombre del catálogo"
              value={catalogName}
              onChange={(e) => setCatalogName(e.target.value)}
              inputProps={{ maxLength: 80 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              fullWidth
              required
              type="date"
              label="Válido hasta"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
              error={Boolean(validUntil) && !isValidUntilDate(validUntil, today)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={<Switch checked={withWholesale} onChange={(e) => setWithWholesale(e.target.checked)} />}
              label="Incluir precio de mayoreo"
            />
          </Grid>
          <Grid item xs={12} md={9}>
            {included.length > 0 && (
              <Alert variant="filled" severity="info">
                {wholesaleCoverage.withWholesale} de {wholesaleCoverage.total} productos tienen precio de mayoreo ({wholesaleCoverage.percent} %).
              </Alert>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={<Switch checked={includeZeroStock} onChange={(e) => setIncludeZeroStock(e.target.checked)} />}
              label="Incluir productos sin stock"
            />
          </Grid>
          <Grid item xs={12} md={9}>
            {allProducts.length > 0 && (
              <Alert variant="filled" severity="info">
                {stockCoverage.zeroStock} de {stockCoverage.total} productos no tienen stock ({stockCoverage.percent} %).
              </Alert>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={withImages}
                  onChange={(e) => setImagesChoice(e.target.checked)}
                  disabled={imagePolicy !== IMAGE_POLICY.OPTIONAL}
                />
              }
              label="Incluir imágenes"
            />
          </Grid>
          <Grid item xs={12} md={9}>
            {included.length > 0 && (
              <Alert variant="filled" severity={IMAGE_POLICY_MESSAGES[imagePolicy].severity}>
                {coverage.withImage} de {coverage.total} productos tienen imagen ({coverage.percent} %). {IMAGE_POLICY_MESSAGES[imagePolicy].text}
              </Alert>
            )}
          </Grid>
        </Grid>

        <DataTable
          setSelectedRows={handleSelectionChange}
          selectedIds={includedIds}
          progressPending={loading}
          noDataComponent={value ? "Sin productos" : "Elige una marca o un departamento para ver sus productos"}
          data={products}
          columns={getCatalogColumns(withWholesale)}
        />
      </Grid>
    </Grid>
  );
};

export default ProductCatalog;
