import React from "react";
import EditableErrorRows from "./EditableErrorRows";
import ZeroStockSelector from "./ZeroStockSelector";

/** Resultado de validar un archivo: errores editables y productos con inventario en 0 por decidir. */
const ImportResults = ({
  fields, loading, tableRef, errorRows, zeroStockRows, selectedIds, setSelectedIds,
  importCount, originalCount, removedCount, excludedCount, canImport,
  onSave, onRemove, onImport,
}) => (
  <>
    <EditableErrorRows rows={errorRows} tableRef={tableRef} fields={fields} disabled={loading} onSave={onSave} onRemove={onRemove} />

    <ZeroStockSelector
      rows={zeroStockRows}
      selectedIds={selectedIds}
      onChange={setSelectedIds}
      importCount={importCount}
      originalCount={originalCount}
      removedCount={removedCount}
      excludedCount={excludedCount}
      canImport={canImport}
      onImport={onImport}
    />
  </>
);

export default ImportResults;
