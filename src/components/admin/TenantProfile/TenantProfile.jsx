import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { Save, Business, Settings } from '@mui/icons-material';
import { getUserData } from '../../../api/utils';
import { getTenant, updateTenant } from '../../../api/tenants';
import { CustomSpinner } from '../../ui/Spinner/Spinner';

const TenantProfile = () => {
  const user = getUserData();
  const [tenantData, setTenantData] = useState({
    name: '',
    short_name: '',
    created_at: '',
  });

  const [settings, setSettings] = useState({
    displays_stock_in_storages: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchTenantData();
  }, []);

  const fetchTenantData = async () => {
    try {
      const response = await getTenant(user.tenant_id);
      const data = response.data;
      
      setTenantData({
        name: data.name || '',
        short_name: data.short_name || '',
        created_at: data.created_at || '',
      });
      setSettings({
        displays_stock_in_storages: data.displays_stock_in_storages || false,
      });
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage({ type: 'error', text: 'Error al cargar los datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleTenantChange = (e) => {
    const { name, value } = e.target;
    setTenantData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      await updateTenant(user.tenant_id, { ...tenantData, ...settings });
      setMessage({ type: 'success', text: 'Cambios guardados correctamente' });
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'Error al guardar los cambios' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CustomSpinner />;

  return (
    <Grid container>
      <Grid item xs={12} className="card">

        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Información del Tenant */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Información del Negocio
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre del Negocio"
                    name="name"
                    value={tenantData.name}
                    onChange={handleTenantChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre Corto"
                    name="short_name"
                    value={tenantData.short_name}
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Fecha de Creación"
                    name="created_at"
                    value={tenantData.created_at ? new Date(tenantData.created_at).toLocaleDateString('es-MX') : ''}
                    size="small"
                    disabled
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Configuraciones */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Settings sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Configuraciones
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="displays_stock_in_storages"
                      checked={settings.displays_stock_in_storages}
                      onChange={handleSettingChange}
                    />
                  }
                  label="Mostrar stock en almacenes"
                />
              </Box>
            </Box>

            <Button
            fullWidth
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saving}
          >
            Guardar Cambios
          </Button>
          </Grid>
        </Grid>


      </Grid>
    </Grid>
  );
};

export default TenantProfile;
