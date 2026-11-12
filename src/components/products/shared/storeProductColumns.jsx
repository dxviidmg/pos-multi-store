import React from "react";
import StoreProductActions from "../StoreProductActions/StoreProductActions";

/** Columnas comunes del inventario de sucursal (`row.product.*` + `row.stock`). */
export const STORE_PRODUCT_BASE_COLUMNS = [
  { name: "Código", selector: (row) => row.product.code },
  { name: "Marca", selector: (row) => row.product.brand_name },
  { name: "Departamento", selector: (row) => row.product.department_name },
  { name: "Nombre", selector: (row) => row.product.name },
  { name: "Stock", selector: (row) => row.stock },
];

/** Columna "Acciones" con `StoreProductActions` (ver `useStoreProductActions`). */
export const getStoreProductActionsColumn = ({ onAdjust, onLogs, onRequest }) => ({
  name: "Acciones",
  cell: (row) => (
    <StoreProductActions row={row} onAdjust={onAdjust} onLogs={onLogs} onRequest={onRequest} />
  ),
});
