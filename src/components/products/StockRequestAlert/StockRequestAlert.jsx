import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Alert } from "@mui/material";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import SendIcon from "@mui/icons-material/Send";

/**
 * Aviso sobre solicitudes de ajuste de stock: el owner las revisa, el resto las envía.
 */
const StockRequestAlert = ({ role, onClose }) => (
  <Alert
    severity="info"
    variant="filled"
    sx={{ py: 0, borderRadius: 2 }}
    icon={<NotificationImportantIcon fontSize="inherit" />}
    onClose={onClose}
  >
    {role === "owner" ? (
      <strong>Revisa y aprueba las solicitudes de stock en{" "}
        <Link to="/solicitudes-ajustes-stock/" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
          Solicitudes de Ajuste
        </Link>.</strong>
    ) : (
      <>
        <strong>¿Ves un stock incorrecto?</strong> Usa el icono <SendIcon sx={{ fontSize: 14, verticalAlign: "middle" }} /> para solicitar un ajuste.
      </>
    )}
  </Alert>
);

export default memo(StockRequestAlert);
