import React, { useEffect } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { useCreateBrand, useUpdateBrand } from "../../../hooks/useBrandMutations";
import { useForm } from "../../../hooks/useForm";
import { Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const BrandModal = ({ isOpen, brand, onClose, onUpdate }) => {
  const { values, handleChange, reset, setValues } = useForm({ name: "" });

  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  useEffect(() => {
    if (brand) {
      setValues({
        id: brand.id || "",
        name: brand.name || "",
      });
    } else {
      reset();
    }
  }, [brand, setValues, reset]);

  const handleBrandSubmit = () => {
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
      title={values.id ? "Actualizar marca" : "Crear marca"}
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="custom-section">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField 
              size="small" 
              fullWidth 
              label="Nombre" 
              type="text"
              value={values.name}
              placeholder="Nombre"
              name="name"
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6} className="d-flex flex-column justify-content-end">
            <CustomButton
              fullWidth={true}
              onClick={handleBrandSubmit}
              disabled={values.name === ""}
              marginTop="3px"
              startIcon={<SaveIcon />}
            >
              {values.id ? "Actualizar" : "Crear"}
            </CustomButton>
          </Grid>
        </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default BrandModal;
