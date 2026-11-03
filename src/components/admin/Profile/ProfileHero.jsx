import React from "react";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ROLES } from "../../../constants/routeAccess";
import { formatLongDate } from "../../../utils/date";

const ROLE_LABELS = {
  [ROLES.OWNER]: "Dueño",
  [ROLES.ADMIN]: "Administrador",
  [ROLES.SELLER]: "Vendedor",
};

const getInitials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join("") || "?";

/** Resumen de identidad: iniciales, nombre, usuario, rol y negocio. */
const ProfileHero = ({ userInfo, role, tenant }) => {
  const fullName = [userInfo.first_name, userInfo.last_name].filter(Boolean).join(" ") || userInfo.username || "Mi perfil";
  const since = tenant.created_at ? `Cliente desde ${formatLongDate(tenant.created_at)}` : null;

  return (
    <Box
      className="card"
      sx={{
        display: "flex", alignItems: "center", gap: { xs: 2, sm: 3 }, flexWrap: "wrap",
        animation: "fade-in-up 0.35s ease both",
      }}
    >
      <Avatar
        sx={{
          width: { xs: 56, sm: 72 }, height: { xs: 56, sm: 72 }, fontSize: { xs: "1.25rem", sm: "1.625rem" }, fontWeight: 700,
          bgcolor: "primary.main", color: "primary.contrastText",
          boxShadow: (t) => `0 0 0 4px ${alpha(t.palette.primary.main, 0.12)}`,
        }}
      >
        {getInitials(fullName)}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: "1 1 220px" }}>
        <Typography variant="h3" component="h2" noWrap>{fullName}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {[userInfo.username && `@${userInfo.username}`, tenant.name].filter(Boolean).join(" · ")}
        </Typography>
        {since && <Typography variant="caption" color="text.disabled">{since}</Typography>}
      </Box>
      <Chip label={ROLE_LABELS[role]} variant="outlined" color="primary" sx={{ fontWeight: 600 }} />
    </Box>
  );
};

export default ProfileHero;
