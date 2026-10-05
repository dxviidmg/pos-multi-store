import React, { memo } from "react";
import { Grid } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CustomButton from "../../ui/Button/Button";
import { STORE_TYPES } from "../../../constants";

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
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {filters
        .filter(({ isVisible }) => !isVisible || isVisible(counts))
        .map(({ value: filter, label, Icon }) => (
          <Grid item md={isStore ? 2 : 3} xs={6} key={filter}>
            <CustomButton
              fullWidth
              variant={value === filter ? "contained" : "outlined"}
              onClick={() => onChange(filter)}
              startIcon={Icon && <Icon />}
            >
              {label(counts)}
            </CustomButton>
          </Grid>
        ))}
    </Grid>
  );
};

export default memo(StoreQuickFilters);
