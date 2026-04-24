import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { exportToExcel, formatTimeFromDate, getFormattedDate } from "../../../utils/utils";
import { getStoreProductLogs, getStoreProductLogsChoices } from "../../../api/products";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import { getBrands } from "../../../api/brands";
import { getStores } from "../../../api/stores";
import CustomButton from "../../ui/Button/Button";
import { chooseIcon } from "../../ui/Icons/Icons";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Stack } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PageHeader from "../../ui/PageHeader";

const LogList = () => {
  const today = getFormattedDate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);
  const [actions, setActions] = useState([]);
  const [params, setParams] = useState({ date: today });

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      const [brandsRes, actionsRes, storesRes] = await Promise.all([
        getBrands(), getStoreProductLogsChoices(), getStores(),
      ]);
      setBrands(brandsRes.data);
      setActions(actionsRes.data);
      setStores(storesRes.data);
      setLoading(false);
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const res = await getStoreProductLogs(params);
      setLogs(res.data);
      setLoading(false);
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
      <CustomSpinner isLoading={loading} />

      <Grid container>
        <Grid item xs={12} className="card">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <h1>Historial de stock</h1>
          </Stack>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <TextField size="small" fullWidth label="Fecha" type="date"
                value={params.date} onChange={handleDataChange} name="date"
                inputProps={{ max: today }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Tiendas o almacenes</InputLabel>
                <Select value={params.store_related || ""} onChange={handleDataChange} name="store_related" label="Tiendas o almacenes">
                  <MenuItem value="">Todas</MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>{store.full_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                Descargar logs
              </CustomButton>
            </Grid>
          </Grid>

          <DataTable
            progressPending={loading}
            noDataComponent="Sin movimientos"
            data={logs}
            columns={[
              { name: "OK", selector: (row) => chooseIcon(row.is_consistent) },
              { name: "Código", selector: (row) => row.product.code },
              { name: "Marca", selector: (row) => row.product.brand_name },
              { name: "Nombre", selector: (row) => row.product.name },
              { name: "Descripción", selector: (row) => row.description },
              { name: "Hora", selector: (row) => formatTimeFromDate(row.created_at) },
              { name: "Stock anterior", selector: (row) => row.previous_stock },
              { name: "Diferencia", selector: (row) => row.difference },
              { name: "Stock nuevo", selector: (row) => row.updated_stock },
            ]}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LogList;
