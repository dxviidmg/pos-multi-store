import React, { useEffect, useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showError } from "../../../utils/alerts";
import { createCashFlow, getCashFlowChoices } from "../../../api/cashflow";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

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
    const response = await createCashFlow(formData);
    setLoading(false);

    if (response.status === 200 || response.status === 201) {
      onUpdate(response.data);
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
      <Grid
        container
        sx={{ padding: "1rem", backgroundColor: "rgba(4, 53, 107, 0.2)" }}
      >
        <Grid item xs={12} className="card">
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de movimiento</InputLabel>
                <Select
                  fullWidth
                  size="small"
                  value={formData.transaction_type}
                  onChange={handleInputChange}
                  name="transaction_type"
                  label="Tipo de movimiento"
                >
                  <MenuItem value="">Selecciona</MenuItem>
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Concepto"
                type="text"
                value={formData.concept}
                name="concept"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Cantidad"
                type="number"
                value={formData.amount}
                name="amount"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomButton
                fullWidth
                onClick={handleSubmit}
                disabled={isFormIncomplete || loading}
                startIcon={<SaveIcon />}
              >
                {loading
                  ? "Guardando..."
                  : formData.id
                  ? "Actualizar"
                  : "Crear"}
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default CashFlowModal;
