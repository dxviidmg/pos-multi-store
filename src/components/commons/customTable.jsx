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
    buttonText = '',
    buttonOnClick,
    buttonHref,
    buttonIcon = null,
    buttonDisabled = false
  }) => {
    const [filterText, setFilterText] = useState("");

    const handleFilterChange = useCallback((e) => {
      setFilterText(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
      return data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }, [data, filterText]);

    


    return (
      <>
        <div>
          <div className="">
            <div className="">
              <h1 className="h3 fw-bold text-center">{title}</h1>
            </div>
            <div className="">
              {search && (
                <Form.Control
                  type="text"
                  value={filterText}
                  onChange={handleFilterChange}
                  placeholder={inputPlaceholder}
                />
              )}
              <CustomButton type="button" size="sm" onClick={buttonOnClick} href={buttonHref} disabled={buttonDisabled}>
                {buttonIcon && buttonIcon}
                <span>{buttonText && buttonText}</span>
              </CustomButton>
            </div>
          </div>
        </div>
        <div>
          <DataTable
            noDataComponent="No hay registros para mostrar"
            columns={columns}
            data={filteredData}
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
