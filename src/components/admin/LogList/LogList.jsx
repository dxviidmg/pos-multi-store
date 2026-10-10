import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { exportToExcel } from "../../../utils/excel";
import { formatTimeFromDate, getFormattedDate } from "../../../utils/date";
import { logger } from "../../../utils/logger";
import { showRequestError } from "../../../utils/alerts";
import { getStoreProductLogs, getStoreProductLogsChoices } from "../../../api/products";
import { useBrands } from "../../../hooks/useBrands";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import CustomButton from "../../ui/Button/Button";
import StoreSelect from "../../ui/StoreSelect/StoreSelect";
import { chooseIcon } from "../../ui/Icons/Icons";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Autocomplete } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PageHeader from "../../ui/PageHeader";

const COLUMNS = [
  { name: "OK", selector: (row) => chooseIcon(row.is_consistent) },
  { name: "Código", selector: (row) => row.product.code },
  { name: "Marca", selector: (row) => row.product.brand_name },
  { name: "Nombre", selector: (row) => row.product.name },
  { name: "Descripción", selector: (row) => row.description },
  { name: "Hora", selector: (row) => formatTimeFromDate(row.created_at) },
  { name: "Stock anterior", selector: (row) => row.previous_stock },
  { name: "Diferencia", selector: (row) => row.difference },
  { name: "Stock nuevo", selector: (row) => row.updated_stock },
];

const getBrandLabel = (option) => `${option.name} (${option.product_count})`;
const isSameBrand = (option, value) => option.id === value.id;

const LogList = () => {
  const [today] = useState(getFormattedDate);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);
  const [params, setParams] = useState({ date: today });
  const { data: brands = [], isLoading: loadingBrands, isFetched: brandsLoaded } = useBrands();

  useEffect(() => {
    getStoreProductLogsChoices()
      .then((res) => setActions(res.data))
      .catch((error) => logger.error("Error al cargar los tipos de movimiento:", error));
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await getStoreProductLogs(params);
        setLogs(res.data);
      } catch (error) {
        showRequestError("cargar el historial de stock", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [params]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownload = () => {
    const data = logs.map(({ product: { code, brand_name, name }, description, previous_stock, difference, updated_stock }) => ({
      Código: code, Marca: brand_name, Nombre: name, Descripción: description,
      "Stock anterior": previous_stock, Diferencia: difference, "Stock actualizado": updated_stock,
    }));
    exportToExcel(data, "Logs " + params.date, false);
  };

  return (
    <>
      <CustomSpinner isLoading={loading || loadingBrands} />

      <Grid container>
        <Grid item xs={12} className="card">
          <PageHeader title="Historial de stock" />

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Fecha" type="date"
                value={params.date} onChange={handleDataChange} name="date"
                inputProps={{ max: today }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StoreSelect
                value={params.store_related || ""}
                onChange={handleDataChange}
                name="store_related"
                label="Sucursal"
                allLabel="Todas"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                size="small"
                options={brands}
                getOptionLabel={getBrandLabel}
                value={brands.find((b) => b.id === params.brand_id) || null}
                onChange={(_, newValue) => {
                  setParams((prev) => ({ ...prev, brand_id: newValue?.id || "" }));
                }}
                isOptionEqualToValue={isSameBrand}
                disabled={brandsLoaded && brands.length === 0}
                renderInput={(inputProps) => (
                  <TextField {...inputProps} label="Marca" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Movimientos</InputLabel>
                <Select value={params.action || ""} onChange={handleDataChange} name="action" label="Movimientos">
                  <MenuItem value="">Todos</MenuItem>
                  {actions.map((action) => (
                    <MenuItem key={action.value} value={action.value}>{action.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton fullWidth onClick={handleDownload} disabled={logs.length === 0} startIcon={<DownloadIcon />}>
                Descargar historial
              </CustomButton>
            </Grid>
          </Grid>

          <DataTable
            progressPending={loading}
            noDataComponent="Sin movimientos"
            data={logs}
            columns={COLUMNS}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LogList;
