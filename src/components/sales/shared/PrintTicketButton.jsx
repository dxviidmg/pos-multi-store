import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { handlePrintTicket } from "../../../utils/print";

/**
 * Reimprime el ticket de una venta o apartado.
 */
const PrintTicketButton = ({ sale }) => (
  <CustomTooltip text="Imprimir ticket">
    <CustomButton onClick={() => handlePrintTicket("ticket", sale)}>
      <PrintIcon />
    </CustomButton>
  </CustomTooltip>
);

export default PrintTicketButton;
