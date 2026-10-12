import React, { useMemo, useState } from "react";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CustomButton from "../../ui/Button/Button";
import ImportErrorRows from "../../ui/Import/ImportErrorRows";
import { showConfirm } from "../../../utils/alerts";
import { formatNumber } from "../../../utils/currency";
import { getEditableColumns, getRowActionsColumn } from "./editableColumns";

const DESCRIPTION =
  "Tu archivo tiene errores, pero puedes corregirlos desde aquí: el sistema te indica el error de cada fila en la columna Estado.";

/**
 * Tabla de errores con campos editables: guardar valida de nuevo y la fila sale si ya no tiene error;
 * quitar descarta el producto. Los valores en edición se conservan al paginar.
 * `fields` define las columnas (ver `importFields.js`).
 * `onSave(excelRow, changes)` y `onRemove(excelRows)` devuelven si la revalidación terminó bien.
 */
const EditableErrorRows = ({ rows, tableRef, fields, disabled, onSave, onRemove }) => {
  const [drafts, setDrafts] = useState({});

  const clearDrafts = (excelRows) =>
    setDrafts((prev) => {
      const next = { ...prev };
      excelRows.forEach((excelRow) => delete next[excelRow]);
      return next;
    });

  const columns = useMemo(() => {
    const handleChange = (excelRow, field, text) =>
      setDrafts((prev) => ({ ...prev, [excelRow]: { ...prev[excelRow], [field]: text } }));
    const handleSave = async (row) => {
      if (await onSave(row.excel_row, drafts[row.excel_row])) clearDrafts([row.excel_row]);
    };
    const handleRemove = async (row) => {
      if (await onRemove([row.excel_row])) clearDrafts([row.excel_row]);
    };
    return {
      fields: getEditableColumns({ fields, drafts, onChange: handleChange, disabled }),
      actions: getRowActionsColumn({ drafts, onSave: handleSave, onRemove: handleRemove, disabled }),
    };
  }, [fields, drafts, disabled, onSave, onRemove]);

  const handleRemoveAll = async () => {
    const confirmed = await showConfirm(
      "Quitar productos con error",
      `Se quitarán ${formatNumber(rows.length)} productos con error y no se importarán.`,
      { confirmText: "Quitar" }
    );
    if (!confirmed) return;
    const excelRows = rows.map((row) => row.excel_row);
    if (await onRemove(excelRows)) clearDrafts(excelRows);
  };

  return (
    <ImportErrorRows
      rows={rows}
      columns={columns.fields}
      endColumns={[columns.actions]}
      tableRef={tableRef}
      paginated
      keepPage
      description={DESCRIPTION}
      actions={<CustomButton fullWidth color="error" startIcon={<DeleteSweepIcon />} onClick={handleRemoveAll} disabled={disabled}>Quitar todas</CustomButton>}
    />
  );
};

export default EditableErrorRows;
