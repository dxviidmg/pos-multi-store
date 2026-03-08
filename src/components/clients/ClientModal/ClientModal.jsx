import React, { useEffect } from "react";
import { useForm } from "../../../hooks/useForm";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { useDiscounts } from "../../../hooks/useDiscounts";
import { useCreateClient, useUpdateClient } from "../../../hooks/useClientMutations";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const INITIAL_FORM_DATA = {
  first_name: "",
  last_name: "",
  phone_number: "",
  discount: "",
};

const ClientModal = ({ isOpen, client, onClose, onUpdate }) => {
  const { values, handleChange, reset, setValues } = useForm(INITIAL_FORM_DATA);

  const { data: discounts = [] } = useDiscounts();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  useEffect(() => {
    if (isOpen) {
      if (client) {
        setValues(client);
      } else {
        setValues(INITIAL_FORM_DATA);
      }
    }
  }, [isOpen, client, setValues]);

  const isFormIncomplete = Object.values(values).some((value) => value === "");

  const handleSaveClient = () => {
    const mutation = values.id ? updateMutation : createMutation;
    
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
        onUpdate();
        reset();
      },
    });
  };
  
  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={values.id ? "Actualizar cliente" : "Crear cliente"}
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="card">

      <Grid container spacing={2} >
        <Grid item xs={12}>
          <TextField size="small" fullWidth label="Nombre" type="text"
            value={values.first_name}
            placeholder="Nombre"
            name="first_name"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="Apellidos" type="text"
            value={values.last_name}
            placeholder="Apellidos"
            name="last_name"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="Teléfono" type="text"
            value={values.phone_number}
            placeholder="Teléfono"
            name="phone_number"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
              <InputLabel>Descuento</InputLabel>
              <Select fullWidth size="small" aria-label="Select discount"
            value={values.discount}
            onChange={handleChange}
            name="discount"
          >
            <MenuItem value="">Descuento</MenuItem>
            {discounts.map((discount) => (
              <MenuItem key={discount.id} value={discount.id}>
                {discount.discount_percentage}%
              </MenuItem>
            ))}
          </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <CustomButton
            fullWidth
            onClick={handleSaveClient}
            disabled={isFormIncomplete}
            marginTop="10px"
            startIcon={<SaveIcon />}
          >
            {values.id ? "Actualizar" : "Crear"} cliente
          </CustomButton>
        </Grid>
      </Grid>
        </Grid>
      </Grid>

    </CustomModal>
  );
};

export default ClientModal;
