import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

const SimpleTable = ({ data, columns, noDataComponent, pagination = false }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayData = pagination
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx} sx={{ fontWeight: "bold" }}>
                  {col.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  {noDataComponent || "No hay datos"}
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx}>
                      {col.selector ? col.selector(row) : row[col.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && data.length > 0 && (
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
        />
      )}
    </>
  );
};

export default SimpleTable;
