import React from "react";
import DataTable from "react-data-table-component";

const CustomTable =
  ({
    columns,
    data,
    progressPending = false,
  }) => {

    return (
        <div>
          <DataTable
            noDataComponent=""
            columns={columns}
            data={data}
            pagination={data.length > 10}
            striped
            highlightOnHover
            progressPending={progressPending}
          />
        </div>
    );
  };

export default CustomTable;
