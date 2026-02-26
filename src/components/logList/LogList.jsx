import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";

import {
  exportToExcel,
  formatTimeFromDate,
  getFormattedDate,
} from "../utils/utils";
import {
  getStoreProductLogs,
  getStoreProductLogsChoices,
} from "../apis/products";
import { CustomSpinner } from "../commons/customSpinner/CustomSpinner";
import { getBrands } from "../apis/brands";
import CustomButton from "../commons/customButton/CustomButton";
import { chooseIcon } from "../commons/icons/Icons";
import { getStores } from "../apis/stores";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const LogList = () => {
  const today = getFormattedDate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);
  const [actions, setActions] = useState([]);
  const [params, setParams] = useState({ date: today });

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const response = await getBrands();
      setBrands(response.data);
      const response2 = await getStoreProductLogsChoices();
      setActions(response2.data);
      const response3 = await getStores();
      setStores(response3.data);
      setLoading(false);
    };

    fetchBrands();
  }, []); // Solo se ejecuta una vez al montar

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const salesResponse = await getStoreProductLogs(params);
      setLogs(salesResponse.data);
      setLoading(false);
    };

    fetchSalesData();
  }, [params]);

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDownload = async () => {
    const logsForReport = logs.map(
      ({
        product: { code: Código, brand_name: Marca, name: Nombre },
        description: Descripcíon,
        previous_stock,
        difference: diferencia,
        updated_stock

      }) => ({
        Código,
        Marca,
        Nombre,
        Descripcíon,
        'Stock anterior': previous_stock,
        diferencia,
        'Stock actualizado': updated_stock
      })
    );

    const prefixName = "Logs " + params.date;
    exportToExcel(logsForReport, prefixName, false);
  };

  return (
    <>
      <CustomSpinner isLoading={loading}></CustomSpinner>
      <Grid container spacing={2}>
      <Grid item xs={12} className="custom-section">
        <h1>Logs</h1>

        <CustomButton onClick={handleDownload} disabled={logs.length === 0}>
          Descargar logs
        </CustomButton>

        <Grid container spacing={2}>



          <Grid item xs={3}>
            <TextField size="small" fullWidth label="Fecha" type="date"
              value={params.date}
              onChange={handleDataChange}
              max={today}
              name="date"
            />
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tiendas o almacenes</InputLabel>
              <Select fullWidth size="small" value={params.store_related}
              onChange={handleDataChange}
              name="store_related"
              //              disabled={isLoading}
             label="Tiendas o almacenes">
              <MenuItem value="">Selecciona un movimiento</MenuItem>
              {stores.map((store) => (
                <MenuItem key={store.id} value={store.id}>
                  {store.full_name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Marca</InputLabel>
              <Select fullWidth size="small" value={params.brand_id}
              onChange={handleDataChange}
              name="brand_id"
              //              disabled={isLoading}
             label="Marca">
              <MenuItem value="">Todas las marcas</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Movimientos</InputLabel>
              <Select fullWidth size="small" value={params.action}
              onChange={handleDataChange}
              name="action"
              //              disabled={isLoading}
             label="Movimientos">
              <MenuItem value="">Selecciona un movimiento</MenuItem>
              {actions.map((action) => (
                <MenuItem key={action.value} value={action.value}>
                  {action.label}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
          </Grid>
        </Grid>

        <CustomTable
          data={logs}
          loading={loading}
          columns={[
            {
              name: "Código",
              selector: (row) => row.product.code,
              grow: 2,
            },
            {
              name: "Marca",
              selector: (row) => row.product.brand_name,
            },

            {
              name: "Nombre",
              selector: (row) => row.product.name,
              wrap: true,
              grow: 2,
            },

            {
              name: "Descripción",
              selector: (row) => row.description,
              grow: 2,
              wrap: true
            },

            {
              name: "Hora",
              selector: (row) => formatTimeFromDate(row.created_at),
            },

            {
              name: "S. anterior",
              selector: (row) => row.previous_stock,
            },
            {
              name: "Diferencia",
              selector: (row) => row.difference,
            },
            {
              name: "S. nuevo",
              selector: (row) => row.updated_stock,
            },
            {
              name: "OK",
              selector: (row) => chooseIcon(row.is_consistent),
            }
          ]}
        />
      </Grid>
    </Grid>
  </>
  );
};

export default LogList;
