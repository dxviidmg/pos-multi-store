import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { alpha } from "@mui/material/styles";
import CustomTooltip from "../Tooltip";

const BarcodeScanner = ({ open, onClose, onDetected }) => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Callbacks más recientes sin reiniciar la cámara cuando cambian
  const onCloseRef = useRef(onClose);
  const onDetectedRef = useRef(onDetected);
  onCloseRef.current = onClose;
  onDetectedRef.current = onDetected;

  useEffect(() => {
    if (!open) return;

    setError("");
    setLoading(true);

    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    const startScanner = async () => {
      try {
        // Preferir cámara trasera en mobile
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const backCamera = devices.find((d) =>
          /back|rear|environment/i.test(d.label)
        );
        const deviceId = backCamera?.deviceId || undefined;

        await reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            setLoading(false);
            if (result) {
              onDetectedRef.current(result.getText());
              onCloseRef.current();
            }
          }
        );
      } catch (e) {
        setLoading(false);
        if (e.name === "NotAllowedError") {
          setError("Permiso de cámara denegado. Habilítalo en la configuración del navegador.");
        } else if (e.name === "NotFoundError") {
          setError("No se encontró una cámara disponible.");
        } else {
          setError("No se pudo iniciar la cámara: " + e.message);
        }
      }
    };

    startScanner();

    return () => {
      try {
        readerRef.current?.reset();
      } catch {
        // El lector ya estaba detenido
      }
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <QrCodeScannerIcon sx={{ color: "primary.main" }} />
          <Typography fontWeight={600}>Escanear código de barras</Typography>
        </Box>
        <CustomTooltip text="Cerrar" position="bottom">
          <IconButton size="small" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </CustomTooltip>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <Box sx={{ position: "relative", bgcolor: "common.black", minHeight: 300 }}>
            {loading && (
              <Box sx={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 2, color: "white", zIndex: 1,
              }}>
                <CircularProgress color="inherit" />
                <Typography variant="body2">Iniciando cámara...</Typography>
              </Box>
            )}
            <Box
              component="video"
              ref={videoRef}
              sx={{ width: "100%", display: "block", maxHeight: "60vh", objectFit: "cover" }}
            />
            {/* Guía visual de encuadre */}
            {!loading && (
              <Box sx={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <Box sx={{
                  width: "70%", height: 100,
                  border: (theme) => `2px solid ${alpha(theme.palette.common.white, 0.8)}`,
                  borderRadius: 1,
                  boxShadow: (theme) => `0 0 0 9999px ${alpha(theme.palette.common.black, 0.4)}`,
                }} />
              </Box>
            )}
          </Box>
        )}
        <Box sx={{ p: 1.5, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Apunta la cámara al código de barras del producto
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
