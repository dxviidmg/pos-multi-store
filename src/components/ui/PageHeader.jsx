import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import pageMeta from "../../constants/pageMeta";

/**
 * Encabezado de página: ícono + título + descripción a la izquierda y acciones a la derecha.
 * El ícono y la descripción salen de constants/pageMeta.js según la URL;
 * `description` los reemplaza y `plain` muestra solo el título (para modales y vistas de detalle).
 * `childrenMd` (1-12 o "auto") es el ancho de las acciones en escritorio; en celular ocupan todo el ancho.
 */
const PageHeader = ({ title, description, children, childrenMd = 3, plain = false }) => {
  const { pathname } = useLocation();
  const meta = plain ? null : pageMeta[pathname];
  const Icon = meta?.icon;
  const subtitle = plain ? null : description ?? meta?.description;
  const actionsWidth = childrenMd === "auto" ? "auto" : `${(Number(childrenMd) / 12) * 100}%`;

  return (
    <Box
      sx={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        gap: { xs: 1.5, md: 2 }, mb: { xs: 2, md: 2.5 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: "1 1 260px", minWidth: 0 }}>
        {Icon && (
          <Box
            aria-hidden="true"
            sx={{
              width: { xs: 38, sm: 42 }, height: { xs: 38, sm: 42 }, flexShrink: 0,
              borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center",
              color: "primary.main",
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.16 : 0.08),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.16),
            }}
          >
            <Icon sx={{ fontSize: { xs: 20, sm: 22 } }} />
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h3" component="h2" sx={{ fontSize: { xs: "1.125rem", sm: "1.25rem" }, lineHeight: 1.3 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, display: { xs: "none", sm: "block" } }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {children && (
        <Box sx={{ width: { xs: "100%", md: actionsWidth }, flexShrink: 0, ml: { md: "auto" } }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
