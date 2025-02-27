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
  pagination=true
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredData = data.filter((item) => {
    return Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
/>
    </div>
  );
};

export default CustomTable;
