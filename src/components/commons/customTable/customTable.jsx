import React from "react";
import DataTable from "react-data-table-component";
import './customTable.css'

const CustomTable =
  ({
    columns,
    data,
    progressPending = false,
    noDataComponent = 'Sin datos que mostrar'
  }) => {

    return (
        <div className="table-container">
          <DataTable
            noDataComponent={noDataComponent}
            columns={columns}
            data={data}
            pagination={data.length > 10}
            striped
            highlightOnHover
            progressPending={progressPending}
            dense
          />
        </div>
    );
  };

export default CustomTable;
