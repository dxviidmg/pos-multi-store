import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InboxIcon from "@mui/icons-material/Inbox";
import { getPendingMovements } from "../../../api/notifications";
import MessageGroupsMenu from "../MessageGroupsMenu/MessageGroupsMenu";

const PendingMenu = () => (
  <MessageGroupsMenu
    icon={<AssignmentIcon />}
    title="Movimientos pendientes"
    fetchFn={getPendingMovements}
    errorMessage="Error al obtener movimientos pendientes:"
    emptyIcon={InboxIcon}
    emptyText="Sin pendientes"
  />
);

export default PendingMenu;
