import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/customModal";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { hideClientModal } from "../redux/clientModal/ClientModalActions";
import { useDiscounts } from "../../hooks/useDiscounts";
import { useCreateClient, useUpdateClient } from "../../hooks/useClientMutations";
import { Grid } from "@mui/material";

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

      <Grid container >
        <Grid item xs={12}>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={formData.first_name}
            placeholder="Nombre"
            name="first_name"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Form.Label>Apellidos</Form.Label>
          <Form.Control
            type="text"
            value={formData.last_name}
            placeholder="Apellidos"
            name="last_name"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={formData.phone_number}
            placeholder="Teléfono"
            name="phone_number"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Form.Label>Descuento</Form.Label>
          <Form.Select
            aria-label="Select discount"
            value={formData.discount}
            onChange={handleInputChange}
            name="discount"
          >
            <option value="">Descuento</option>
            {discounts.map((discount) => (
              <option key={discount.id} value={discount.id}>
                {discount.discount_percentage}%
              </option>
            ))}
          </Form.Select>
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
