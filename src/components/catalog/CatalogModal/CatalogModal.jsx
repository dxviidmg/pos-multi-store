import React, { useEffect } from "react";
import CustomModal, { ModalBody } from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { useForm } from "../../../hooks/useForm";
import { Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const INITIAL_VALUES = { name: "" };

const CatalogModal = ({ isOpen, item, onClose, useCreate, useUpdate, entityLabel }) => {
  const { values, handleChange, reset, setValues } = useForm(INITIAL_VALUES);

  const createMutation = useCreate();
  const updateMutation = useUpdate();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      setValues(item ? { id: item.id || "", name: item.name || "" } : INITIAL_VALUES);
    }
  }, [isOpen, item, setValues]);

  const handleSubmit = () => {
    const mutation = values.id ? updateMutation : createMutation;
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  return (
    <CustomModal
      showOut={isOpen}
      onClose={onClose}
      title={values.id ? `Editar ${entityLabel}` : `Crear ${entityLabel}`}
    >
      <ModalBody>
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
                {isLoading ? "Guardando..." : values.id ? "Actualizar" : "Crear"}
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      </ModalBody>
    </CustomModal>
  );
};

export default CatalogModal;
