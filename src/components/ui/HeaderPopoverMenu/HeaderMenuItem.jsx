import { ListItem, ListItemText } from "@mui/material";

const PRIMARY_PROPS = { fontSize: "0.8125rem", fontWeight: 700 };
const SECONDARY_PROPS = { fontSize: "0.75rem" };

/**
 * Fila estándar de un menú del header (dentro de `HeaderPopoverMenu`): título en
 * negrita y borde inferior. Acepta `secondary` (texto gris) o `children` (p. ej.
 * líneas de mensajes, que apilan la fila en columna).
 */
const HeaderMenuItem = ({ primary, secondary, children }) => (
  <ListItem
    sx={{
      py: 1,
      borderBottom: "1px solid",
      borderColor: "divider",
      ...(children && { flexDirection: "column", alignItems: "flex-start" }),
    }}
  >
    <ListItemText
      primary={primary}
      secondary={secondary}
      primaryTypographyProps={PRIMARY_PROPS}
      secondaryTypographyProps={SECONDARY_PROPS}
    />
    {children}
  </ListItem>
);

export default HeaderMenuItem;
