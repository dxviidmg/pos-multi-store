import React, { memo } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import DateRangeFilter from "../../ui/DateRangeFilter/DateRangeFilter";
import { UI_TEXT } from "../../../constants";
import { PERIODS } from "./storeInsights";

const ITEM_PROPS = { xs: 12, sm: 6, md: 3 };

/** Periodo (con rangos rápidos) y departamento. Las fechas solo aparecen con "Otro rango". */
const StorePeriodFilters = ({ period, onPeriodChange, params, departments, onChange }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item {...ITEM_PROPS}>
      <TextField select fullWidth label="Periodo" value={period} onChange={(event) => onPeriodChange(event.target.value)}>
        {Object.entries(PERIODS).map(([key, { label }]) => (
          <MenuItem key={key} value={key}>{label}</MenuItem>
        ))}
      </TextField>
    </Grid>

    {period === "custom" && (
      <DateRangeFilter
        startDate={params.start_date}
        endDate={params.end_date}
        onChange={onChange}
        shrinkLabels
        itemProps={ITEM_PROPS}
      />
    )}

    {departments.length > 0 && (
      <Grid item {...ITEM_PROPS}>
        <FormControl fullWidth size="small">
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
);

export default memo(StorePeriodFilters);
