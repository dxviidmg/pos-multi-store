import { styled, alpha } from "@mui/material/styles";
import { amber, red } from "@mui/material/colors";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { colors } from "../../../theme/colors";

export const DRAWER_WIDTH = 256;

/** Blanco con opacidad, para texto y fondos sobre el sidebar marino. */
export const whiteAlpha = (opacity) => alpha(colors.white, opacity);

/** Sucursal actual y anterior en el selector de sucursal. */
export const storeHighlight = (opacity) => alpha(amber[500], opacity);

/** Botón "Cerrar sesión" del sidebar. */
export const logoutColor = (opacity) => alpha(red[500], opacity);

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: 200,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: 200,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
});

const drawerPaper = {
  background: colors.gradient.sidebar,
  color: colors.white,
  borderRight: "none",
  display: "flex",
  flexDirection: "column",
};

export const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], { duration: 200, easing: theme.transitions.easing.sharp }),
  background: colors.appbar,
  boxShadow: colors.shadow.appbar,
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
  }),
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  [theme.breakpoints.up("md")]: {
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": { ...openedMixin(theme), ...drawerPaper },
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": { ...closedMixin(theme), ...drawerPaper },
    }),
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

export const DrawerModal = styled(MuiDrawer)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
  "& .MuiDrawer-paper": {
    width: DRAWER_WIDTH,
    ...drawerPaper,
    boxSizing: "border-box",
  },
}));

export const drawerHeaderSx = {
  display: "flex", alignItems: "center", justifyContent: "center",
  minHeight: "60px !important",
  borderBottom: `1px solid ${whiteAlpha(0.06)}`,
};

export const sidebarDividerSx = { backgroundColor: whiteAlpha(0.06) };

export const menuListSx = (scrollbarWidth) => ({
  pt: 1.5, px: 1, flex: 1, overflowY: "auto", overflowX: "hidden",
  "&::-webkit-scrollbar": { width: scrollbarWidth },
  "&::-webkit-scrollbar-thumb": { backgroundColor: whiteAlpha(0.4), borderRadius: "4px" },
  "&::-webkit-scrollbar-thumb:hover": { backgroundColor: whiteAlpha(0.6) },
});

export const activeSx = {
  position: "relative",
  background: alpha(colors.accent, 0.15),
  "&:hover": { background: alpha(colors.accent, 0.2) },
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0, top: 8, bottom: 8, width: 3,
    borderRadius: 3,
    background: colors.accent,
    boxShadow: `0 0 12px ${colors.accent}`,
  },
};

export const itemButtonSx = (expanded, active = false) => ({
  borderRadius: "10px", py: 1,
  justifyContent: expanded ? "initial" : "center",
  ...(active ? activeSx : {}),
  "&:hover": { backgroundColor: whiteAlpha(0.08) },
});

export const itemIconSx = (expanded, active = false) => ({
  color: active ? colors.accent : whiteAlpha(0.7),
  minWidth: expanded ? 38 : 0, justifyContent: "center",
});

export const subItemSx = { pl: 6.5, py: 0.6, borderRadius: "8px", my: 0.2, mx: 0.5 };

export const subItemTextColor = whiteAlpha(0.75);

export const secondaryTextProps = { fontSize: "0.65rem", color: whiteAlpha(0.4) };

export const userMenuPaperSx = {
  bgcolor: "primary.main",
  color: "common.white",
  border: "none",
  "& .MuiMenuItem-root": {
    fontSize: "0.8125rem",
    "&:hover": { bgcolor: whiteAlpha(0.08) },
  },
  "& .MuiListItemIcon-root": { color: whiteAlpha(0.7) },
};
