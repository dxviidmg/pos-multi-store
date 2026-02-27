import React, { useEffect, useState } from "react";
import CustomModal from "../commons/customModal/CustomModal";

import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../commons/customButton/CustomButton";
import { hideDepartmentModal } from "../../redux/departmentModal/DepartmentModalActions";
import { useCreateDepartment, useUpdateDepartment } from "../../hooks/useDepartmentMutations";
import { Grid, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const DepartmentModal = ({ onUpdateDepartmentList }) => {
  const { showDepartmentModal, department } = useSelector(
    (state) => state.DepartmentModalReducer
  );

  const [formData, setFormData] = useState({
    name: "",
  });

  const dispatch = useDispatch();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  useEffect(() => {
    if (department) {
      setFormData({
        id: department.id || "",
        name: department.name || "",
      });
    } else {
      setFormData({ name: "" });
    }
  }, [department]);

  const handleDataChange = async (e) => {
    let { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDepartmentSubmit = async () => {
    const mutation = formData.id ? updateMutation : createMutation;
    
    mutation.mutate(formData, {
      onSuccess: () => {
        dispatch(hideDepartmentModal());
        onUpdateDepartmentList();
        setFormData({ name: "" });
      },
    });
  };

  return (
    <CustomModal 
      showOut={showDepartmentModal} 
      onClose={() => dispatch(hideDepartmentModal())}
      title={formData.id ? "Actualizar departamento" : "Crear departamento"}
    >

      <Grid className="custom-section">

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField size="small" fullWidth label="Nombre" type="text"
            value={formData.name}
            placeholder="Nombre"
            name="name"
            onChange={handleDataChange}
          />
        </Grid>

        <Grid item xs={12} md={6} className="d-flex flex-column justify-content-end">
          <CustomButton
            fullWidth={true}
            onClick={handleDepartmentSubmit}
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

export default DepartmentModal;
