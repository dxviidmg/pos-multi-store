import React, { useEffect, useState } from "react";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showRequestError } from "../../../utils/alerts";
import { createCashFlow, updateCashFlow, getCashFlowChoices } from "../../../api/cashflow";
import { Box, Grid, MenuItem, FormControl, InputLabel, InputAdornment, Typography } from "@mui/material";
import { TextField, Select } from "../../ui/Field/Field";
import SaveIcon from "@mui/icons-material/Save";
import SwapVertIcon from "@mui/icons-material/SwapVertOutlined";
import NotesIcon from "@mui/icons-material/NotesOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoneyOutlined";

const INITIAL_FORM = { id: "", transaction_type: "", concept: "", amount: "" };

const CashFlowModal = ({ isOpen, cashFlow, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchChoices = async () => {
      try {
        const res = await getCashFlowChoices();
        if (!ignore) setOptions(res.data);
      } catch (error) {
        if (!ignore) showRequestError("cargar los tipos de movimiento", error);
      }
    };
    fetchChoices();
    return () => { ignore = true; };
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = formData.id
        ? await updateCashFlow(formData)
        : await createCashFlow(formData);
      onUpdate(response.data, Boolean(formData.id));
      onClose();
      setFormData(INITIAL_FORM);
      showSuccess(formData.id ? "Movimiento actualizado" : "Movimiento creado");
    } catch (error) {
      showRequestError("guardar el movimiento", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormIncomplete =
    !formData.transaction_type || !formData.concept || !formData.amount;

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={formData.id ? "Editar movimiento" : "Crear movimiento"}
    >
      <ModalBody>
        <Box className="card">
          <Typography
            variant="body2"
            sx={{ mb: 2.5, color: "text.secondary" }}
          >
            Registra una entrada o salida de dinero que no corresponda a una venta.
          </Typography>

          <Grid container className="fill-row" spacing={2.5}>
            <Grid item xs={12} sm={8} md={8}>
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

            <Grid item xs={12} sm={4} md={4}>
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

            <Grid item xs={12} sm={6} md={6}>
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

            <Grid item xs={12} sm={6} md={6}>
              <CustomButton
                fullWidth
                onClick={handleSubmit}
                disabled={isFormIncomplete || loading}
                startIcon={<SaveIcon />}
                sx={{ height: "40px" }}
              >
                {loading ? "Guardando..." : formData.id ? "Actualizar" : "Crear"}
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      </ModalBody>
    </CustomModal>
  );
};

export default CashFlowModal;
