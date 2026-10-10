import React, { memo } from "react";
import { Grid, MenuItem, Select, TextField } from "@mui/material";
import { alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "../../ui/Button/Button";
import { QUERY_TYPES } from "../../../constants";

const PLACEHOLDERS = {
  [QUERY_TYPES.CODE]: "Ej: SKU-001",
  [QUERY_TYPES.NAME]: "Ej: Producto...",
};

/** Hay al menos un filtro para buscar en las listas de productos. */
export const hasProductFilters = (params) =>
  Boolean(params.code || params.q || params.brand_id || params.department_id || params.max_stock);

/**
 * Fila de búsqueda por código o nombre + botón "Buscar" (como `Grid item`s).
 * Se usa con `useCodeNameSearch`; Enter en el campo también busca.
 */
const CodeNameSearchBar = ({ searchField, onSearchFieldChange, value, onChange, onSearch, disabled }) => (
  <>
    <Grid item xs={12} md={3}>
      <Select
        size="small"
        fullWidth
        value={searchField}
        onChange={onSearchFieldChange}
        sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05) }}
      >
        <MenuItem value={QUERY_TYPES.CODE}>Código</MenuItem>
        <MenuItem value={QUERY_TYPES.NAME}>Nombre</MenuItem>
      </Select>
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        size="small"
        fullWidth
        placeholder={PLACEHOLDERS[searchField]}
        type="text"
        value={value || ""}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        sx={{ bgcolor: "background.paper" }}
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <CustomButton fullWidth onClick={onSearch} startIcon={<SearchIcon />} disabled={disabled}>
        Buscar
      </CustomButton>
    </Grid>
  </>
);

export default memo(CodeNameSearchBar);
