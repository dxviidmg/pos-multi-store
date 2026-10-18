import React, { memo } from "react";
import { Box, ButtonBase, useMediaQuery } from "@mui/material";
import { STORE_TYPES } from "../../../constants";
import { useThemeTokens } from "../../../theme";

const managersFilter = { value: "managers", label: "Administradores" };
const investmentFilter = { value: "investment", label: "Inversión" };
const syncedFilter = {
  value: "synced",
  label: "Catálogo incompleto",
  count: ({ incompleteCount }) => incompleteCount,
  isVisible: ({ incompleteCount }) => incompleteCount > 0,
};
const actionsFilter = { value: "actions", label: "Acciones" };

const STORE_FILTERS = [
  { value: "all", label: "Pagos", count: ({ storeCount }) => storeCount },
  { value: "sales", label: "Ventas", count: ({ storeCount }) => storeCount },
  managersFilter,
  investmentFilter,
  { value: "printer", label: "Impresoras", count: ({ printerCount }) => printerCount },
  syncedFilter,
  actionsFilter,
];

const WAREHOUSE_FILTERS = [
  { value: "all", label: "Todos" },
  managersFilter,
  investmentFilter,
  syncedFilter,
  actionsFilter,
];

/** Pastillas de vista (definen qué columnas muestra la tabla): activa en navy, con contador. */
const StoreQuickFilters = ({ storeType, stores, value, onChange }) => {
  const tokens = useThemeTokens();
  const compact = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const filters = storeType === STORE_TYPES.STORE ? STORE_FILTERS : WAREHOUSE_FILTERS;

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
        display: "flex", gap: 0.5, p: 1, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider",
        overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {filters
        .filter(({ isVisible }) => !isVisible || isVisible(counts))
        .map(({ value: filter, label, count }) => {
          const selected = value === filter;
          return (
            <ButtonBase
              key={filter}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(filter)}
              sx={{
                flex: compact ? "0 0 auto" : 1, gap: 0.75, px: 1.75, py: 0.9, borderRadius: "10px", whiteSpace: "nowrap",
                fontSize: "0.8125rem", fontWeight: selected ? 600 : 500,
                color: selected ? "common.white" : "text.secondary",
                bgcolor: selected ? "tableHead.main" : "transparent",
                transition: "background-color 0.15s ease, color 0.15s ease",
                "&:hover": { bgcolor: selected ? "tableHead.main" : "action.hover" },
                "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 },
              }}
            >
              {label}
              {count && (
                <Box
                  component="span"
                  sx={{
                    px: 0.9, borderRadius: 999, fontSize: "0.6875rem", fontWeight: 600, lineHeight: 1.6,
                    bgcolor: selected ? tokens.pillActiveBg : tokens.pillBg,
                    color: selected ? "common.white" : "text.secondary",
                  }}
                >
                  {count(counts)}
                </Box>
              )}
            </ButtonBase>
          );
        })}
    </Box>
  );
};

export default memo(StoreQuickFilters);
