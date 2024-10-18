import React, { useState, useMemo, useCallback } from "react";
import DataTable from "react-data-table-component";
import Form from "react-bootstrap/Form";
//import Styles from './customTable.module.scss'

//import { customTableStyles, paginationComponentOptions } from "./options";

const Searcher = ({
    setQuery,
  title = "",
  inputPlaceholder = "",
}) => {
  const [filterText, setFilterText] = useState("");

  const handleFilterChange = useCallback((e) => {
    console.log(e)
    setFilterText(e.target.value);
    setQuery(e.target.value)
  }, []);

  return (
    <>
      <div>
        <div className="">
          <div className="">
            <h1 className="h3">{title} Buscador</h1>
          </div>
          <div className="">
              <Form.Control
                type="text"
                value={filterText}
                onChange={handleFilterChange}
                placeholder={inputPlaceholder}
              />
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Searcher;
