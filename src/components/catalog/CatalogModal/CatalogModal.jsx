import React, { useEffect } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { useForm } from "../../../hooks/useForm";
import { Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const CatalogModal = ({ isOpen, item, onClose, onUpdate, useCreate, useUpdate, entityLabel }) => {
  const { values, handleChange, reset, setValues } = useForm({ name: "" });

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      setValues(item ? { id: item.id || "", name: item.name || "" } : { name: "" });
    }
  }, [isOpen, item, setValues]);

  const handleSubmit = () => {
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
      title={values.id ? `Actualizar ${entityLabel}` : `Crear ${entityLabel}`}
    >
      <Grid container sx={{ padding: '1rem', backgroundColor: 'modalBody.main' }}>
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

            <Grid item xs={12} md={6}>
              <CustomButton
                fullWidth
                onClick={handleSubmit}
                disabled={values.name === "" || isLoading}
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

export default CatalogModal;
