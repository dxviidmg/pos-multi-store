import React, { useState } from "react";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { TextField } from "../../ui/Field/Field";
import CustomButton from "../../ui/Button/Button";
import { getSupportWhatsAppUrl } from "../../../api/utils";
import { STORE_UPDATE } from "./services";
import { whatsappButtonSx } from "./whatsappButtonSx";
import {
  branchesLabel,
  buildConsultMessage,
  buildStoreUpdateMessage,
  storesLabel,
  warehousesLabel,
  wantsMoreBranches,
} from "./serviceMessages";

const toCount = (value) => parseInt(value, 10) || 0;

const SectionLabel = ({ children }) => (
  <Typography variant="caption" color="text.secondary" fontWeight={600}>{children}</Typography>
);

/** Diálogo para pedir por WhatsApp más sucursales (con las actuales de referencia) o una consulta libre. */
const ConsultDialog = ({ service, current, onClose }) => {
  const isStoreUpdate = service.action === STORE_UPDATE;
  const [stores, setStores] = useState(current.stores);
  const [warehouses, setWarehouses] = useState(current.warehouses);
  const [text, setText] = useState("");

  const request = { stores, warehouses, currentStores: current.stores, currentWarehouses: current.warehouses };
  const canSend = isStoreUpdate ? wantsMoreBranches(request) : Boolean(text.trim());

  const handleSend = () => {
    if (!canSend) return;
    const message = isStoreUpdate ? buildStoreUpdateMessage(request) : buildConsultMessage(service.title, text);
    window.open(getSupportWhatsAppUrl(message), "_blank");
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isStoreUpdate ? "Quiero tener tiendas y almacenes" : "¿Qué deseas preguntar?"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        {isStoreUpdate ? (
          <>
            <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1, mb: 1 }}>
              <SectionLabel>ACTUALMENTE TIENES:</SectionLabel>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {storesLabel(current.stores)} y {warehousesLabel(current.warehouses)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                (Total: {branchesLabel(current.stores + current.warehouses)})
              </Typography>
            </Box>
            <SectionLabel>QUIERO TENER:</SectionLabel>
            <TextField
              fullWidth
              label="Cantidad de tiendas"
              type="number"
              inputProps={{ min: 0 }}
              value={stores}
              onChange={(e) => setStores(toCount(e.target.value))}
              size="small"
            />
            <TextField
              fullWidth
              label="Cantidad de almacenes"
              type="number"
              inputProps={{ min: 0 }}
              value={warehouses}
              onChange={(e) => setWarehouses(toCount(e.target.value))}
              size="small"
            />
            {(stores > 0 || warehouses > 0) && (
              <Box sx={{ p: 2, borderRadius: 1, mt: 1, bgcolor: (theme) => alpha(theme.palette.success.main, 0.12) }}>
                <SectionLabel>TOTAL DE SUCURSALES:</SectionLabel>
                <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                  {branchesLabel(stores + warehouses)}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <TextField
            fullWidth
            label="¿Qué deseas preguntar?"
            placeholder="Escribe tu pregunta..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={4}
            size="small"
          />
        )}
      </DialogContent>
      <DialogActions>
        <CustomButton variant="outlined" onClick={onClose}>Cancelar</CustomButton>
        <CustomButton onClick={handleSend} disabled={!canSend} startIcon={<WhatsAppIcon />} sx={whatsappButtonSx}>
          Enviar
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultDialog;
