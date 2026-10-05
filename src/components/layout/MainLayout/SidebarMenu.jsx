import { Fragment } from "react";
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { colors } from "../../../theme/colors";
import { getMenuIcon, MENU_ACTIONS } from "./menuConfig";
import StoreSwitcherItems from "./StoreSwitcherItems";
import {
  activeSx,
  itemButtonSx,
  itemIconSx,
  secondaryTextProps,
  subItemSx,
  subItemTextColor,
  whiteAlpha,
} from "./MainLayout.styles";

const expandIconSx = { fontSize: 18 };

const SubItems = ({ items, expanded, isActive, onNavigate }) =>
  items.map((sub) => {
    const active = isActive(sub.href);
    return (
      <ListItemButton key={sub.href} onClick={() => !sub.disabled && onNavigate(sub.href)} disabled={sub.disabled}
        sx={{
          ...subItemSx,
          ...(active ? activeSx : {}),
          "&:hover": { backgroundColor: sub.disabled ? "transparent" : whiteAlpha(0.06) },
        }}
      >
        <ListItemText primary={sub.label}
          secondary={sub.disabled && expanded ? sub.disabledMessage : null}
          primaryTypographyProps={{
            fontSize: "0.75rem",
            color: sub.disabled ? whiteAlpha(0.3) : active ? colors.accent : subItemTextColor,
            fontWeight: active ? 600 : 400,
          }}
          secondaryTypographyProps={secondaryTextProps}
        />
      </ListItemButton>
    );
  });

/**
 * Ítems del sidebar. Mismo render para el drawer móvil (siempre expandido) y el
 * de escritorio (`expanded` = drawer abierto).
 */
const SidebarMenu = ({
  items,
  expanded,
  openMenus,
  isActive,
  storeName,
  storeSwitcher,
  onToggleMenu,
  onNavigate,
  onBack,
}) => items.map((item, idx) => {
  const textSx = { opacity: expanded ? 1 : 0 };

  if (item.action === MENU_ACTIONS.GO_BACK) {
    return (
      <ListItem key={idx} disablePadding sx={{ mb: 0.3 }}>
        <ListItemButton onClick={onBack} sx={itemButtonSx(expanded)}>
          <ListItemIcon sx={itemIconSx(expanded)}>{getMenuIcon(item.label)}</ListItemIcon>
          <ListItemText primary={item.label}
            primaryTypographyProps={{ fontWeight: 600, fontSize: "0.8rem", color: "inherit" }}
            sx={textSx}
          />
        </ListItemButton>
      </ListItem>
    );
  }

  if (item.dropdown) {
    const isStoreSelector = item.action === MENU_ACTIONS.STORE_SELECTOR;
    return (
      <Fragment key={idx}>
        <ListItem disablePadding sx={{ mb: 0.3 }}>
          <ListItemButton onClick={() => onToggleMenu(item, !expanded)} sx={itemButtonSx(expanded)}>
            <ListItemIcon sx={itemIconSx(expanded)}>{getMenuIcon(item.label)}</ListItemIcon>
            <ListItemText
              primary={isStoreSelector && !expanded ? storeName : item.label}
              secondary={isStoreSelector && expanded ? storeName : null}
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.8rem" }}
              secondaryTypographyProps={secondaryTextProps}
              sx={textSx}
            />
            {expanded && (openMenus[item.label] ? <ExpandLess sx={expandIconSx} /> : <ExpandMore sx={expandIconSx} />)}
          </ListItemButton>
        </ListItem>
        {expanded && (
          <Collapse in={openMenus[item.label]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {isStoreSelector ? (
                <StoreSwitcherItems options={item.dropdown} onBack={onBack} {...storeSwitcher} />
              ) : (
                <SubItems items={item.dropdown} expanded={expanded} isActive={isActive} onNavigate={onNavigate} />
              )}
            </List>
          </Collapse>
        )}
      </Fragment>
    );
  }

  const active = isActive(item.href);
  return (
    <ListItem key={idx} disablePadding sx={{ mb: 0.3 }}>
      <ListItemButton onClick={() => onNavigate(item.href)} sx={itemButtonSx(expanded, active)}>
        <ListItemIcon sx={itemIconSx(expanded, active)}>{getMenuIcon(item.label)}</ListItemIcon>
        <ListItemText primary={item.label}
          primaryTypographyProps={{
            fontWeight: 600, fontSize: "0.8rem",
            color: active ? colors.accent : "inherit",
          }}
          sx={textSx}
        />
      </ListItemButton>
    </ListItem>
  );
});

export default SidebarMenu;
