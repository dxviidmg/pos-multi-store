import React, { memo } from "react";
import { Box, Typography } from "@mui/material";

/** Aviso amable cuando no hay qué mostrar: ícono neutro, mensaje y una sugerencia. */
const StoreEmptyNotice = ({ icon: Icon, title, description, action }) => (
  <Box className="fade-in-up" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.75, py: { xs: 3, md: 4 }, px: 2, textAlign: "center" }}>
    <Icon sx={{ fontSize: 32, color: "text.secondary", mb: 0.5 }} />
    <Typography variant="h5" sx={{ fontWeight: 600 }}>{title}</Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>{description}</Typography>
    )}
    {action && <Box sx={{ mt: 1.5 }}>{action}</Box>}
  </Box>
);

export default memo(StoreEmptyNotice);
