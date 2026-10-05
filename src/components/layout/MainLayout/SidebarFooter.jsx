import { Box, Divider, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { alpha } from "@mui/material/styles";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutColor, sidebarDividerSx } from "./MainLayout.styles";
import { colors } from "../../../theme/colors";
import { getSupportWhatsAppUrl } from "../../../api/utils";

const labelProps = { fontWeight: 600, fontSize: "0.8rem" };

const buildSupportUrl = (user) => {
  const text = `Soporte SmartVenta\nTenant: ${user.tenant_name}\nTienda: ${user.store_name || "General"}`;
  return getSupportWhatsAppUrl(text);
};

/** Pie del sidebar: soporte por WhatsApp (excepto vendedores) y cerrar sesión. */
const SidebarFooter = ({ user, expanded, showSupport, onLogout }) => {
  const buttonSx = { borderRadius: 2, justifyContent: expanded ? "initial" : "center" };
  const iconSx = { minWidth: expanded ? 38 : 0, justifyContent: "center" };
  const textSx = { opacity: expanded ? 1 : 0 };

  return (
    <Box sx={{ mt: "auto", p: 1 }}>
      {showSupport && (
        <ListItemButton
          component="a"
          href={buildSupportUrl(user)}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ ...buttonSx, "&:hover": { backgroundColor: alpha(colors.whatsapp, 0.12) } }}
        >
          <ListItemIcon sx={{ ...iconSx, color: colors.whatsapp }}>
            <WhatsAppIcon />
          </ListItemIcon>
          <ListItemText primary="Soporte" primaryTypographyProps={labelProps} sx={textSx} />
        </ListItemButton>
      )}

      <Divider sx={{ ...sidebarDividerSx, my: 1 }} />

      <ListItemButton
        onClick={onLogout}
        sx={{ ...buttonSx, "&:hover": { backgroundColor: logoutColor(0.12) } }}
      >
        <ListItemIcon sx={{ ...iconSx, color: logoutColor(0.8) }}>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText
          primary="Cerrar sesión"
          primaryTypographyProps={{ ...labelProps, color: logoutColor(0.8) }}
          sx={textSx}
        />
      </ListItemButton>
    </Box>
  );
};

export default SidebarFooter;
