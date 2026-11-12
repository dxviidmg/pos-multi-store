import React, { memo } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { STORE_TYPES } from "../../../constants";
import { useThemeTokens } from "../../../theme";

const STORE_TYPE_TABS = [
  { value: STORE_TYPES.STORE, label: "Tiendas" },
  { value: STORE_TYPES.WAREHOUSE, label: "Almacenes" },
];

/** Control segmentado Tiendas / Almacenes : la opción activa lleva el mismo tinte navy que los filtros. */
const StoreTypeTabs = ({ value, onChange }) => {
  const tokens = useThemeTokens();
  return (
    <Box>
      <Tabs
        value={value}
        onChange={(event, storeType) => onChange(storeType)}
        variant="fullWidth"
        aria-label="Tipo de sucursal"
        sx={{
          minHeight: 0, p: 0.5, borderRadius: "var(--radius-base)", bgcolor: tokens.pillBg,
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTab-root": { minHeight: 32, py: 0.5, fontWeight: 500, borderRadius: "var(--radius-base)", color: "text.secondary" },
          "& .MuiTab-root.Mui-selected": { fontWeight: 600, color: "primary.main", bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) },
        }}
      >
        {STORE_TYPE_TABS.map((tab) => (
          <Tab key={tab.value} disableRipple {...tab} />
        ))}
      </Tabs>
    </Box>
  );
};

export default memo(StoreTypeTabs);
