import React from "react";
import {
  Grid, Card, CardContent, Typography, Chip, Box, Divider,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PrintIcon from "@mui/icons-material/Print";
import WifiIcon from "@mui/icons-material/Wifi";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import EmailIcon from "@mui/icons-material/Email";
import { formatCurrency } from "../../../utils/utils";
import CustomButton from "../../ui/Button/Button";

const SERVICES = [
  {
    icon: <StorefrontIcon />,
    title: "Tienda / Almacén",
    price: null,
    tag: "Consultar",
    tagColor: "info",
    notes: "Agrega una nueva tienda o almacén a tu cuenta.",
    action: "consultar",
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
    tagColor: "info",
    notes: "El precio puede variar según los requerimientos.",
    action: "consultar",
  },
];

const ServiceList = () => {
  const handleConsult = () => {
    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "+34"; // Fallback
    const message = "Hola, me gustaría consultar sobre los servicios adicionales de SmartVenta.";
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
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

      <Grid container spacing={3}>
        {SERVICES.map((service, i) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={i}>
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
              <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ color: "primary.main", fontSize: 40 }}>{service.icon}</Box>

                <Typography variant="subtitle1" fontWeight={600} sx={{ minHeight: 48 }}>
                  {service.title}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, minHeight: 50 }}>
                  {service.price === 0 ? (
                    <Chip label="Gratis" color="success" size="medium" />
                  ) : service.price ? (
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                      {`${formatCurrency(service.price)}/mes`}
                    </Typography>
                  ) : service.tag ? (
                    <Chip label={service.tag} color={service.tagColor} size="medium" />
                  ) : null}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {service.notes}
                </Typography>

                {service.action === "consultar" && (
                  <CustomButton
                    fullWidth
                    variant="outlined"
                    onClick={handleConsult}
                    startIcon={<EmailIcon />}
                    size="small"
                  >
                    Consultar
                  </CustomButton>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ServiceList;
