import React, { useState } from "react";
import DataTable from "react-data-table-component";
import "./customTable.css";
import { Form } from "react-bootstrap";
import CustomSpinner from "../customSpinner/CustomSpinner";


const CustomTable = ({
  columns,
  data,
  progressPending = false,
  noDataComponent = "Sin datos que mostrar",
  showNoDataComponent = true,
  searcher = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar datos según el término de búsqueda
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
        pagination={filteredData.length > 10}
        striped
        highlightOnHover
        progressPending={progressPending}
//        progressComponent={<CustomSpinner />}
        dense
      />
    </div>
  );
};

export default CustomTable;
