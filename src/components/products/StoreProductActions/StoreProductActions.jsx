import React, { memo } from "react";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import TuneIcon from "@mui/icons-material/Tune";
import HistoryIcon from "@mui/icons-material/History";
import SendIcon from "@mui/icons-material/Send";

/**
 * Acciones por fila del inventario de tienda, visibles según el rol.
 */
const StoreProductActions = ({ row, role, onAdjust, onLogs, onRequest }) => (
  <>
    {role === "owner" && (
      <CustomTooltip text="Ajustar cantidad">
        <CustomButton onClick={() => onAdjust(row)}>
          <TuneIcon />
        </CustomButton>
      </CustomTooltip>
    )}
    {role !== "seller" && (
      <CustomTooltip text="Movimientos de stock">
        <CustomButton onClick={() => onLogs(row)}>
          <HistoryIcon />
        </CustomButton>
      </CustomTooltip>
    )}
    {role !== "owner" && (
      <CustomTooltip text="Solicitar ajuste de stock">
        <CustomButton onClick={() => onRequest(row)}>
          <SendIcon />
        </CustomButton>
      </CustomTooltip>
    )}
  </>
);

export default memo(StoreProductActions);
