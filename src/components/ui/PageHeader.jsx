import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import pageMeta from "../../constants/pageMeta";
import SectionTabs from "./SectionTabs";

/**
 * Encabezado de página: título y descripción a la izquierda y acciones a la derecha.
 * La descripción sale de constants/pageMeta.js según la URL; `description` la reemplaza
 * y `plain` muestra solo el título (para modales y vistas de detalle).
 * Si la ruta pertenece a una sección del menú, dibuja sus pestañas arriba (salvo con `plain`).
 * `childrenMd` (1-12 o "auto") es el ancho de las acciones en escritorio; en celular ocupan todo el ancho.
 */
const PageHeader = ({ title, description, children, childrenMd = 3, plain = false }) => {
  const { pathname } = useLocation();
  const subtitle = plain ? null : description ?? pageMeta[pathname];
  const actionsWidth = childrenMd === "auto" ? "auto" : `${(Number(childrenMd) / 12) * 100}%`;

  return (
    <>
      {!plain && <SectionTabs />}
      <Box
        sx={{
          display: "flex", flexWrap: "wrap", alignItems: "center",
          gap: { xs: 1.5, md: 2 }, mb: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ flex: "1 1 260px", minWidth: 0 }}>
          <Typography variant="h1" component="h2" sx={{ fontSize: { xs: "1.375rem", sm: "1.75rem" }, fontWeight: 600, color: "text.primary", textAlign: "left" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, display: { xs: "none", sm: "block" } }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {children && (
          <Box sx={{ width: { xs: "100%", md: actionsWidth }, flexShrink: 0, ml: { md: "auto" } }}>
            {children}
          </Box>
        )}
      </Box>
    </>
  );
};

export default PageHeader;
