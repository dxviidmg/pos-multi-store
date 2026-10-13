import React, { memo } from "react";
import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import { STORE_TYPES } from "../../../constants";

const managersFilter = { value: "managers", label: () => "Administradores" };
const investmentFilter = { value: "investment", label: () => "Inversión" };
const syncedFilter = {
  value: "synced",
  label: ({ incompleteCount }) => `Catálogo incompleto (${incompleteCount})`,
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

/** Pestañas de vista (definen qué columnas muestra la tabla). */
const StoreQuickFilters = ({ storeType, stores, value, onChange }) => {
  const compact = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const filters = storeType === STORE_TYPES.STORE ? STORE_FILTERS : WAREHOUSE_FILTERS;

  const counts = {
    storeCount: stores.length,
    printerCount: stores.filter((s) => s.printer).length,
    incompleteCount: stores.filter((s) => !s.has_all_products).length,
  };

  return (
    <Box sx={{ mb: 1.5 }}>
      <Tabs
        value={value}
        onChange={(event, filter) => onChange(filter)}
        variant={compact ? "scrollable" : "fullWidth"}
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="Vista de la tabla"
        sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, fontWeight: 500 } }}
      >
        {filters
          .filter(({ isVisible }) => !isVisible || isVisible(counts))
          .map(({ value: filter, label }) => (
            <Tab key={filter} value={filter} label={label(counts)} />
          ))}
      </Tabs>
    </Box>
  );
};

export default memo(StoreQuickFilters);
