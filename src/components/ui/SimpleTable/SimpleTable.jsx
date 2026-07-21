import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { colors } from "../../../theme/colors";

const SimpleTable = ({ data, columns, noDataComponent }) => {
  const getCellAlignment = (row, col) => {
    const value = col.selector ? col.selector(row) : row[col.field];
    if (typeof value === 'string' && value.includes('$')) {
      return 'right';
    }
    return 'center';
  };

  const getCellStyle = (row, col) => {
    const isRight = getCellAlignment(row, col) === 'right';
    return {
      py: 0.5, 
      px: '2px', 
      fontSize: "0.8125rem", 
      gap: '2px', 
      textAlign: getCellAlignment(row, col),
      pr: isRight ? '12px' : '2px',
      '& .MuiButtonBase-root': { transform: 'scale(0.8)', minWidth: 0, px: 1 }
    };
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: colors.primary }}>
            {columns.map((col, idx) => (
              <TableCell 
                key={idx} 
                sx={{ 
                  fontWeight: "bold", 
                  color: colors.text.white, 
                  py: 0.5, 
                  fontSize: "0.8125rem",
                  textAlign: "center"
                }}
              >
                {col.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 0.5, fontSize: "0.8125rem" }}>
                {noDataComponent || "No hay datos"}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <TableCell 
                    key={colIdx} 
                    align={getCellAlignment(row, col)}
                    sx={getCellStyle(row, col)}
                    width={col.width}
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
