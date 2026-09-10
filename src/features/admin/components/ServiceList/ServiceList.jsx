import React from "react";
import {
  Grid, Card, CardContent, Typography, Chip, Box, Divider,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PrintIcon from "@mui/icons-material/Print";
import WifiIcon from "@mui/icons-material/Wifi";
import PeopleIcon from "@mui/icons-material/People";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

const SERVICES = [
  {
    icon: <StorefrontIcon />,
    title: "Tienda / Almacén",
    price: 500,
    notes: "Agrega una nueva sucursal o almacén a tu cuenta.",
  },
  {
    icon: <PrintIcon />,
    title: "Impresora vía USB",
    price: 0,
    tag: "Gratis",
    notes: "Tiempo de implementación: 1 a 2 semanas.",
  },
  {
    icon: <WifiIcon />,
    title: "Impresora vía WiFi",
    price: 100,
    notes: "Tiempo de implementación: 1 a 4 semanas.",
  },
  {
    icon: <PeopleIcon />,
    title: "Módulo de vendedores",
    price: 0,
    tag: "Gratis",
    notes: "Gestiona vendedores sin límite.",
  },
  {
    icon: <IntegrationInstructionsIcon />,
    title: "Integración con terceros",
    price: 500,
    notes: "El precio puede variar según los requerimientos.",
  },
];

const ServiceList = () => {
  return (
    <Grid className="card">
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Servicios adicionales
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gracias por confiar en <b>SmartVenta</b>. Estos son los servicios disponibles para potenciar tu negocio.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {SERVICES.map((service, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card variant="outlined" sx={{ height: "100%", bgcolor: "background.default", boxShadow: "none", "&:hover": { boxShadow: "none", transform: "none" } }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Box sx={{ color: "primary.main", mb: 1 }}>{service.icon}</Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {service.title}
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ my: 1 }}>
                  {service.price === 0 ? "Gratis" : `$${service.price}/mes`}
                </Typography>
                {service.tag && (
                  <Chip label={service.tag} color="success" size="small" sx={{ mb: 1 }} />
                )}
                <Typography variant="body2" color="text.secondary">
                  {service.notes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ServiceList;
