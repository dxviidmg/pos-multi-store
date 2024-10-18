import React, { useState, useCallback } from "react";
import Form from "react-bootstrap/Form";

const Searcher = ({
  setQuery,
  title = "",
  inputPlaceholder = "",
}) => {
  const [filterText, setFilterText] = useState("");

  const handleFilterChange = useCallback((e) => {
    const newValue = e.target.value;
    setFilterText(newValue);
    setQuery(newValue);
  }, [setQuery]);

  return (
    <div>
      <h1 className="h3">{title}</h1>
      <Form.Control
        type="text"
        value={filterText}
        onChange={handleFilterChange}
        placeholder={inputPlaceholder}
      />
    </div>
  );
};

export default Searcher;
