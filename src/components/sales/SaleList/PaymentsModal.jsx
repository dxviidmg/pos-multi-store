import React from "react";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { PAYMENT_METHOD_OPTIONS } from "../../../constants";
import { formatCurrency } from "../../../utils/currency";
import { getFormattedDateTime } from "../../../utils/date";

const METHOD_LABELS = Object.fromEntries(PAYMENT_METHOD_OPTIONS.map(({ value, label }) => [value, label]));

const COLUMNS = [
  { name: "Fecha y hora", selector: (row) => (row.created_at ? getFormattedDateTime(row.created_at) : "-") },
  { name: "Método", selector: (row) => METHOD_LABELS[row.payment_method] || row.payment_method },
  { name: "Monto", selector: (row) => formatCurrency(row.amount) },
  { name: "Referencia", selector: (row) => row.reference || "-" },
];

/** Detalle de los pagos de una venta. */
const PaymentsModal = ({ isOpen, sale, onClose }) => (
  <CustomModal showOut={isOpen} onClose={onClose} title={sale ? `Pagos de la venta #${sale.id}` : "Pagos"} maxWidth={640}>
    <ModalBody>
      <SimpleTable data={sale?.payments || []} columns={COLUMNS} noDataComponent="Sin detalle de pagos" />
    </ModalBody>
  </CustomModal>
);

export default PaymentsModal;
