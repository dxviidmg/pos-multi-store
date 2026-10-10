import React, { useState } from "react";
import { IconButton, Badge, Popover, Box, Typography, List } from "@mui/material";
import CustomTooltip from "../Tooltip";
import EmptyState from "../EmptyState/EmptyState";

/**
 * Menú del header: botón de ícono con badge y tooltip que abre un Popover con
 * título, acción opcional, lista con scroll y estado vacío.
 *
 * - `badgeCount`: se oculta tras abrir el menú por primera vez. Con
 *   `autoHideBadge={false}` siempre se muestra y el llamador decide cuándo es 0.
 * - `onOpen`: se llama al abrir (p. ej. recargar datos).
 * - `children`: ítems de la `List`; si es función, recibe `close`.
 * - `headerAction`: nodo a la derecha del título (p. ej. "Limpiar").
 */
const HeaderPopoverMenu = ({
  icon,
  tooltip,
  title,
  badgeCount,
  autoHideBadge = true,
  onOpen,
  headerAction,
  isEmpty,
  emptyIcon,
  emptyText,
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [seen, setSeen] = useState(false);

  const close = () => setAnchorEl(null);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    setSeen(true);
    onOpen?.();
  };

  return (
    <>
      <CustomTooltip text={tooltip} position="bottom">
        <IconButton color="inherit" onClick={handleOpen} aria-label={tooltip}>
          <Badge badgeContent={autoHideBadge && seen ? 0 : badgeCount} color="error" max={99}>
            {icon}
          </Badge>
        </IconButton>
      </CustomTooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 420, borderRadius: 3, overflow: "hidden" } } }}
      >
        <Box sx={{ px: 2.5, py: 1.5, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
          {headerAction}
        </Box>
        {isEmpty ? (
          <EmptyState icon={emptyIcon} message={emptyText} compact />
        ) : (
          <List dense sx={{ maxHeight: 340, overflow: "auto", py: 0 }}>
            {typeof children === "function" ? children(close) : children}
          </List>
        )}
      </Popover>
    </>
  );
};

export default HeaderPopoverMenu;
