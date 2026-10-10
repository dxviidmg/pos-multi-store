import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import SendIcon from "@mui/icons-material/Send";
import { useUser } from "../../../context/UserContext";
import { isOwner } from "../../../constants/routeAccess";

/**
 * Aviso sobre solicitudes de ajuste de stock: el owner las revisa, el resto las envía.
 */
const StockRequestAlert = ({ onClose }) => {
  const { user } = useUser();

  return (
    <Alert
      severity="info"
      variant="filled"
      sx={{ py: 0, borderRadius: 2 }}
      icon={<NotificationImportantIcon fontSize="inherit" />}
      onClose={onClose}
    >
      {isOwner(user) ? (
        <strong>Revisa y aprueba las solicitudes de stock en{" "}
          <Box component={Link} to="/solicitudes-ajustes-stock/" sx={{ color: "primary.main", fontWeight: 600 }}>
            Solicitudes de ajuste
          </Box>.</strong>
      ) : (
        <>
          <strong>¿Ves un stock incorrecto?</strong> Usa el icono <SendIcon sx={{ fontSize: 14, verticalAlign: "middle" }} /> para solicitar un ajuste.
        </>
      )}
    </Alert>
  );
};

export default memo(StockRequestAlert);
