import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

/** Tarjeta "mejor / peor" de los tableros (tienda, día, hora…). */
const InsightCard = ({ icon: Icon, title, best, worst }) => (
  <Grid item xs={6} md={3}>
    <Box className="card card-interactive" sx={{ height: "100%", mb: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Icon sx={{ fontSize: 18, color: "primary.main" }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>{title}</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <ArrowUpwardIcon sx={{ fontSize: 14, color: "success.main" }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{best}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <ArrowDownwardIcon sx={{ fontSize: 14, color: "secondary.main" }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>{worst}</Typography>
        </Box>
      </Box>
    </Box>
  </Grid>
);

export default InsightCard;
