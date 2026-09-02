import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const SimpleTable = ({ data, columns, noDataComponent }) => {
  const getCellAlignment = (row, col) => {
    const value = col.selector ? col.selector(row) : row[col.field];
    if (typeof value === 'string' && value.includes('$')) {
      return 'right';
    }
    return 'center';
  };

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell
                key={idx}
                sx={{ textAlign: "center" }}
              >
                {col.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {noDataComponent || "No hay datos"}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <TableCell
                    key={colIdx}
                    align={getCellAlignment(row, col)}
                    width={col.width}
                    sx={{
                      '& .MuiButtonBase-root': { transform: 'scale(0.85)', minWidth: 0, px: 0.5 }
                    }}
                  >
                    {col.cell ? col.cell(row, rowIdx) : col.selector ? col.selector(row, rowIdx) : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SimpleTable;
