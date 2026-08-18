import React, { useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showError } from "../../../utils/alerts";
import { createStore } from "../../../api/stores";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import StoreIcon from "@mui/icons-material/Store";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

const INITIAL_FORM = { name: "", store_type: "T", address: "", phone_number: "" };

const CreateStoreModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const response = await createStore(formData);
    setLoading(false);

    if (response.status === 200 || response.status === 201) {
      onCreated(response.data);
      onClose();
      setFormData(INITIAL_FORM);
      showSuccess("Tienda creada exitosamente");
    } else {
      showError(
        "Error al crear tienda",
        response.data?.detail || "Error desconocido, por favor comuníquese con soporte"
      );
    }
  };

  const isFormIncomplete = !formData.name;

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title="Crear tienda"
    >
      <Box sx={{ p: 3, maxWidth: 420, mx: "auto" }}>
        <Typography variant="body2" sx={{ mb: 2.5, color: "text.secondary" }}>
          Agrega una nueva tienda o almacén a tu negocio.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.store_type}
                onChange={handleInputChange}
                name="store_type"
                label="Tipo"
                startAdornment={
                  <InputAdornment position="start">
                    <WarehouseIcon fontSize="small" sx={{ color: "primary.main" }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="T">Tienda</MenuItem>
                <MenuItem value="A">Almacén</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              size="small"
              fullWidth
              label="Nombre"
              placeholder="Ej: Sucursal Centro"
              value={formData.name}
              name="name"
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StoreIcon fontSize="small" sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              size="small"
              fullWidth
              label="Dirección (opcional)"
              placeholder="Ej: Av. Principal #123"
              value={formData.address}
              name="address"
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon fontSize="small" sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              size="small"
              fullWidth
              label="Teléfono (opcional)"
              placeholder="Ej: 5512345678"
              value={formData.phone_number}
              name="phone_number"
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              fullWidth
              onClick={handleSubmit}
              disabled={isFormIncomplete || loading}
              startIcon={<SaveIcon />}
              sx={{ height: "40px", mt: 0.5 }}
            >
              {loading ? "Creando..." : "Crear tienda"}
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
  );
};

export default CreateStoreModal;
