import React, { memo, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, TextField } from "@mui/material";
import { colors } from "../../../theme/colors";

const DataTable = ({
  columns,
  data,
  progressPending = false,
  noDataComponent = "Sin datos que mostrar",
  showNoDataComponent = true,
  searcher = false,
  pagination = true,
  setSelectedRows,
  height,
  autoHeight = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

  // 🔎 Buscador
  const searchInObject = (obj, search) => {
    if (typeof obj === "string") {
      return obj.toLowerCase().includes(search.toLowerCase());
    }

    if (typeof obj === "object" && obj !== null) {
      return Object.values(obj).some((value) =>
        searchInObject(value, search)
      );
    }

    return false;
  };

  const filteredData = useMemo(
    () => data.filter((item) => searchInObject(item, searchTerm)),
    [data, searchTerm]
  );

  // 🔄 Adaptador de columnas
  const muiColumns = useMemo(
    () =>
      columns.map((col, index) => {
        const column = {
          field: col.field || `field_${index}`,
          headerName: col.name,
          flex: col.grow || 1,
          minWidth: col.width || 120,
          sortable: col.sortable !== false,
        };

        if (col.cell) {
          column.renderCell = (params) => col.cell(params.row);
        } else if (col.selector) {
          column.renderCell = (params) => {
            const value = col.selector(params.row);
            return React.isValidElement(value) ? value : value;
          };
        }

        return column;
      }),
    [columns]
  );

  // 🆔 Asegurar IDs
  const rowsWithIds = useMemo(
    () =>
      filteredData.map((row, index) => ({
        ...row,
        _id: row.id ?? row._id ?? index,
      })),
    [filteredData]
  );

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      {searcher && (
        <Box sx={{ mb: 2 }}>
          <TextField size="small" fullWidth label="Buscar" placeholder="Buscar"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      )}

      <Box sx={{width: "100%", height: height || 'auto' }}>
        <DataGrid
          rows={rowsWithIds}
          columns={muiColumns}
          getRowId={(row) => row._id}
          loading={progressPending}
          pagination={pagination}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection={!!setSelectedRows}
          onRowSelectionModelChange={(ids) => {
            if (setSelectedRows) {
              const selected = rowsWithIds.filter((row) =>
                ids.includes(row._id)
              );
              setSelectedRows(selected);
            }
          }}
          disableRowSelectionOnClick
          autoHeight={autoHeight}
          localeText={{
            noRowsLabel: showNoDataComponent ? noDataComponent : "",
          }}
          hideFooter={data.length <= 25}
          density="compact"
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.primary,
              color: colors.text.white,
              minHeight: '36px !important',
              maxHeight: '36px !important',
            },
            "& .MuiDataGrid-cell": {
              py: 0.5,
              fontSize: '0.8125rem',
              whiteSpace: 'normal !important',
              lineHeight: '1.3 !important',
            },
            "& .MuiDataGrid-row": {
              minHeight: '32px !important',
              maxHeight: 'none !important',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default memo(DataTable);