import React, { useEffect, useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showError } from "../../../utils/alerts";
import { createCashFlow, updateCashFlow, getCashFlowChoices } from "../../../api/cashflow";
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
import SwapVertIcon from "@mui/icons-material/SwapVert";
import NotesIcon from "@mui/icons-material/Notes";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const INITIAL_FORM = { id: "", transaction_type: "", concept: "", amount: "" };

const CashFlowModal = ({ isOpen, cashFlow, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChoices = async () => {
      const res = await getCashFlowChoices();
      setOptions(res.data);
    };
    fetchChoices();
  }, []);

  useEffect(() => {
    if (cashFlow) {
      setFormData({
        id: cashFlow.id || "",
        transaction_type: cashFlow.transaction_type || "",
        concept: cashFlow.concept || "",
        amount: cashFlow.amount || "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [cashFlow]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const response = formData.id
      ? await updateCashFlow(formData)
      : await createCashFlow(formData);
    setLoading(false);

    if (response.status === 200 || response.status === 201) {
      onUpdate(response.data, !!formData.id);
      onClose();
      setFormData(INITIAL_FORM);
      showSuccess(formData.id ? "Movimiento actualizado" : "Movimiento creado");
    } else {
      showError(
        "Error al guardar movimiento",
        "Error desconocido, por favor comuníquese con soporte"
      );
    }
  };

  const isFormIncomplete =
    !formData.transaction_type || !formData.concept || !formData.amount;

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={formData.id ? "Actualizar movimiento" : "Crear movimiento"}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          variant="body2"
          sx={{ mb: 2.5, color: "text.secondary" }}
        >
          Registra una entrada o salida de dinero que no corresponda a una venta.
        </Typography>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de movimiento</InputLabel>
              <Select
                fullWidth
                size="small"
                value={formData.transaction_type}
                onChange={handleInputChange}
                name="transaction_type"
                label="Tipo de movimiento"
                startAdornment={
                  <InputAdornment position="start">
                    <SwapVertIcon fontSize="small" sx={{ color: "primary.main" }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="" disabled>
                  Selecciona un tipo
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Concepto"
              placeholder="Ej: Pago de luz, retiro de efectivo..."
              type="text"
              value={formData.concept}
              name="concept"
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesIcon fontSize="small" sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              size="small"
              fullWidth
              label="Monto"
              placeholder="0.00"
              type="number"
              value={formData.amount}
              name="amount"
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon fontSize="small" sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <CustomButton
              fullWidth
              onClick={handleSubmit}
              disabled={isFormIncomplete || loading}
              startIcon={<SaveIcon />}
              sx={{ height: "40px" }}
            >
              {loading
                ? "Guardando..."
                : formData.id
                ? "Actualizar"
                : "Crear"}
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
  );
};

export default CashFlowModal;
