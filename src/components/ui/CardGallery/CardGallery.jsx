import React, { memo } from "react";
import { Grid, Typography, Paper, Skeleton } from "@mui/material";

const GRID_ITEM = { xs: 6, sm: 4, md: 3, lg: 2 };
const SKELETON_COUNT = 12;
const MAX_STAGGERED = 12;

/**
 * Cuadrícula de tarjetas con estado de carga y vacío.
 * `renderItem` recibe cada elemento y devuelve su tarjeta.
 */
const CardGallery = ({ items = [], loading, emptyText, renderItem }) => {
  if (loading) {
    return (
      <Grid container spacing={2} sx={{ mt: 0.5 }} aria-busy="true" aria-label="Cargando">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <Grid item {...GRID_ITEM} key={i}>
            <Skeleton variant="rounded" height={260} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (items.length === 0) {
    return (
      <Paper className="fade-in-up" sx={{ p: 4, textAlign: "center", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyText}
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2} sx={{ mt: 0.5 }}>
      {items.map((item, i) => (
        <Grid
          item
          {...GRID_ITEM}
          key={item.id}
          className="fade-in-up"
          sx={{ animationDelay: `${Math.min(i, MAX_STAGGERED) * 30}ms` }}
        >
          {renderItem(item)}
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(CardGallery);
