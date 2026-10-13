import React from "react";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CustomButton from "../../ui/Button/Button";
import { formatCurrency } from "../../../utils/utils";
import { STORE_UPDATE } from "./services";
import { whatsappButtonSx } from "./whatsappButtonSx";

const PriceOrTag = ({ service, onPricing }) => {
  if (service.price === 0) return <Chip label="Gratis" color="success" size="small" />;
  if (service.price) {
    return (
      <Typography variant="body2" fontWeight={700} color="primary.main">
        {`${formatCurrency(service.price)}/mes`}
      </Typography>
    );
  }
  if (!service.tag) return null;
  return (
    <CustomButton
      size="small"
      onClick={() => service.action === STORE_UPDATE && onPricing()}
      sx={{ textTransform: "none", fontSize: "0.85rem", height: "fit-content" }}
    >
      {service.tag}
    </CustomButton>
  );
};

/** Tarjeta de un servicio adicional: precio o consulta y, si aplica, botón de WhatsApp. */
const ServiceCard = ({ service, onConsult, onPricing }) => (
  <Card
    variant="outlined"
    sx={{
      height: "100%",
      bgcolor: "background.paper",
      transition: "all 0.2s",
      "&:hover": { boxShadow: 3, transform: "translateY(-4px)", borderColor: "primary.main" },
    }}
  >
    <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
      <Box sx={{ color: "primary.main", fontSize: 40 }}>{service.icon}</Box>

      <Typography variant="subtitle2" fontWeight={600} sx={{ minHeight: 40 }}>
        {service.title}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, minHeight: 45 }}>
        <PriceOrTag service={service} onPricing={onPricing} />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
        {service.notes}
      </Typography>

      {service.action && (
        <CustomButton
          fullWidth
          size="small"
          onClick={() => onConsult(service)}
          startIcon={<WhatsAppIcon />}
          sx={{ mt: "auto", ...whatsappButtonSx }}
        >
          {service.actionLabel}
        </CustomButton>
      )}
    </CardContent>
  </Card>
);

export default ServiceCard;
