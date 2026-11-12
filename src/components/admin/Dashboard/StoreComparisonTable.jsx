import React from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { formatCurrency } from "../../../utils/currency";
import { colors } from "../../../theme/colors";

const HEAD_CELL_SX = { fontWeight: 600, color: "common.white", backgroundColor: colors.sidebar };

const getMarginColor = (margin) => {
  if (margin > 20) return "success.main";
  if (margin > 10) return "warning.main";
  return "error.main";
};

/** Comparación por tienda del tablero de ventas (monto o cantidad de transacciones). */
const StoreComparisonTable = ({ stores, metricType, month, daysInPeriod }) => {
  const isAmount = metricType === "total";
  const averageLabel = month === 0 ? "Promedio por mes" : "Promedio por día";
  const periods = month === 0 ? 12 : daysInPeriod;

  return (
    <Box className="card">
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>Comparación por tienda</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.sidebar }}>
              <TableCell sx={HEAD_CELL_SX}>Tienda</TableCell>
              {isAmount ? (
                <>
                  <TableCell align="right" sx={HEAD_CELL_SX}>Ventas</TableCell>
                  <TableCell align="right" sx={HEAD_CELL_SX}>Ganancias</TableCell>
                  <TableCell align="right" sx={HEAD_CELL_SX}>Margen %</TableCell>
                  <TableCell align="right" sx={HEAD_CELL_SX}>Ticket promedio</TableCell>
                  <TableCell align="right" sx={HEAD_CELL_SX}>Transacciones</TableCell>
                </>
              ) : (
                <>
                  <TableCell align="right" sx={HEAD_CELL_SX}>Transacciones</TableCell>
                  <TableCell align="right" sx={HEAD_CELL_SX}>{averageLabel}</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{store.name}</TableCell>
                {isAmount ? (
                  <>
                    <TableCell align="right">{formatCurrency(store.ventas)}</TableCell>
                    <TableCell align="right">{formatCurrency(store.ganancias)}</TableCell>
                    <TableCell align="right" sx={{ color: getMarginColor(store.margen), fontWeight: 600 }}>
                      {store.margen}%
                    </TableCell>
                    <TableCell align="right">{formatCurrency(store.ticketPromedio)}</TableCell>
                    <TableCell align="right">{store.transacciones}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="right">{store.transacciones}</TableCell>
                    <TableCell align="right">{(store.transacciones / periods).toFixed(0)}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StoreComparisonTable;
