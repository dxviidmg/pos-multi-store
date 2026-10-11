import React, { useEffect, useRef } from "react";
import { Alert, Box, Button } from "@mui/material";
import PageHeader from "../../ui/PageHeader";
import DataTable from "../../ui/DataTable/DataTable";
import { ImportSubmitButton } from "../../ui/Import/ImportActions";
import { waitForAlertClose } from "../../../utils/alerts";
import { formatNumber } from "../../../utils/currency";
import { ZERO_STOCK_COLUMNS } from "./eleventaImport.columns";

/** Productos del reporte con inventario 0: el usuario elige cuáles se importan (todos vienen marcados). */
const ZeroStockSelector = ({ rows, selectedIds, onChange, importCount, totalCount, excludedCount, canImport, onImport }) => {
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
    <Box className="card" ref={containerRef} sx={{ mt: "1.5rem" }}>
      <PageHeader title="Productos con inventario 0" plain />
      <Alert severity="info" sx={{ mb: 2 }}>
        {formatNumber(rows.length)} productos tienen inventario 0. Deja marcados los que quieres tener en tu
        catálogo, por ejemplo los que volverás a surtir. Desmarca los que ya no vas a vender: no se importarán.
      </Alert>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center", mb: 1 }}>
        <Button size="small" onClick={() => onChange(rows.map((row) => row.id))}>Seleccionar todos</Button>
        <Button size="small" onClick={() => onChange([])}>Quitar todos</Button>
        <Box sx={{ ml: { sm: "auto" }, typography: "body2", color: "text.secondary" }}>
          Se importarán {formatNumber(importCount)} de {formatNumber(totalCount)} productos
          ({formatNumber(excludedCount)} con inventario 0 omitidos)
        </Box>
        <Box sx={{ width: { xs: "100%", sm: 180 } }}>
          <ImportSubmitButton onClick={onImport} canImport={canImport} />
        </Box>
      </Box>
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
