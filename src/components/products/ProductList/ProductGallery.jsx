import React from "react";
import { Grid, Box, Typography, CircularProgress, Paper } from "@mui/material";
import ProductGridCard from "./ProductGridCard";

/**
 * Vista de galería (cuadrícula de tarjetas) para la lista de productos.
 */
const ProductGallery = ({ products = [], loading, onEdit, onPriceLogs, onStoreStock, onCameraPhoto, role }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Sin productos
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      {products.map((product) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
          <ProductGridCard
            product={product}
            onEdit={onEdit}
            onPriceLogs={onPriceLogs}
            onStoreStock={onStoreStock}
            onCameraPhoto={onCameraPhoto}
            role={role}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGallery;
