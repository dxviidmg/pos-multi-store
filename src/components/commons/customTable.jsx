import React, { useState, useMemo, useCallback } from "react";
import DataTable from "react-data-table-component";
import Form from "react-bootstrap/Form";
import CustomButton from "./customButton/CustomButton";
//import Styles from './customTable.module.scss'


//import { customTableStyles, paginationComponentOptions } from "./options";

const CustomTable =
  ({
    columns,
    data,
    search = true,
    progressPending = false,
    title = '',
    inputPlaceholder = '',
  }) => {

    return (
      <>
        <div>
          <DataTable
            noDataComponent="No hay registros para mostrar"
            columns={columns}
            data={data}
            pagination={data.length > 10}
            striped
            highlightOnHover
            progressPending={progressPending}
          />
        </div>
      </>
    );
  };

export default CustomTable;
