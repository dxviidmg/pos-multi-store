import React, { useState, useEffect, useRef } from "react";
import { useRegisterClient } from "../../../hooks/useRegistration";
import CustomButton from "../../ui/Button/Button";
import CustomModal from "../../ui/Modal/Modal";
import { Grid, TextField, Box, Typography, Paper, Divider, InputAdornment, CircularProgress } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import httpClient from "../../../api/httpClient";
import { getApiUrl } from "../../../api/utils";

const INITIAL_FORM_DATA = {
  name: "",
  short_name: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    "& fieldset": { borderColor: "transparent" },
    "&:hover fieldset": { borderColor: "rgba(4,52,107,0.3)" },
  },
};

const SectionTitle = ({ icon, children }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
    {icon}
    <Typography variant="subtitle2" fontWeight={700} color="primary">{children}</Typography>
  </Box>
);

const Registration = ({ isOpen, onClose }) => {
  const isStandalone = isOpen === undefined;
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [registered, setRegistered] = useState(false);
  const [shortNameStatus, setShortNameStatus] = useState(null); // null | 'checking' | 'available' | 'taken'
  const debounceRef = useRef(null);

  useEffect(() => {
    const value = formData.short_name.trim();
    if (!value) { setShortNameStatus(null); return; }

    setShortNameStatus("checking");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await httpClient.get(getApiUrl("tenant-exists"), { params: { short_name: value } });
        console.log(data)
        setShortNameStatus(data ? "taken" : "available");
      } catch {
        setShortNameStatus(null);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [formData.short_name]);

  const mutation = useRegisterClient({
    onSuccess: () => {
      setFormData(INITIAL_FORM_DATA);
      if (isStandalone) {
        setRegistered(true);
      } else {
        onClose();
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const isFormIncomplete = isStandalone
    ? !formData.name || !formData.short_name || shortNameStatus !== "available" || !formData.first_name || !formData.email || !formData.phone_number
    : !formData.first_name || !formData.phone_number;

  const standaloneForm = (
    <Box sx={{ p: 3 }}>
      {registered ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>¡Registro exitoso!</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Tu negocio ha sido registrado correctamente.</Typography>
          <CustomButton onClick={() => setRegistered(false)} startIcon={<PersonAddIcon />}>
            Registrar otro
          </CustomButton>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <SectionTitle icon={<StorefrontIcon sx={{ fontSize: 20, color: "primary.main" }} />}>Datos del negocio</SectionTitle>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={12}>
              <TextField fullWidth size="small" label="Nombre del negocio" name="name" value={formData.name} onChange={handleChange} required sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth size="small" label="Nombre corto" name="short_name"
                value={formData.short_name} onChange={handleChange} required
                inputProps={{ maxLength: 5 }}
                InputProps={{
                  endAdornment: formData.short_name.trim() && (
                    <InputAdornment position="end">
                      {shortNameStatus === "checking" && <CircularProgress size={18} />}
                      {shortNameStatus === "available" && <CheckCircleIcon sx={{ color: "green" }} />}
                      {shortNameStatus === "taken" && <CancelIcon sx={{ color: "red" }} />}
                    </InputAdornment>
                  ),
                }}
                helperText={
                  shortNameStatus === "taken" ? "Este nombre corto ya está en uso"
                  : shortNameStatus === "available" ? "¡Disponible!"
                  : "Máx. 5 caracteres, debe ser único"
                }
                error={shortNameStatus === "taken"}
                sx={inputSx}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <SectionTitle icon={<PersonIcon sx={{ fontSize: 20, color: "primary.main" }} />}>Datos del propietario</SectionTitle>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Nombre *" name="first_name" value={formData.first_name} onChange={handleChange} required sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Apellidos" name="last_name" value={formData.last_name} onChange={handleChange} sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Email *" name="email" value={formData.email} onChange={handleChange} required type="email" sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Teléfono *" name="phone_number" value={formData.phone_number} onChange={handleChange} required type="tel" sx={inputSx} />
            </Grid>
          </Grid>

          <CustomButton
            fullWidth
            type="submit"
            disabled={isFormIncomplete || mutation.isPending}
            startIcon={<PersonAddIcon />}
            sx={{
              py: 1.3,
              mt: 3,
              borderRadius: 1,
              fontWeight: 700,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #7c5cbf 0%, #6344a3 100%)",
                boxShadow: "0 6px 20px rgba(167,139,250,0.4)",
              },
            }}
          >
            {mutation.isPending ? "Registrando..." : "Registrar negocio"}
          </CustomButton>
          <Typography variant="body2" sx={{ textAlign: "center", color: "rgba(0,0,0,0.5)", fontSize: "0.75rem", mt: 1.5 }}>
            * Campos obligatorios
          </Typography>
        </Box>
      )}
    </Box>
  );

  // Modal mode (registro de cliente desde sesión)
  const modalForm = (
    <Box sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth size="small" label="Nombre *" name="first_name" value={formData.first_name} onChange={handleChange} required sx={inputSx} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth size="small" label="Apellidos" name="last_name" value={formData.last_name} onChange={handleChange} sx={inputSx} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth size="small" label="Teléfono *" name="phone_number" value={formData.phone_number} onChange={handleChange} required type="tel" sx={inputSx} />
          </Grid>
          <Grid item xs={12}>
            <CustomButton
              fullWidth
              type="submit"
              disabled={isFormIncomplete || mutation.isPending}
              startIcon={<PersonAddIcon />}
              sx={{
                py: 1.3, mt: 1, borderRadius: 1, fontWeight: 700, fontSize: "0.95rem",
                background: "linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)",
                "&:hover": { background: "linear-gradient(135deg, #7c5cbf 0%, #6344a3 100%)", boxShadow: "0 6px 20px rgba(167,139,250,0.4)" },
              }}
            >
              {mutation.isPending ? "Registrando..." : "Registrar Cliente"}
            </CustomButton>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ textAlign: "center", color: "rgba(0,0,0,0.5)", fontSize: "0.75rem" }}>* Campos obligatorios</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  if (isStandalone) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #04346b 0%, #065a9e 100%)" }}>
        <Paper sx={{ maxWidth: 520, width: "100%", mx: 2, borderRadius: 4, overflow: "hidden" }}>
          <Box sx={{ p: 3, background: "linear-gradient(135deg, #a78bfa 0%, #7c5cbf 100%)", color: "#fff", textAlign: "center" }}>
            <StorefrontIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>Registra tu negocio</Typography>
          </Box>
          {standaloneForm}
        </Paper>
      </Box>
    );
  }

  return (
    <CustomModal showOut={isOpen} onClose={onClose} title="Registro de Cliente">
      {modalForm}
    </CustomModal>
  );
};

export default Registration;
