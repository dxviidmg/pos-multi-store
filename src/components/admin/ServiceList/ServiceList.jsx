import React, { useState, useEffect } from "react";
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
import { useStoresCount } from "../../../hooks/useStoresCount";

const LANDING_URL = "https://smartventapos.vercel.app/";

const SERVICES = [
  {
    icon: <StorefrontIcon />,
    title: "Quiero tener x tiendas y y almacenes",
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
    notes: "Implementación de 1 a 2 semanas, según disponibilidad.",
  },
  {
    icon: <WifiIcon />,
    title: "Impresora vía WiFi",
    price: 100,
    notes: "Implementación de 2 a 4 semanas, según disponibilidad.",
  },
  {
    icon: <IntegrationInstructionsIcon />,
    title: "Integración con terceros",
    price: null,
    tag: "Precio variable",
    tagColor: "success",
    notes: "El precio y la fecha de entrega varía según disponibilidad y complejidad",
    action: "integration-consult",
  },
];

const ServiceList = () => {
  const { data: storesData } = useStoresCount();
  const [consultDialog, setConsultDialog] = useState({ open: false, service: null, stores: 0, warehouses: 0, action: null });

  useEffect(() => {
    // Cuando abra el diálogo, cargar los datos actuales
    if (consultDialog.open && consultDialog.action === "store-update" && storesData) {
      setConsultDialog((prev) => ({
        ...prev,
        currentStores: storesData.stores || 0,
        currentWarehouses: storesData.warehouses || 0,
      }));
    }
  }, [consultDialog.open, consultDialog.action, storesData]);

  const handleOpenConsult = (service) => {
    const currentStores = storesData?.stores || 0;
    const currentWarehouses = storesData?.warehouses || 0;
    setConsultDialog({ 
      open: true, 
      service, 
      stores: currentStores, 
      warehouses: currentWarehouses, 
      action: service.action,
      currentStores,
      currentWarehouses,
    });
  };

  const handleCloseConsult = () => {
    setConsultDialog({ open: false, service: null, stores: 0, warehouses: 0, action: null });
  };

  const handleSendStoreUpdate = () => {
    const currentStores = consultDialog.currentStores || 0;
    const currentWarehouses = consultDialog.currentWarehouses || 0;
    const newStores = consultDialog.stores || 0;
    const newWarehouses = consultDialog.warehouses || 0;
    
    // Validar que al menos una cantidad sea mayor
    if (newStores <= currentStores && newWarehouses <= currentWarehouses) {
      return;
    }

    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "+34";
    const totalNew = newStores + newWarehouses;
    
    let message = `Hola, actualmente tengo ${currentStores} tienda${currentStores !== 1 ? "s" : ""} y ${currentWarehouses} almacén${currentWarehouses !== 1 ? "es" : ""}. `;
    message += `Por lo que ahora quiero tener ${newStores} tienda${newStores !== 1 ? "s" : ""} y ${newWarehouses} almacén${newWarehouses !== 1 ? "es" : ""}, `;
    message += `dando un total de ${totalNew} sucursal${totalNew !== 1 ? "es" : ""}.`;
    
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    handleCloseConsult();
  };

  const handleSendConsult = () => {
    if (!consultDialog.storeNames?.trim()) {
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
                    <CustomButton
                      size="small"
                      onClick={() => service.action === "store-update" && handlePricingClick()}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.85rem",
                        height: "fit-content",
                      }}
                    >
                      {service.tag}
                    </CustomButton>
                  ) : null}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
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

                {service.action === "integration-consult" && (
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
                    Consultar
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
          {consultDialog.action === "store-update" 
            ? "Quiero tener tiendas y almacenes" 
            : consultDialog.action === "integration-consult"
            ? "¿Qué deseas preguntar?"
            : consultDialog.service?.title}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          {consultDialog.action === "store-update" ? (
            <>
              {(consultDialog.currentStores !== undefined || consultDialog.currentWarehouses !== undefined) && (
                <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1, mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    ACTUALMENTE TIENES:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {consultDialog.currentStores} tienda{consultDialog.currentStores !== 1 ? "s" : ""} y {consultDialog.currentWarehouses} almacén{consultDialog.currentWarehouses !== 1 ? "es" : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    (Total: {consultDialog.currentStores + consultDialog.currentWarehouses} sucursal{consultDialog.currentStores + consultDialog.currentWarehouses !== 1 ? "es" : ""})
                  </Typography>
                </Box>
              )}
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                QUIERO TENER:
              </Typography>
              <TextField
                fullWidth
                label="Cantidad de tiendas"
                type="number"
                inputProps={{ min: 0 }}
                value={consultDialog.stores}
                onChange={(e) => setConsultDialog({ ...consultDialog, stores: parseInt(e.target.value) || 0 })}
                size="small"
              />
              <TextField
                fullWidth
                label="Cantidad de almacenes"
                type="number"
                inputProps={{ min: 0 }}
                value={consultDialog.warehouses}
                onChange={(e) => setConsultDialog({ ...consultDialog, warehouses: parseInt(e.target.value) || 0 })}
                size="small"
              />
              {(consultDialog.stores > 0 || consultDialog.warehouses > 0) && (
                <Box sx={{ p: 2, bgcolor: "#E8F5E9", borderRadius: 1, mt: 1 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    TOTAL DE SUCURSALES:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                    {consultDialog.stores + consultDialog.warehouses} sucursal{consultDialog.stores + consultDialog.warehouses !== 1 ? "es" : ""}
                  </Typography>
                </Box>
              )}
            </>
          ) : consultDialog.action === "integration-consult" ? (
            <TextField
              fullWidth
              label="¿Qué deseas preguntar?"
              placeholder="Escribe tu pregunta..."
              value={consultDialog.storeNames || ""}
              onChange={(e) => setConsultDialog({ ...consultDialog, storeNames: e.target.value })}
              multiline
              rows={4}
              size="small"
            />
          ) : (
            <TextField
              fullWidth
              label="Descripción de cambios"
              placeholder="Describe qué cambios necesitas..."
              value={consultDialog.storeNames || ""}
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
            disabled={
              consultDialog.action === "store-update" 
                ? (
                  consultDialog.stores <= consultDialog.currentStores && 
                  consultDialog.warehouses <= consultDialog.currentWarehouses
                )
                : !consultDialog.storeNames?.trim()
            }
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
