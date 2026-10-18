import React, { useEffect, useRef } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import DeselectIcon from "@mui/icons-material/Deselect";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import CustomButton from "../../ui/Button/Button";
import PageHeader from "../../ui/PageHeader";
import { SCROLL_TARGET_SX } from "../../ui/Import/ImportErrorRows";
import DataTable from "../../ui/DataTable/DataTable";
import { ImportSubmitButton } from "../../ui/Import/ImportActions";
import { waitForAlertClose } from "../../../utils/alerts";
import { formatNumber } from "../../../utils/currency";
import { ZERO_STOCK_COLUMNS } from "./editableColumns";

const Stat = ({ label, value, highlight = false }) => (
  <Grid item xs={6} md={3}>
    <Box
      sx={{
        p: 1.25, height: "100%", textAlign: "center", border: "1px solid", borderRadius: 1.5,
        borderColor: highlight ? "primary.main" : "divider",
        bgcolor: (theme) => (highlight ? alpha(theme.palette.primary.main, 0.08) : "transparent"),
      }}
    >
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
  </Grid>
);

/** Productos del reporte con inventario 0: el usuario elige cuáles se importan (todos vienen marcados). */
const ZeroStockSelector = ({ rows, selectedIds, onChange, importCount, originalCount, removedCount, excludedCount, canImport, onImport }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (rows.length === 0) return undefined;
    let cancelled = false;
    waitForAlertClose().then(() => {
      if (!cancelled) containerRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => { cancelled = true; };
  }, [rows]);

  if (rows.length === 0) return null;

  return (
    <Box className="card" ref={containerRef} sx={{ mt: "1.5rem", ...SCROLL_TARGET_SX }}>
      <PageHeader title="Productos con inventario 0" plain />
      <Typography variant="body2" color="text.secondary" sx={{ mt: -1, mb: 2 }}>
        {formatNumber(rows.length)} productos de tu archivo no tienen existencia (inventario 0). Elige cuáles quieres
        en tu catálogo: deja marcados los que volverás a surtir y desmarca los que ya no venderás. Los desmarcados no
        se importarán.
      </Typography>
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Stat label="Renglones del archivo" value={formatNumber(originalCount)} />
        <Stat label="Quitados por errores" value={formatNumber(removedCount)} />
        <Stat label="Quitados por inventario 0" value={formatNumber(excludedCount)} />
        <Stat
          label="Se importarán"
          value={`${formatNumber(importCount)} (${formatNumber(Math.round((importCount / originalCount) * 100))}%)`}
          highlight
        />
      </Grid>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={12} sm={3}>
          <CustomButton fullWidth color="success" startIcon={<SelectAllIcon />} onClick={() => onChange(rows.map((row) => row.id))}>Seleccionar todos</CustomButton>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CustomButton fullWidth color="error" startIcon={<DeselectIcon />} onClick={() => onChange([])}>Quitar todos</CustomButton>
        </Grid>
        <Grid item sm={3} sx={{ display: { xs: "none", sm: "block" } }} />
        <Grid item xs={12} sm={3}>
          <ImportSubmitButton onClick={onImport} canImport={canImport} />
        </Grid>
      </Grid>
      <DataTable
        columns={ZERO_STOCK_COLUMNS}
        data={rows}
        searcher
        selectedIds={selectedIds}
        setSelectedRows={(selected) => onChange(selected.map((row) => row.id))}
        noDataComponent="Sin productos con inventario 0"
      />
    </Box>
  );
};

export default ZeroStockSelector;
