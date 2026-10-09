import React, { memo } from "react";
import { Box, ButtonBase } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { STORE_TYPES } from "../../../constants";
import { colors } from "../../../theme/colors";

const managersFilter = { value: "managers", label: () => "Administradores" };
const investmentFilter = { value: "investment", label: () => "Inversión", Icon: AttachMoneyIcon };
const syncedFilter = {
  value: "synced",
  label: ({ incompleteCount }) => `Catálogo Incompleto (${incompleteCount})`,
  isVisible: ({ incompleteCount }) => incompleteCount > 0,
};
const actionsFilter = { value: "actions", label: () => "Acciones" };

const STORE_FILTERS = [
  { value: "all", label: ({ storeCount }) => `Pagos (${storeCount})` },
  { value: "sales", label: ({ storeCount }) => `Ventas (${storeCount})` },
  managersFilter,
  investmentFilter,
  { value: "printer", label: ({ printerCount }) => `Impresoras (${printerCount})` },
  syncedFilter,
  actionsFilter,
];

const WAREHOUSE_FILTERS = [
  { value: "all", label: () => "Todos" },
  managersFilter,
  investmentFilter,
  syncedFilter,
  actionsFilter,
];

/** Botones de filtro rápido (definen qué columnas muestra la tabla). */
const StoreQuickFilters = ({ storeType, stores, value, onChange }) => {
  const isStore = storeType === STORE_TYPES.STORE;
  const filters = isStore ? STORE_FILTERS : WAREHOUSE_FILTERS;
  const counts = {
    storeCount: stores.length,
    printerCount: stores.filter((s) => s.printer).length,
    incompleteCount: stores.filter((s) => !s.has_all_products).length,
  };

  return (
    <Box
      role="tablist"
      aria-label="Vista de la tabla"
      sx={{
        display: "flex", gap: 0.5, p: 0.5, mb: 2,
        bgcolor: "tableHead.main", border: "1px solid", borderColor: "divider", borderRadius: 1.5,
        overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {filters
        .filter(({ isVisible }) => !isVisible || isVisible(counts))
        .map(({ value: filter, label, Icon }) => {
          const selected = value === filter;
          return (
            <ButtonBase
              key={filter}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(filter)}
              sx={{
                flex: { xs: "0 0 auto", md: "1 1 0" }, gap: 0.75, px: 1.75, py: 0.9,
                borderRadius: 1.25, whiteSpace: "nowrap",
                fontSize: "0.8125rem", fontWeight: 600,
                color: selected ? "common.white" : "text.secondary",
                bgcolor: selected ? colors.sidebar : "transparent",
                boxShadow: selected ? (theme) => theme.shadows[1] : "none",
                transition: "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
                "&:hover": { color: selected ? "common.white" : "text.primary" },
                "&.Mui-focusVisible": { outline: "2px solid", outlineColor: colors.sidebar, outlineOffset: 1 },
              }}
            >
              {Icon && <Icon sx={{ fontSize: 18 }} />}
              {label(counts)}
            </ButtonBase>
          );
        })}
    </Box>
  );
};

export default memo(StoreQuickFilters);
