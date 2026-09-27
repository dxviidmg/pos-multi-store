import React, { memo } from "react";
import { Grid, Box, Typography, CircularProgress, Paper } from "@mui/material";

const GRID_ITEM = { xs: 6, sm: 4, md: 3, lg: 2 };

/**
 * Cuadrícula de tarjetas con estado de carga y vacío.
 * `renderItem` recibe cada elemento y devuelve su tarjeta.
 */
const CardGallery = ({ items = [], loading, emptyText, renderItem }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyText}
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      {items.map((item) => (
        <Grid item {...GRID_ITEM} key={item.id}>
          {renderItem(item)}
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(CardGallery);
