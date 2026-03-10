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
import { Save, Business, Settings, Person } from '@mui/icons-material';
import { getUserData } from '../../../api/utils';
import { getTenant, updateTenant } from '../../../api/tenants';
import { getUser, updateUser } from '../../../api/users';
import { CustomSpinner } from '../../ui/Spinner/Spinner';

const TenantProfile = () => {
  const user = getUserData();
  const [tenantData, setTenantData] = useState({
    name: '',
    short_name: '',
    created_at: '',
  });

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  const [settings, setSettings] = useState({
    displays_stock_in_storages: false,
  });

  const [loading, setLoading] = useState(true);
  const [savingTenant, setSavingTenant] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tenantResponse, userResponse] = await Promise.all([
        getTenant(user.tenant_id),
        getUser(user.user_id)
      ]);
      
      const tenantInfo = tenantResponse.data;
      setTenantData({
        name: tenantInfo.name || '',
        short_name: tenantInfo.short_name || '',
        created_at: tenantInfo.created_at || '',
      });
      setSettings({
        displays_stock_in_storages: tenantInfo.displays_stock_in_storages || false,
      });

      const userInfo = userResponse.data;
      setUserData({
        username: userInfo.username || '',
        email: userInfo.email || '',
        first_name: userInfo.first_name || '',
        last_name: userInfo.last_name || '',
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

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveTenant = async () => {
    setSavingTenant(true);
    setMessage(null);
    
    try {
      await updateTenant(user.tenant_id, { ...tenantData, ...settings });
      setMessage({ type: 'success', text: 'Datos del negocio guardados correctamente' });
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'Error al guardar los datos del negocio' });
    } finally {
      setSavingTenant(false);
    }
  };

  const handleSaveUser = async () => {
    setSavingUser(true);
    setMessage(null);
    
    try {
      await updateUser(user.user_id, userData);
      setMessage({ type: 'success', text: 'Datos del usuario guardados correctamente' });
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'Error al guardar los datos del usuario' });
    } finally {
      setSavingUser(false);
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
              onClick={handleSaveTenant}
              disabled={savingTenant}
            >
              Guardar Datos del Negocio
            </Button>
          </Grid>

          {/* Información del Usuario */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Información del Usuario
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Usuario"
                    name="username"
                    value={userData.username}
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleUserChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleUserChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={userData.email}
                    onChange={handleUserChange}
                    size="small"
                    type="email"
                  />
                </Grid>
              </Grid>
            </Box>

            <Button
              fullWidth
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveUser}
              disabled={savingUser}
            >
              Guardar Datos del Usuario
            </Button>
          </Grid>
        </Grid>


      </Grid>
    </Grid>
  );
};

export default TenantProfile;
