import React, { memo, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, TextField } from "@mui/material";
import { colors } from "../../../theme/colors";

const DataTable = ({
  columns,
  data,
  progressPending = false,
  noDataComponent = "Sin datos que mostrar",
  searcher = false,
  setSelectedRows,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

  const searchInObject = (obj, search) => {
    if (typeof obj === "string") return obj.toLowerCase().includes(search.toLowerCase());
    if (typeof obj === "object" && obj !== null) return Object.values(obj).some((v) => searchInObject(v, search));
    return false;
  };

  const filteredData = useMemo(
    () => data.filter((item) => searchInObject(item, searchTerm)),
    [data, searchTerm]
  );

  const muiColumns = useMemo(
    () =>
      columns.map((col, index) => {
        const column = {
          field: col.field || `field_${index}`,
          headerName: col.name,
          ...(col.width ? { width: col.width } : { flex: 1 }),
          minWidth: col.minWidth || 0,
          sortable: col.sortable !== false,
        };

        if (col.cell) {
          column.renderCell = (params) => (
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {col.cell(params.row)}
            </div>
          );
        } else if (col.selector) {
          column.renderCell = (params) => {
            const value = col.selector(params.row);
            return React.isValidElement(value) ? value : value;
          };
          column.valueGetter = (params) => col.selector(params.row);
        }

        return column;
      }),
    [columns]
  );

  const rowsWithIds = useMemo(
    () => filteredData.map((row, index) => ({ ...row, _id: row.id ?? row._id ?? index })),
    [filteredData]
  );

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      {searcher && (
        <Box sx={{ mb: 2 }}>
          <TextField size="small" fullWidth label="Buscar" placeholder="Buscar"
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      )}

      <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={rowsWithIds}
          columns={muiColumns}
          getRowId={(row) => row._id}
          loading={progressPending}
          pagination={true}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection={!!setSelectedRows}
          onRowSelectionModelChange={(ids) => {
            if (setSelectedRows) {
              const selected = rowsWithIds.filter((row) => ids.includes(row._id));
              setSelectedRows(selected);
            }
          }}
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          localeText={{ noRowsLabel: noDataComponent }}
          hideFooter={data.length <= 25}
          density="compact"
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.primary,
              color: colors.text.white,
              minHeight: '36px !important',
              maxHeight: '36px !important',
            },
            "& .MuiDataGrid-columnHeaderTitle": { textAlign: 'center', width: '100%' },
            "& .MuiDataGrid-columnHeader": { justifyContent: 'center' },
            "& .MuiDataGrid-columnHeaderTitleContainer": { justifyContent: 'center' },
            "& .MuiDataGrid-cell": {
              py: 0, px: '2px', fontSize: '0.8125rem',
              whiteSpace: 'normal !important', lineHeight: '1.3 !important',
              justifyContent: 'center', textAlign: 'center', gap: '2px',
              '& .MuiButtonBase-root': { transform: 'scale(0.8)', minWidth: 0, px: 1 },
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
