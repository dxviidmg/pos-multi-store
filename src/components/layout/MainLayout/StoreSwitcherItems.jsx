import { useMemo } from "react";
import { Box, CircularProgress, Divider, ListItemButton, ListItemText } from "@mui/material";
import { storeHighlight, subItemSx, subItemTextColor, whiteAlpha } from "./MainLayout.styles";

const getBackground = (isCurrent, isPrevious) => {
  if (isCurrent) return storeHighlight(0.12);
  if (isPrevious) return storeHighlight(0.06);
  return "transparent";
};

const getFontWeight = (isCurrent, isPrevious) => {
  if (isCurrent) return 600;
  if (isPrevious) return 500;
  return 400;
};

// La sucursal anterior va primero para regresar rápido a ella.
const sortByPrevious = (options, previousStoreId) => {
  const sorted = [...options];
  const prevIndex = sorted.findIndex((s) => s.storeId === previousStoreId);
  if (previousStoreId && prevIndex >= 0) {
    const [prev] = sorted.splice(prevIndex, 1);
    sorted.unshift(prev);
  }
  return sorted;
};

/** Opciones del selector de sucursal del dueño: sucursales + "Regresar" a la vista general. */
const StoreSwitcherItems = ({ options, loading, currentStoreId, previousStoreId, onSelect, onBack }) => {
  const sorted = useMemo(() => sortByPrevious(options, previousStoreId), [options, previousStoreId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 1.5, pl: 6.5 }}>
        <CircularProgress size={18} />
      </Box>
    );
  }

  return (
    <>
      {sorted.map((option) => {
        const isCurrent = option.storeId === currentStoreId;
        const isPrevious = option.storeId === previousStoreId;
        return (
          <ListItemButton
            key={option.storeId}
            onClick={() => onSelect(option.storeId)}
            disabled={isCurrent}
            sx={{
              ...subItemSx,
              backgroundColor: getBackground(isCurrent, isPrevious),
              "&:hover": { backgroundColor: isCurrent ? storeHighlight(0.12) : whiteAlpha(0.06) },
            }}
          >
            <ListItemText
              primary={option.label}
              primaryTypographyProps={{
                fontSize: "0.75rem",
                color: isCurrent ? storeHighlight(1) : subItemTextColor,
                fontWeight: getFontWeight(isCurrent, isPrevious),
              }}
            />
          </ListItemButton>
        );
      })}
      <Divider sx={{ borderColor: whiteAlpha(0.1), my: 0.5 }} />
      <ListItemButton
        onClick={onBack}
        sx={{ ...subItemSx, "&:hover": { backgroundColor: whiteAlpha(0.06) } }}
      >
        <ListItemText
          primary="Regresar"
          primaryTypographyProps={{ fontSize: "0.75rem", color: subItemTextColor }}
        />
      </ListItemButton>
    </>
  );
};

export default StoreSwitcherItems;
