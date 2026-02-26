import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";

import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { hideClientModal } from "../redux/clientModal/ClientModalActions";
import { useDiscounts } from "../../hooks/useDiscounts";
import { useCreateClient, useUpdateClient } from "../../hooks/useClientMutations";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const INITIAL_FORM_DATA = {
  first_name: "",
  last_name: "",
  phone_number: "",
  discount: "",
};

const ClientModal = ({ onUpdateClientList }) => {
  const { showClientModal, client } = useSelector(
    (state) => state.ClientModalReducer
  );

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const dispatch = useDispatch();

  const { data: discounts = [] } = useDiscounts();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isFormIncomplete = Object.values(formData).some((value) => value === "");

  const handleSaveClient = async () => {
    const mutation = formData.id ? updateMutation : createMutation;
    
    mutation.mutate(formData, {
      onSuccess: () => {
        dispatch(hideClientModal());
        onUpdateClientList();
        setFormData(INITIAL_FORM_DATA);
      },
    });
  };
  
  return (
    <CustomModal
      showOut={showClientModal}
      onClose={() => dispatch(hideClientModal())}
      title={formData ? "Actualizar cliente" : "Crear cliente"}
    >
      <div className={`custom-section`}>

      <Grid container spacing={2} >
        <Grid item xs={12}>
          <TextField size="small" fullWidth label="Nombre" type="text"
            value={formData.first_name}
            placeholder="Nombre"
            name="first_name"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="Apellidos" type="text"
            value={formData.last_name}
            placeholder="Apellidos"
            name="last_name"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField size="small" fullWidth label="Teléfono" type="text"
            value={formData.phone_number}
            placeholder="Teléfono"
            name="phone_number"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
              <InputLabel>Descuento</InputLabel>
              <Select fullWidth size="small" aria-label="Select discount"
            value={formData.discount}
            onChange={handleInputChange}
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
          >
            {formData.id ? "Actualizar" : "Crear"} cliente
          </CustomButton>
        </Grid>
      </Grid>
      </div>

    </CustomModal>
  );
};

export default ClientModal;
