import React, { useEffect, useState } from "react";
import { Box, Grid, TablePagination } from "@mui/material";
import SimpleTable from "../SimpleTable/SimpleTable";
import PageHeader from "../PageHeader";
import StatusChip from "../StatusChip";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

/**
 * Tarjeta "Filas con error" de una importación (no se muestra sin errores).
 * Agrega la columna "Estado"; con `paginated` pagina las filas (vuelve a la primera al cambiar).
 */
const ImportErrorRows = ({ rows, columns, tableRef, paginated = false }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [rows]);

  if (rows.length === 0) return null;

  const visibleRows = paginated ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows;

  return (
    <Grid item xs={12} className="card" ref={tableRef}>
      <PageHeader title="Filas con error" />
      <SimpleTable
        noDataComponent="Sin filas con error"
        data={visibleRows}
        columns={[...columns, { name: "Estado", cell: (row) => <StatusChip status={row.status} /> }]}
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
