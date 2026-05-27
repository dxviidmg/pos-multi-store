import React, { useMemo, useState, useEffect } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getFormattedDateTime, exportToExcel } from "../../../utils/utils";
import PageHeader from "../../ui/PageHeader";
import { Grid, TextField } from "@mui/material";
import httpClient from "../../../api/httpClient";
import { getApiUrl } from "../../../api/utils";
import CustomButton from "../../ui/Button/Button";
import DownloadIcon from "@mui/icons-material/Download";

const fetchPriceLogs = async (months) => {
  const res = await httpClient.get(getApiUrl("product-price-logs"), { params: { months } });
  return res.data;
};

const PriceLogsList = () => {
  const [months, setMonths] = useState(1);

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ["price-logs-all", months],
    queryFn: () => fetchPriceLogs(months),
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const rows = useMemo(() => {
    const map = {};
    logs.forEach((log) => {
      const key = `${log.product}-${log.created_at.slice(0, 16)}`;
      if (!map[key]) map[key] = { id: key, date: log.created_at, user: log.user_username, product_code: log.product_code, brand_name: log.brand_name, product_name: log.product_name };
      map[key][log.field] = `${log.previous_value} → ${log.new_value}`;
    });
    return Object.values(map);
  }, [logs]);

  const fields = useMemo(() => {
    const seen = {};
    logs.forEach((l) => { seen[l.field] = l.field_display; });
    return Object.entries(seen);
  }, [logs]);

  const handleDownload = () => {
    const data = rows.map((row) => {
      const obj = { Código: row.product_code, Marca: row.brand_name, Producto: row.product_name, Fecha: getFormattedDateTime(row.date) };
      fields.forEach(([field, display]) => { obj[display] = row[field] || "-"; });
      obj["Usuario"] = row.user;
      return obj;
    });
    exportToExcel(data, "Historial cambio de precios");
  };

  return (
    <Grid item xs={12} className="card">
      <PageHeader title="Historial de cambio de precios">
        <CustomButton fullWidth onClick={handleDownload} startIcon={<DownloadIcon />} disabled={rows.length === 0}>
          Descargar
        </CustomButton>
      </PageHeader>
      <TextField
        size="small"
        label="Meses anteriores (iniciar desde cuantos meses atras)"
        type="number"
        value={months}
        onChange={(e) => setMonths(Number(e.target.value))}
        inputProps={{ min: 1, max: 12 }}
        sx={{ width: '100%', mb: 2 }}
      />
      <DataTable
        progressPending={isLoading}
        noDataComponent="Sin cambios de precio"
        searcher={true}
        data={rows}
        columns={[
          { name: "Código", selector: (row) => row.product_code, sortable: true },
          { name: "Marca", selector: (row) => row.brand_name, sortable: true },
          { name: "Producto", selector: (row) => row.product_name, sortable: true },
          { name: "Fecha", selector: (row) => getFormattedDateTime(row.date), sortable: true, minWidth: 150 },
          ...fields.map(([field, display]) => ({
            name: display,
            selector: (row) => row[field] || "-",
          })),
          { name: "Usuario", selector: (row) => row.user, sortable: true },
        ]}
      />
    </Grid>
  );
};

export default PriceLogsList;
