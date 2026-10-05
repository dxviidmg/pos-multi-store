import React from "react";
import { Box } from "@mui/material";
import VisuallyHiddenInput from "../../ui/VisuallyHiddenInput";

/** Vista previa de la imagen del producto; al hacer clic abre el selector de archivo. */
const ProductImageField = ({ src, onChange }) => (
  <Box
    component="label"
    sx={{ display: "block", cursor: "pointer", "&:hover": { opacity: 0.8 }, transition: "opacity 0.2s" }}
  >
    <Box component="img" src={src} alt="Producto" sx={{ width: "100%", height: "auto", borderRadius: 2 }} />
    <VisuallyHiddenInput type="file" accept="image/*" onChange={onChange} />
  </Box>
);

export default ProductImageField;
