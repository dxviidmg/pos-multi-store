import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { normalizePath } from "../../constants/routeAccess";
import { getAccessibleTabs, getSectionByPath } from "../layout/MainLayout/menu-sections";

// En celular ocupan todo el ancho con el texto centrado; si no caben, se desplazan
const TABS_SX = { "& .MuiTabs-flexContainer": { minWidth: "100%", width: "max-content" }, "& .MuiTab-root": { flex: "1 0 auto" } };

/**
 * Barra de pestañas de la sección a la que pertenece la ruta actual. Cada
 * pestaña es una ruta; con menos de dos accesibles no se muestra. La dibuja
 * `PageHeader` al inicio de la card de la página.
 */
const SectionTabs = () => {
  const { user } = useUser();
  const { pathname } = useLocation();
  const compact = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const section = getSectionByPath(user, pathname);
  const tabs = section ? getAccessibleTabs(user, section) : [];
  if (tabs.length < 2) return null;

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: { xs: 1.5, md: 2 } }}>
      <Tabs
        value={normalizePath(pathname)}
        variant={compact ? "scrollable" : "fullWidth"}
        allowScrollButtonsMobile
        sx={compact ? TABS_SX : undefined}
        aria-label={section.label}
      >
        {tabs.map(({ label, href }) => (
          <Tab key={href} value={href} label={label} component={Link} to={href} />
        ))}
      </Tabs>
    </Box>
  );
};

export default SectionTabs;
