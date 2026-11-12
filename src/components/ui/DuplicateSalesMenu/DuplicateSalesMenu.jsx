import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getDuplicateSales } from "../../../api/notifications";
import MessageGroupsMenu from "../MessageGroupsMenu/MessageGroupsMenu";

const DuplicateSalesMenu = () => (
  <MessageGroupsMenu
    icon={<ContentCopyIcon />}
    title="Ventas duplicadas"
    fetchFn={getDuplicateSales}
    errorMessage="Error al obtener ventas duplicadas:"
    emptyIcon={CheckCircleOutlineIcon}
    emptyText="Sin duplicadas hoy"
  />
);

export default DuplicateSalesMenu;
