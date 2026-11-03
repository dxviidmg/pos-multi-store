import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

/** Tarjeta de una sección del perfil: ícono, título, descripción, contenido y acción al pie. */
const ProfileCard = ({ icon: Icon, title, description, action, delay = 0, children }) => (
  <Box
    className="card"
    sx={{
      display: "flex", flexDirection: "column", height: "100%", mb: 0,
      animation: "fade-in-up 0.35s ease both", animationDelay: `${delay}ms`,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
      <Box
        aria-hidden="true"
        sx={{
          width: 40, height: 40, borderRadius: "10px", flexShrink: 0,
          display: "grid", placeItems: "center",
          bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "primary.main",
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" component="h3">{title}</Typography>
        {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
      </Box>
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>{children}</Box>
    {action && <Box sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-end" }, mt: 3 }}>{action}</Box>}
  </Box>
);

export default ProfileCard;
