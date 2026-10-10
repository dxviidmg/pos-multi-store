import React, { useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const SEARCH_BY_OPTIONS = [
  { value: "date", label: "Fecha" },
  { value: "sale_id", label: "Id" },
  { value: "client", label: "Cliente" },
];

/**
 * Filtros de ventas y apartados: "Búsqueda por" (fecha, folio o cliente) y sus campos.
 * Renderiza `Grid item`s; `onChange` recibe el evento con `name` = parámetro de la API.
 */
const SaleSearchFields = ({ params, onChange, maxDate }) => {
  const [searchBy, setSearchBy] = useState("date");

  return (
    <>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Búsqueda por</InputLabel>
          <Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)} label="Búsqueda por">
            {SEARCH_BY_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {searchBy === "date" && (
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="Fecha" type="date" value={params.date} onChange={onChange} name="date" inputProps={{ max: maxDate }} />
        </Grid>
      )}
      {searchBy === "sale_id" && (
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="#" type="number" value={params.sale_id} onChange={onChange} name="sale_id" />
        </Grid>
      )}
      {searchBy === "client" && (
        <>
          <Grid item xs={12} md={3}>
            <TextField size="small" fullWidth label="Nombre" type="text" value={params.first_name} onChange={onChange} name="first_name" />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField size="small" fullWidth label="Apellidos" type="text" value={params.last_name} onChange={onChange} name="last_name" />
          </Grid>
        </>
      )}
    </>
  );
};

export default SaleSearchFields;
