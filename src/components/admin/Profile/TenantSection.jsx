import React, { useState } from "react";
import { Box, Grid, Switch, Typography } from "@mui/material";
import { TextField } from "../../ui/Field/Field";
import CustomButton from "../../ui/Button/Button";
import { Business, Save, Settings } from "@mui/icons-material";
import ProfileCard from "./ProfileCard";
import { updateTenant } from "../../../api/tenants";
import { formatLongDate } from "../../../utils/date";
import { showRequestError, showSuccess } from "../../../utils/alerts";

const SETTINGS = [
  { name: "displays_stock_in_storages", label: "Mostrar stock en almacenes", hint: "Las tiendas ven el stock disponible en los almacenes" },
  { name: "create_products_on_sale", label: "Permitir crear productos desde venta", hint: "Agrega productos nuevos sin salir de la pantalla de venta" },
];

/** Datos y configuraciones del negocio (solo dueño). */
const TenantSection = ({ tenantId, tenant }) => {
  const [tenantData, setTenantData] = useState({
    name: tenant.name || "",
    short_name: tenant.short_name || "",
    created_at: tenant.created_at || "",
  });
  const [settings, setSettings] = useState({
    displays_stock_in_storages: tenant.displays_stock_in_storages || false,
    create_products_on_sale: tenant.create_products_on_sale || false,
  });
  const [saving, setSaving] = useState(false);

  const handleTenantChange = (e) => {
    const { name, value } = e.target;
    setTenantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTenant(tenantId, { ...tenantData, ...settings });
      showSuccess("Datos del negocio guardados");
    } catch (error) {
      showRequestError("guardar los datos del negocio", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={6}>
        <ProfileCard icon={Business} title="Información del negocio" description="Datos generales de tu cuenta" delay={0}>
          <TextField
            fullWidth
            label="Nombre del negocio"
            name="name"
            value={tenantData.name}
            onChange={handleTenantChange}
            size="small"
          />
          <TextField fullWidth label="Nombre corto" name="short_name" value={tenantData.short_name} size="small" disabled />
          <TextField
            fullWidth
            label="Fecha de creación"
            name="created_at"
            value={tenantData.created_at ? formatLongDate(tenantData.created_at) : ""}
            size="small"
            disabled
          />
        </ProfileCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <ProfileCard
          icon={Settings}
          title="Configuraciones"
          description="Cómo se comporta tu negocio"
          delay={30}
          action={
            <CustomButton startIcon={<Save />} onClick={handleSave} disabled={saving} fullWidth>
              Guardar datos del negocio
            </CustomButton>
          }
        >
          {SETTINGS.map(({ name, label, hint }) => (
            <Box
              key={name}
              sx={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2,
                p: 1.5, border: 1, borderColor: "divider", borderRadius: "10px",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body1" fontWeight={600} component="label" htmlFor={name}>{label}</Typography>
                <Typography variant="body2" color="text.secondary">{hint}</Typography>
              </Box>
              <Switch id={name} name={name} checked={settings[name]} onChange={handleSettingChange} />
            </Box>
          ))}
        </ProfileCard>
      </Grid>
    </>
  );
};

export default TenantSection;
