import React from "react";
import { Select, MenuItem } from "@mui/material";

/**
 * Selector de modo de visualización para la lista de productos: Tabla o Galería.
 */
const ProductViewToggle = ({ value, onChange }) => {
  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      aria-label="Modo de visualización"
    >
      <MenuItem value="table">Tabla</MenuItem>
      <MenuItem value="gallery">Galería</MenuItem>
    </Select>
  );
};

export default ProductViewToggle;
