import React, { useEffect, useState } from "react";
import { Box, Grid, TablePagination } from "@mui/material";
import SimpleTable from "../SimpleTable/SimpleTable";
import PageHeader from "../PageHeader";
import StatusChip from "../StatusChip";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

const STATUS_COLUMN = { name: "Estado", cell: (row) => <StatusChip status={row.status} /> };

/** Deja libre el encabezado fijo de la app al desplazar la tarjeta a la vista. */
export const SCROLL_TARGET_SX = { scrollMarginTop: 90 };

/**
 * Tarjeta "Filas con error" de una importación (no se muestra sin errores).
 * Agrega la columna "Estado"; con `paginated` pagina las filas (vuelve a la primera al cambiar;
 * con `keepPage` solo retrocede si la página actual queda vacía). `actions` va en el encabezado; `description` reemplaza la descripción de la página; `endColumns` van después de "Estado".
 */
const ImportErrorRows = ({ rows, columns, tableRef, paginated = false, keepPage = false, actions, description, endColumns = [] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage((current) => (keepPage ? Math.min(current, Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1)) : 0));
  }, [rows, keepPage, rowsPerPage]);

  if (rows.length === 0) return null;

  const visibleRows = paginated ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows;

  return (
    <Grid item xs={12} className="card" ref={tableRef} sx={SCROLL_TARGET_SX}>
      <PageHeader title="Filas con error" description={description}>{actions}</PageHeader>
      <SimpleTable
        noDataComponent="Sin filas con error"
        data={visibleRows}
        columns={[...columns, STATUS_COLUMN, ...endColumns]}
      />
      {paginated && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Box>
      )}
    </Grid>
  );
};

export default ImportErrorRows;
