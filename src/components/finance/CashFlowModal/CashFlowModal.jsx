import React, { useEffect, useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { showSuccess, showError } from "../../../utils/alerts";
import { createCashFlow, getCashFlowChoices } from "../../../api/cashflow";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";


const CashFlowModal = ({ isOpen, cashFlow, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ id: "" });
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await getCashFlowChoices();
      setOptions(response.data);
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    if (cashFlow) {
      setFormData({
        id: cashFlow.id || "",
        name: cashFlow.name || "",
      });
    }
  }, [cashFlow]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBrandSubmit = async () => {
    if (loading) return;
    setLoading(true)
    let response;
    if (formData.id) {
//      response = await updateBrand(formData);
    } else {
      response = await createCashFlow(formData);
    }

    if (response.status === 200) {
      onClose();
      onUpdate(response.data);
      setFormData({ id: "" });
      setLoading(false)
      showSuccess("Movimiento actualizado");
    } else if (response.status === 201) {
      onClose();
      setLoading(false)
      setFormData({ id: "" });
      showSuccess("Movimiento creado");
    } else {
      showError("Error al crear la marca", "Error desconocido, por favor comuníquese con soporte");
    }
  };

  return (
    <CustomModal 
      showOut={isOpen} 
      onClose={onClose}
      title={formData.id ? "Actualizar movimiento" : "Crear movimiento"}
    >
      <Grid className="custom-section">

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
              <InputLabel>Tipo de movimiento</InputLabel>
              <Select fullWidth size="small" value={formData.transaction_type}
              onChange={handleInputChange}
              name="transaction_type"
//              disabled={isLoading}
             label="Tipo de movimiento">

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
          <TextField size="small" fullWidth label="Concepto" type="text"
            value={formData.concept}
            placeholder="Concepto"
            name="concept"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="Cantidad" type="number"
            value={formData.amount}
            placeholder="Cantidad"
            name="amount"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3} className="d-flex flex-column justify-content-end">
          <CustomButton
            fullWidth={true}
            onClick={handleBrandSubmit}
//            disabled={formData.name === ""}
            marginTop="3px"
            startIcon={<SaveIcon />}
          >
            {formData.id ? "Actualizar" : "Crear"}
          </CustomButton>
        </Grid>
      </Grid>
      </Grid>
    </CustomModal>
  );
};

export default CashFlowModal;
