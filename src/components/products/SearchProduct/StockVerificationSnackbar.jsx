import React from "react";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * Aviso de que el producto agregado al carrito requiere verificación de stock.
 */
const StockVerificationSnackbar = ({ open, productCode, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    sx={{ top: { xs: 8, sm: 16 }, px: { xs: 1, sm: 0 } }}
  >
    <Alert
      severity="success"
      variant="filled"
      icon={<CheckCircleIcon />}
      onClose={onClose}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 480 },
        minHeight: 64,
        boxShadow: 5,
        borderRadius: "10px",
        alignItems: "center",
        fontWeight: 600,
      }}
    >
      <AlertTitle sx={{ fontWeight: 700, mb: 0.25 }}>
        Verificación de stock requerida
      </AlertTitle>
      <Box component="span" sx={{ fontSize: "0.8rem" }}>
        El producto {productCode} necesita verificación de stock
      </Box>
    </Alert>
  </Snackbar>
);

export default StockVerificationSnackbar;
