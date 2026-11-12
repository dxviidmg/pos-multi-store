import React, { useState } from "react";
import { Grid, Typography, Divider } from "@mui/material";
import { useStoresCount } from "../../../hooks/useStoresCount";
import ConsultDialog from "./ConsultDialog";
import ServiceCard from "./ServiceCard";
import { SERVICES } from "./services";

const LANDING_URL = "https://smartventapos.vercel.app/";

const ServiceList = () => {
  const { data: storesData } = useStoresCount();
  const [consultService, setConsultService] = useState(null);

  const current = { stores: storesData?.stores || 0, warehouses: storesData?.warehouses || 0 };

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
        {SERVICES.map((service) => (
          <Grid item xs={12} sm={6} md={3} key={service.title}>
            <ServiceCard
              service={service}
              onConsult={setConsultService}
              onPricing={() => { window.location.href = LANDING_URL; }}
            />
          </Grid>
        ))}
      </Grid>

      {consultService && (
        <ConsultDialog service={consultService} current={current} onClose={() => setConsultService(null)} />
      )}
    </Grid>
  );
};

export default ServiceList;
