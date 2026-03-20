import React, { useEffect } from "react";
import CustomModal from "../../ui/Modal/Modal";
import CustomButton from "../../ui/Button/Button";
import { useCreateDepartment, useUpdateDepartment } from "../../../hooks/useDepartmentMutations";
import { useForm } from "../../../hooks/useForm";
import { Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const DepartmentModal = ({ isOpen, department, onClose, onUpdate }) => {
  const { values, handleChange, reset, setValues } = useForm({ name: "" });

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (isOpen) {
      if (department) {
        setValues({
          id: department.id || "",
          name: department.name || "",
        });
      } else {
        setValues({ name: "" });
      }
    }
  }, [isOpen, department, setValues]);

  const handleDepartmentSubmit = () => {
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
      title={values.id ? "Actualizar departamento" : "Crear departamento"}
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

          <Grid item xs={12} md={6}>
            <CustomButton
              fullWidth={true}
              onClick={handleDepartmentSubmit}
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

export default DepartmentModal;
