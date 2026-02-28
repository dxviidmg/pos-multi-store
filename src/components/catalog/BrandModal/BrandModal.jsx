import React, { useEffect, useState } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { useCreateBrand, useUpdateBrand } from "../../../hooks/useBrandMutations";
import { Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const BrandModal = ({ isOpen, brand, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ name: "" });

  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  useEffect(() => {
    if (brand) {
      setFormData({
        id: brand.id || "",
        name: brand.name || "",
      });
    } else {
      setFormData({ name: "" });
    }
  }, [brand]);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBrandSubmit = () => {
    const mutation = formData.id ? updateMutation : createMutation;
    
    mutation.mutate(formData, {
      onSuccess: () => {
        onClose();
        onUpdate();
        setFormData({ name: "" });
      },
    });
  };

  return (
    <CustomModal 
      showOut={isOpen} 
      onClose={onClose}
      title={formData.id ? "Actualizar marca" : "Crear marca"}
    >
      <Grid className="custom-section">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField 
              size="small" 
              fullWidth 
              label="Nombre" 
              type="text"
              value={formData.name}
              placeholder="Nombre"
              name="name"
              onChange={handleDataChange}
            />
          </Grid>

          <Grid item xs={12} md={6} className="d-flex flex-column justify-content-end">
            <CustomButton
              fullWidth={true}
              onClick={handleBrandSubmit}
              disabled={formData.name === ""}
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

export default BrandModal;
