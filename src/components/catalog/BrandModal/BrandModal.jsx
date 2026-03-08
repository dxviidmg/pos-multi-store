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
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      if (brand) {
        setValues({
          id: brand.id || "",
          name: brand.name || "",
        });
      } else {
        setValues({ name: "" });
      }
    }
  }, [isOpen, brand, setValues]);

  const handleBrandSubmit = () => {
    console.log('Submitting:', values);
    const mutation = values.id ? updateMutation : createMutation;
    
    mutation.mutate(values, {
      onSuccess: () => {
        console.log('Success');
        onClose();
        onUpdate();
        reset();
      },
      onError: (error) => {
        console.log('Error:', error);
      }
    });
  };

  return (
    <CustomModal 
      showOut={isOpen} 
      onClose={onClose}
      title={values.id ? "Actualizar marca" : "Crear marca"}
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'rgba(4, 53, 107, 0.2)' }}>
        <Grid item xs={12} className="card">
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
              disabled={values.name === "" || isLoading}
              marginTop="3px"
              startIcon={<SaveIcon />}
            >
              {isLoading ? "Creando..." : values.id ? "Actualizar" : "Crear"}
            </CustomButton>
          </Grid>
        </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default BrandModal;
