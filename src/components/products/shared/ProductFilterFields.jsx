import React from "react";
import { Grid, TextField } from "@mui/material";
import CatalogAutocomplete from "./CatalogAutocomplete";

const NO_DEPARTMENT_OPTION = { id: "0", name: "Sin departamento", product_count: 0 };

/**
 * Filtros secundarios de listas de productos: Marca, Departamento y Stock máximo (como `Grid item`s).
 * Con `withNoDepartment` agrega la opción "Sin departamento" y oculta el filtro si no hay departamentos.
 */
const ProductFilterFields = ({ params, setParams, brands, departments, loaded, withNoDepartment = false }) => {
  const setParam = (name) => (value) => setParams((prev) => ({ ...prev, [name]: value }));

  return (
    <>
      <Grid item xs={12} md={3}>
        <CatalogAutocomplete
          label="Marca"
          options={brands}
          value={params.brand_id}
          onChange={setParam("brand_id")}
          loaded={loaded}
        />
      </Grid>
      {(!withNoDepartment || departments.length > 0) && (
        <Grid item xs={12} md={3}>
          <CatalogAutocomplete
            label="Departamento"
            options={departments}
            value={params.department_id}
            onChange={setParam("department_id")}
            loaded={loaded}
            leadingOption={withNoDepartment ? NO_DEPARTMENT_OPTION : undefined}
          />
        </Grid>
      )}
      <Grid item xs={12} md={3}>
        <TextField
          size="small"
          fullWidth
          label="Stock máximo"
          type="number"
          value={params.max_stock || ""}
          onChange={(e) => setParam("max_stock")(e.target.value)}
          name="max_stock"
        />
      </Grid>
    </>
  );
};

export default ProductFilterFields;
