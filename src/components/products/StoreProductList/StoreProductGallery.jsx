import React from "react";
import { Grid, Box, Typography, CircularProgress, Paper } from "@mui/material";
import StoreProductGridCard from "./StoreProductGridCard";

/**
 * Vista de galería (cuadrícula de tarjetas) para el inventario de tienda.
 */
const StoreProductGallery = ({ storeProducts = [], loading, onAdjustStock, onLogs, onRequest, role }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (storeProducts.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Sin inventario
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      {storeProducts.map((storeProduct) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={storeProduct.id}>
          <StoreProductGridCard
            storeProduct={storeProduct}
            onAdjustStock={onAdjustStock}
            onLogs={onLogs}
            onRequest={onRequest}
            role={role}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StoreProductGallery;
