import React, { memo } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { STORE_TYPES } from "../../../constants";

const STORE_TYPE_TABS = [
  { value: STORE_TYPES.STORE, label: "Tiendas" },
  { value: STORE_TYPES.WAREHOUSE, label: "Almacenes" },
];

/** Pestañas Tiendas / Almacenes: todo el ancho, subrayado en la activa. */
const StoreTypeTabs = ({ value, onChange }) => (
  <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
    <Tabs
      value={value}
      onChange={(event, storeType) => onChange(storeType)}
      variant="fullWidth"
      aria-label="Tipo de sucursal"
      sx={{ "& .MuiTab-root": { fontWeight: 500 }, "& .MuiTab-root.Mui-selected": { fontWeight: 600 } }}
    >
      {STORE_TYPE_TABS.map((tab) => (
        <Tab key={tab.value} {...tab} />
      ))}
    </Tabs>
  </Box>
);

export default memo(StoreTypeTabs);
