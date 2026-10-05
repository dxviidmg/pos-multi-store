import React, { useState } from "react";
import { Box, Button, FormControlLabel, Grid, Switch, TextField } from "@mui/material";
import { Business, Save, Settings } from "@mui/icons-material";
import ProfileSectionTitle from "./ProfileSectionTitle";
import { updateTenant } from "../../../api/tenants";
import { formatLongDate } from "../../../utils/date";
import { showRequestError, showSuccess } from "../../../utils/alerts";

const SETTINGS = [
  { name: "displays_stock_in_storages", label: "Mostrar stock en almacenes" },
  { name: "create_products_on_sale", label: "Permitir crear productos desde venta" },
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
        <Box sx={{ mb: 3 }}>
          <ProfileSectionTitle icon={Business} title="Información del negocio" />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del negocio"
                name="name"
                value={tenantData.name}
                onChange={handleTenantChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre corto"
                name="short_name"
                value={tenantData.short_name}
                size="small"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fecha de creación"
                name="created_at"
                value={tenantData.created_at ? formatLongDate(tenantData.created_at) : ""}
                size="small"
                disabled
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box sx={{ mb: 3 }}>
          <ProfileSectionTitle icon={Settings} title="Configuraciones" />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SETTINGS.map(({ name, label }) => (
              <FormControlLabel
                key={name}
                control={<Switch name={name} checked={settings[name]} onChange={handleSettingChange} />}
                label={label}
              />
            ))}
          </Box>
        </Box>

        <Button fullWidth variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}>
          Guardar datos del negocio
        </Button>
      </Grid>
    </>
  );
};

export default TenantSection;
