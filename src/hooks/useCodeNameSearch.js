import { useCallback, useState } from "react";
import { QUERY_TYPES } from "../constants";

const OTHER_FIELD = {
  [QUERY_TYPES.CODE]: QUERY_TYPES.NAME,
  [QUERY_TYPES.NAME]: QUERY_TYPES.CODE,
};

/**
 * Búsqueda por código o por nombre sobre un objeto de filtros.
 * El campo elegido (`QUERY_TYPES.CODE` → `code`, `QUERY_TYPES.NAME` → `q`) es también
 * el parámetro que se envía a la API; el otro se limpia.
 *
 * @param {Function} setParams - Setter del estado de filtros
 * @returns {{ searchField: string, handleSearchFieldChange: Function, handleSearchChange: Function }}
 */
export const useCodeNameSearch = (setParams) => {
  const [searchField, setSearchField] = useState(QUERY_TYPES.CODE);

  const handleSearchFieldChange = useCallback(
    (e) => {
      setSearchField(e.target.value);
      setParams(({ [QUERY_TYPES.CODE]: _code, [QUERY_TYPES.NAME]: _q, ...rest }) => rest);
    },
    [setParams]
  );

  const handleSearchChange = useCallback(
    (e) => {
      const { value } = e.target;
      setParams((prev) => ({ ...prev, [searchField]: value, [OTHER_FIELD[searchField]]: undefined }));
    },
    [searchField, setParams]
  );

  return { searchField, handleSearchFieldChange, handleSearchChange };
};
