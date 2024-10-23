import React, { useState, useCallback } from "react";
import Form from "react-bootstrap/Form";

const Searcher = ({
  setQuery,
  inputPlaceholder = "",
  label
}) => {
  const [filterText, setFilterText] = useState("");

  const handleFilterChange = useCallback((e) => {
    const newValue = e.target.value;
    setFilterText(newValue);
    setQuery(newValue);
  }, [setQuery]);

  return (
    <div>
      <Form.Label>{label}</Form.Label>
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
