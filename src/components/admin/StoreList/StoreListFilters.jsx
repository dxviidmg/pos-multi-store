import React, { memo } from "react";
import { Box, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, useMediaQuery, useTheme } from "@mui/material";
import DateRangeFilter from "../../ui/DateRangeFilter/DateRangeFilter";
import { STORE_TYPES, UI_TEXT } from "../../../constants";

const DATE_ITEM_PROPS = { xs: 12, sm: 6, md: 3 };

/** Tipo de sucursal, leyenda de promedio, fechas y departamento. */
const StoreListFilters = ({ params, departments, onChange, onStoreTypeChange }) => {
  const isWarehouse = params.store_type === STORE_TYPES.WAREHOUSE;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            {isMobile ? (
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de sucursal</InputLabel>
                <Select
                  value={params.store_type}
                  onChange={onStoreTypeChange}
                  label="Tipo de sucursal"
                >
                  <MenuItem value={STORE_TYPES.STORE}>Tiendas</MenuItem>
                  <MenuItem value={STORE_TYPES.WAREHOUSE}>Almacenes</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      onChange={onStoreTypeChange}
                      value={STORE_TYPES.STORE}
                      checked={params.store_type === STORE_TYPES.STORE}
                    />
                  }
                  label="Tiendas"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      onChange={onStoreTypeChange}
                      value={STORE_TYPES.WAREHOUSE}
                      checked={isWarehouse}
                    />
                  }
                  label="Almacenes"
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} md={8} sx={{ textAlign: "center" }}>
            {params.store_type === STORE_TYPES.STORE && (
              <Box sx={{ mt: 1, fontSize: "0.75rem", color: "text.secondary" }}>
                <span className="text-success">● Arriba del promedio</span>
                {" | "}
                <span className="status-dot--warning">● Promedio</span>
                {" | "}
                <span className="text-danger">● Debajo del promedio</span>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <Box component="form" sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <DateRangeFilter
            startDate={params.start_date}
            endDate={params.end_date}
            onChange={onChange}
            disabled={isWarehouse}
            showRange
            shrinkLabels
            itemProps={DATE_ITEM_PROPS}
          />

          {departments.length > 0 && (
            <Grid item {...DATE_ITEM_PROPS}>
              <FormControl fullWidth size="small" disabled={isWarehouse}>
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={params.department_id || ""}
                  onChange={onChange}
                  name="department_id"
                  label="Departamento"
                >
                  <MenuItem value="">{UI_TEXT.ALL}</MenuItem>
                  <MenuItem value="0">Sin departamento</MenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name} ({department.product_count})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default memo(StoreListFilters);
