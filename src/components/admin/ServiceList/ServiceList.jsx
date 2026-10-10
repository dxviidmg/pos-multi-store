import React, { useState } from "react";
import {
  Grid, Card, CardContent, Typography, Chip, Box, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PrintIcon from "@mui/icons-material/Print";
import WifiIcon from "@mui/icons-material/Wifi";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { formatCurrency } from "../../../utils/utils";
import { colors } from "../../../theme/colors";
import CustomButton from "../../ui/Button/Button";

const LANDING_URL = "https://smartventapos.vercel.app/";

const SERVICES = [
  {
    icon: <StorefrontIcon />,
    title: "Añadir tienda o almacén",
    price: null,
    tag: "Consultar precios",
    notes: "Agrega una nueva tienda o almacén a tu cuenta.",
    action: "store-update",
  },
  {
    icon: <PrintIcon />,
    title: "Impresora vía USB",
    price: 0,
    tag: "Gratis",
    tagColor: "success",
    notes: "Tiempo de implementación: 1 a 2 semanas.",
  },
  {
    icon: <WifiIcon />,
    title: "Impresora vía WiFi",
    price: 100,
    notes: "Tiempo de implementación: 1 a 4 semanas.",
  },
  {
    icon: <IntegrationInstructionsIcon />,
    title: "Integración con terceros",
    price: null,
    tag: "Consultar",
    notes: "El precio puede variar según los requerimientos.",
    action: "consultar",
  },
];

const ServiceList = () => {
  const [consultDialog, setConsultDialog] = useState({ open: false, service: null, storeNames: "", action: null });

  const handleOpenConsult = (service) => {
    setConsultDialog({ open: true, service, storeNames: "", action: service.action });
  };

  const handleCloseConsult = () => {
    setConsultDialog({ open: false, service: null, storeNames: "", action: null });
  };

  const handleSendStoreUpdate = () => {
    if (!consultDialog.storeNames.trim()) {
      return;
    }

    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "+34";
    const message = `Hola, necesito ${consultDialog.storeNames} nueva(s) sucursal(es).`;
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    handleCloseConsult();
  };

  const handleSendConsult = () => {
    if (!consultDialog.storeNames.trim()) {
      return;
    }

    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "+34";
    const message = `Hola, me gustaría solicitar cambios en ${consultDialog.service.title}: ${consultDialog.storeNames}`;
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    handleCloseConsult();
  };

  const handlePricingClick = () => {
    window.location.href = LANDING_URL;
  };

  return (
    <Grid className="card">
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Servicios adicionales
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gracias por confiar en <b>SmartVenta</b>. Potencia tu negocio con nuestros servicios.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {SERVICES.map((service, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-4px)",
                  borderColor: "primary.main",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
                <Box sx={{ color: "primary.main", fontSize: 40 }}>{service.icon}</Box>

                <Typography variant="subtitle2" fontWeight={600} sx={{ minHeight: 40 }}>
                  {service.title}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, minHeight: 45 }}>
                  {service.price === 0 ? (
                    <Chip label="Gratis" color="success" size="small" />
                  ) : service.price ? (
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {`${formatCurrency(service.price)}/mes`}
                    </Typography>
                  ) : service.tag ? (
                    <Chip
                      label={service.tag}
                      size="small"
                      onClick={() => service.action === "store-update" && handlePricingClick()}
                      sx={{ cursor: service.action === "store-update" ? "pointer" : "default" }}
                    />
                  ) : null}
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1, fontSize: 0.75 }}>
                  {service.notes}
                </Typography>

                {service.action === "store-update" && (
                  <CustomButton
                    fullWidth
                    onClick={() => handleOpenConsult(service)}
                    startIcon={<WhatsAppIcon />}
                    size="small"
                    sx={{
                      mt: "auto",
                      bgcolor: colors.whatsapp,
                      color: "white",
                      "&:hover": { bgcolor: "#075E54" },
                    }}
                  >
                    Actualizar
                  </CustomButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo de consulta */}
      <Dialog open={consultDialog.open} onClose={handleCloseConsult} maxWidth="sm" fullWidth>
        <DialogTitle>
          {consultDialog.action === "store-update" ? "Añadir sucursales" : consultDialog.service?.title}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          {consultDialog.action === "store-update" ? (
            <TextField
              fullWidth
              label="Cantidad de nuevas sucursales"
              placeholder="Ej: 2"
              type="number"
              inputProps={{ min: 1 }}
              value={consultDialog.storeNames}
              onChange={(e) => setConsultDialog({ ...consultDialog, storeNames: e.target.value })}
              size="small"
            />
          ) : (
            <TextField
              fullWidth
              label="Descripción de cambios"
              placeholder="Describe qué cambios necesitas..."
              value={consultDialog.storeNames}
              onChange={(e) => setConsultDialog({ ...consultDialog, storeNames: e.target.value })}
              multiline
              rows={3}
              size="small"
            />
          )}
        </DialogContent>
        <DialogActions>
          <CustomButton variant="outlined" onClick={handleCloseConsult}>
            Cancelar
          </CustomButton>
          <CustomButton
            onClick={consultDialog.action === "store-update" ? handleSendStoreUpdate : handleSendConsult}
            disabled={!consultDialog.storeNames.trim()}
            startIcon={<WhatsAppIcon />}
            sx={{
              bgcolor: colors.whatsapp,
              color: "white",
              "&:hover": { bgcolor: "#075E54" },
              "&:disabled": { bgcolor: "#ccc" },
            }}
          >
            Enviar
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ServiceList;
