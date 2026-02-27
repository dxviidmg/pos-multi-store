import React, { useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { deleteDepartments } from "../apis/departments";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../utils/alerts";
import { showDepartmentModal } from "../redux/departmentModal/DepartmentModalActions";
import DepartmentModal from "../departmentModal/DepartmentModal";
import { getUserData } from "../apis/utils";
import EditIcon from "@mui/icons-material/Edit";
import CustomTooltip from "../commons/Tooltip";
import Grid from "@mui/material/Grid";
import { useDepartments } from "../../hooks/useDepartments";
import { Checkbox, FormControlLabel, Box, Stack, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const DepartmentList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const dispatch = useDispatch();

  const { data: departments = [], isLoading: loading, refetch } = useDepartments();

  const handleOpenModal = (department) => {
    dispatch(showDepartmentModal(department));
  };

  const handleUpdateDepartmentList = () => {
    refetch();
  };

  const handleDeleteDepartments = async () => {
    const productsCount = selectedRows.reduce(
      (sum, element) => sum + element.product_count,
      0
    );

    if (productsCount > 0) {
      showError("Error al borrar departamentos", "Los departamentos no deben tener productos relacionados");
      return;
    }

    const selectedIds = selectedRows.map((element) => element.id);
    const response = await deleteDepartments(selectedIds);

    if (response.status === 200) {
      showSuccess("Departamentos eliminados");
      refetch();
    } else {
      showError("Error al borrar Departamentos");
    }
  };

  const handleCheck = (e) => {
    setConfirmDeletion(e.target.checked);
  };

  return (
    <>
      <Grid item xs={12} className="custom-section">
        <DepartmentModal onUpdateDepartmentList={handleUpdateDepartmentList} />
        
        <Box>
          <Stack direction="row" justifyContent="space-between">
            <h1>Departamentos</h1>
            <CustomButton onClick={() => handleOpenModal()} startIcon={<AddIcon />}>
              Nuevo Departamento
            </CustomButton>
          </Stack>
          <Divider />
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControlLabel
            control={
              <Checkbox size="small"
                checked={confirmDeletion}
                onChange={handleCheck}
              />
            }
            label="Confirmar eliminación"
          />
          <CustomButton
            onClick={handleDeleteDepartments}
            disabled={
              selectedRows.length === 0 ||
              !confirmDeletion ||
              getUserData().role !== "owner"
            }
            startIcon={<DeleteIcon />}
            color="error"
          >
            Eliminar seleccionados
          </CustomButton>
        </Stack>

        <CustomTable
          progressPending={loading}
          data={departments}
          setSelectedRows={setSelectedRows}
          columns={[
            {
              name: "Nombre",
              selector: (row) => row.name,
              grow: 2,
              wrap: true,
            },
            {
              name: "Número de productos",
              selector: (row) => row.product_count,
            },
            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text={"Editar Departamento"}>
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    <EditIcon />
                  </CustomButton>
                </CustomTooltip>
              ),
            },
          ]}
        />
      </Grid>
    </>
  );
};

export default DepartmentList;
