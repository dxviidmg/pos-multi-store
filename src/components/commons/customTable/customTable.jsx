import React, { memo, useState, useMemo } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Form } from "react-bootstrap";
import { Box } from "@mui/material";

const CustomTable = ({
  columns,
  data,
  progressPending = false,
  noDataComponent = "Sin datos que mostrar",
  showNoDataComponent = true,
  searcher = false,
  pagination = true,
  setSelectedRows
}) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const searchInObject = (obj, searchTerm) => {
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(searchTerm.toLowerCase());
    }
  
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some((value) => searchInObject(value, searchTerm));
    }
  
    return false;
  };
  
  const filteredData = useMemo(() => 
    data.filter((item) => searchInObject(item, searchTerm)),
    [data, searchTerm]
  );

  // Convertir columnas de react-data-table a DataGrid
  const muiColumns = useMemo(() => 
    columns.map((col, index) => {
      const column = {
        field: col.field || `field_${index}`,
        headerName: col.name,
        flex: col.grow || 1,
        minWidth: col.width || 100,
        sortable: col.sortable !== false,
      };

      // Si tiene cell, usarlo directamente
      if (col.cell) {
        column.renderCell = (params) => col.cell(params.row);
      } 
      // Si tiene selector, usarlo
      else if (col.selector) {
        column.renderCell = (params) => {
          const value = col.selector(params.row);
          // Si el selector retorna JSX, renderizarlo
          if (React.isValidElement(value)) {
            return value;
          }
          // Si es primitivo, mostrarlo como texto
          return value;
        };
      }

      return column;
    }),
    [columns]
  );

  // Agregar IDs a las filas si no existen
  const rowsWithIds = useMemo(() => 
    filteredData.map((row, index) => ({
      ...row,
      _id: row.id || row._id || index,
    })),
    [filteredData]
  );

  return (
    <Box sx={{ width: '100%', mt: 1, overflowX: 'auto' }}>
      {searcher && (
        <Box sx={{ mb: 2 }}>
          <Form.Label>Buscar</Form.Label>
          <Form.Control
            placeholder="Buscar"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      )}

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
            const selectedRows = rowsWithIds.filter((row) => ids.includes(row._id));
            setSelectedRows(selectedRows);
          }
        }}
        disableRowSelectionOnClick
        autoHeight
        getRowHeight={() => 'auto'}
        localeText={{
          noRowsLabel: showNoDataComponent ? noDataComponent : '',
        }}
        hideFooter={data.length <= 10}
        sx={{
          width: '100%',
          minWidth: '800px',
          '& .MuiDataGrid-cell': {
            py: 1.5,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#04356b',
            color: '#ffffff',
          },
          '& .MuiDataGrid-cell': {
            backgroundColor: '#CFD7E1',
            borderBottom: '1px solid gray',
          },
          '& .MuiDataGrid-row': {
            backgroundColor: '#f0f8ff',
          },
        }}
      />
    </Box>
  );
};

export default memo(CustomTable);
