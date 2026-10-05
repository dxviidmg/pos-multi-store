import React, { useMemo, useState } from "react";
import { Grid, TextField } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DataTable from "../../ui/DataTable/DataTable";
import PageHeader from "../../ui/PageHeader";
import CustomButton from "../../ui/Button/Button";
import { usePriceLogTable } from "../shared/usePriceLogTable";
import { getFormattedDateTime, exportToExcel } from "../../../utils/utils";

const PriceLogsList = () => {
  const [months, setMonths] = useState(1);
  const params = useMemo(() => ({ months }), [months]);
  const { rows, fields, fieldColumns, isLoading } = usePriceLogTable(params, { sortable: true });

  const columns = useMemo(() => [
    { name: "Código", selector: (row) => row.product_code, sortable: true },
    { name: "Marca", selector: (row) => row.brand_name, sortable: true },
    { name: "Producto", selector: (row) => row.product_name, sortable: true },
    ...fieldColumns,
    { name: "Usuario", selector: (row) => row.user, sortable: true },
  ], [fieldColumns]);

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
        label="Meses anteriores (iniciar desde cuántos meses atrás)"
        type="number"
        value={months}
        onChange={(e) => setMonths(Number(e.target.value))}
        inputProps={{ min: 1, max: 12 }}
        sx={{ width: "100%", mb: 2 }}
      />
      <DataTable
        progressPending={isLoading}
        noDataComponent="Sin cambios de precio"
        searcher
        data={rows}
        columns={columns}
      />
    </Grid>
  );
};

export default PriceLogsList;
