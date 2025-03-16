import React, { useState } from "react";
import DataTable from "react-data-table-component";
import "./customTable.css";
import { Form } from "react-bootstrap";


const CustomTable = ({
  columns,
  data,
  progressPending = false,
  noDataComponent = "Sin datos que mostrar",
  showNoDataComponent = true,
  searcher = false,
  pagination=true,
  setSelectedRows
}) => {

  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const searchInObject = (obj, searchTerm) => {
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(searchTerm.toLowerCase());
    }
  
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some((value) => searchInObject(value, searchTerm));
    }
  
    return false;
  };
  
  const filteredData = data.filter((item) =>
    searchInObject(item, searchTerm)
  );

  return (
    <div>
      {searcher && (
        <div>
          <Form.Label>Buscar</Form.Label>
          <Form.Control
            placeholder="Buscar"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Tabla */}
      <DataTable
        noDataComponent={showNoDataComponent && noDataComponent}
        columns={columns}
        data={filteredData}
        pagination={pagination && filteredData.length > 10}
        striped
        highlightOnHover
        progressPending={progressPending}
        dense
        paginationRowsPerPageOptions={[10, 25, 50, 100, 500]} // Opciones para cambiar filas por página
      onChangeRowsPerPage={(currentRowsPerPage) => setRowsPerPage(currentRowsPerPage)}
      paginationPerPage={rowsPerPage}
      selectableRows
      onSelectedRowsChange={handleSelectedRowsChange}
/>
    </div>
  );
};

export default CustomTable;
