import { Box, Divider, List } from "@mui/material";
import logo from "../../../assets/images/logo.webp";
import {
  Drawer,
  DrawerHeader,
  DrawerModal,
  drawerHeaderSx,
  menuListSx,
  sidebarDividerSx,
} from "./MainLayout.styles";

const LANDING_URL = "https://smartventa-pos.vercel.app/";

const Logo = () => (
  <a href={LANDING_URL} target="_blank" rel="noopener noreferrer">
    <Box component="img" src={logo} alt="SmartVenta"
      sx={{ height: "38px", width: "auto", objectFit: "contain", borderRadius: 1, cursor: "pointer" }}
    />
  </a>
);

/**
 * Sidebar con logo, lista de menú (`children`) y pie (`footer`).
 * `mobile`: drawer modal (oculto desde md); si no, drawer permanente que se
 * colapsa a íconos cuando `open` es false.
 */
const SidebarDrawer = ({ mobile = false, open, onClose, footer, children }) => {
  const content = (
    <>
      <DrawerHeader sx={drawerHeaderSx}>
        {(mobile || open) && <Logo />}
      </DrawerHeader>

      <Divider sx={sidebarDividerSx} />

      <List sx={menuListSx(mobile ? "12px" : "10px")}>
        {children}
      </List>
      {footer}
    </>
  );

  if (mobile) {
    return (
      <DrawerModal anchor="left" open={open} onClose={onClose}>
        {content}
      </DrawerModal>
    );
  }

  return (
    <Drawer variant="permanent" open={open}>
      {content}
    </Drawer>
  );
};

export default SidebarDrawer;
