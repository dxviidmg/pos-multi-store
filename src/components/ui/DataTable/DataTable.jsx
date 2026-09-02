import React, { memo, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, TextField, Typography, Paper } from "@mui/material";

const searchInObject = (obj, search) => {
  if (typeof obj === "string") return obj.toLowerCase().includes(search.toLowerCase());
  if (typeof obj === "object" && obj !== null) return Object.values(obj).some((v) => searchInObject(v, search));
  return false;
};

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
    pageSize: 10,
    page: 0,
  });

  const filteredData = useMemo(
    () => data.filter((item) => searchInObject(item, searchTerm)),
    [data, searchTerm]
  );

  const visibleColumns = useMemo(
    () => columns.filter((col) => !col.omit),
    [columns]
  );

  const muiColumns = useMemo(
    () =>
      visibleColumns.map((col, index) => {
        const getCellAlignment = (row) => {
          const value = col.selector ? col.selector(row) : row[col.field];
          if (typeof value === 'string' && value.includes('$')) {
            return 'right';
          }
          return 'center';
        };

        const isRightAligned = (row) => getCellAlignment(row) === 'right';

        const column = {
          field: col.field || `field_${index}`,
          headerName: col.name,
          ...(col.width ? { width: col.width } : { flex: 1 }),
          minWidth: col.minWidth || 0,
          sortable: col.sortable !== false,
          headerAlign: 'center',
          align: 'center',
        };

        if (col.cell) {
          column.renderCell = (params) => (
            <div
              style={{
                display: 'flex',
                gap: '2px',
                alignItems: 'center',
                justifyContent: getCellAlignment(params.row),
                width: '100%',
                paddingRight: isRightAligned(params.row) ? '12px' : '2px'
              }}
            >
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
        <Box sx={{ mb: 1.5 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Buscar..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      )}

      <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
        {data.length === 0 && !progressPending ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {noDataComponent}
            </Typography>
          </Paper>
        ) : (
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
          hideFooter={data.length <= 10}
          density="compact"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              minHeight: '36px !important',
              maxHeight: '36px !important',
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              fontSize: '0.8125rem',
            },
            "& .MuiDataGrid-columnHeader": { justifyContent: 'center' },
            "& .MuiDataGrid-columnHeaderTitleContainer": { justifyContent: 'center' },
            "& .MuiDataGrid-cell": {
              py: 0.5, px: 1, fontSize: '0.8125rem',
              whiteSpace: 'normal !important', lineHeight: '1.4 !important',
              justifyContent: 'center', textAlign: 'center',
              '& .MuiButtonBase-root': { transform: 'scale(0.85)', minWidth: 0, px: 0.5 },
            },
            "& .MuiDataGrid-row": {
              minHeight: '34px !important',
              maxHeight: 'none !important',
            },
          }}
        />
        )}
      </Box>
    </Box>
  );
};

export default memo(DataTable);
