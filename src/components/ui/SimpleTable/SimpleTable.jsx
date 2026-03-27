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
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: colors.primary }}>
            {columns.map((col, idx) => (
              <TableCell key={idx} sx={{ fontWeight: "bold", color: colors.text.white, py: 0.5, fontSize: "0.8125rem" }}>
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
                  <TableCell key={colIdx} sx={{ py: 0.5, fontSize: "0.8125rem" }} width={col.width}>
                    {col.cell ? col.cell(row) : col.selector ? col.selector(row) : row[col.field]}
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
