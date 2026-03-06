import React, { useState } from "react";
import CustomTable from "../../ui/Table/Table";
import CustomButton from "../../ui/Button/Button";
import { deleteDepartments } from "../../../api/departments";

import { showSuccess, showError } from "../../../utils/alerts";
import { useModal } from "../../../hooks/useModal";
import DepartmentModal from "../DepartmentModal/DepartmentModal";
import { getUserData } from "../../../api/utils";
import EditIcon from "@mui/icons-material/Edit";
import CustomTooltip from "../../ui/Tooltip";
import Grid from "@mui/material/Grid";
import { useDepartments } from "../../../hooks/useDepartments";
import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const DepartmentList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const departmentModal = useModal();

  const { data: departments = [], isLoading: loading, refetch } = useDepartments();

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
      {/* 1. MODALS */}
      <DepartmentModal isOpen={departmentModal.isOpen} department={departmentModal.data} onClose={departmentModal.close} onUpdate={refetch} />
      
      {/* 2. CONTENIDO PRINCIPAL */}
      <Grid item xs={12} className="custom-section">
        {/* 2.1 Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Departamentos</h1>
          <CustomButton onClick={() => departmentModal.open()} startIcon={<AddIcon />}>
            Nuevo Departamento
          </CustomButton>
        </Stack>

        {/* 2.2 Acciones secundarias */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
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

        {/* 2.3 Tabla */}
        <CustomTable
          progressPending={loading}
          data={departments}
          setSelectedRows={setSelectedRows}
          columns={[
            {
              name: "Nombre",
              selector: (row) => row.name,
              grow: 2,
              wrapText: true,
            },
            {
              name: "Número de productos",
              selector: (row) => row.product_count,
            },
            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text={"Editar Departamento"}>
                  <CustomButton onClick={() => departmentModal.open(row)}>
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
