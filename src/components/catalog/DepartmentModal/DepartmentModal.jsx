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

  useEffect(() => {
    if (department) {
      setValues({
        id: department.id || "",
        name: department.name || "",
      });
    } else {
      reset();
    }
  }, [department, setValues, reset]);

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
      <Grid className="custom-section">
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
              onClick={handleDepartmentSubmit}
              disabled={values.name === ""}
              marginTop="3px"
              startIcon={<SaveIcon />}
            >
              {values.id ? "Actualizar" : "Crear"}
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>
    </CustomModal>
  );
};

export default DepartmentModal;
