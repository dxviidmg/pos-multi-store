import React, { useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { deleteDepartments } from "../../../api/departments";
import { showSuccess, showError } from "../../../utils/alerts";
import { useModal } from "../../../hooks/useModal";
import DepartmentModal from "../DepartmentModal/DepartmentModal";
import { getUserData } from "../../../api/utils";
import EditIcon from "@mui/icons-material/Edit";
import CustomTooltip from "../../ui/Tooltip";
import { useDepartments } from "../../../hooks/useDepartments";
import { Grid, Checkbox, FormControlLabel, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const DepartmentList = () => {
  const user = getUserData();
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const departmentModal = useModal();
  const { data: departments = [], isLoading: loading, refetch } = useDepartments();

  const handleDeleteDepartments = async () => {
    const productsCount = selectedRows.reduce((sum, el) => sum + el.product_count, 0);
    if (productsCount > 0) {
      showError("Error al borrar departamentos", "Los departamentos no deben tener productos relacionados");
      return;
    }
    const selectedIds = selectedRows.map((el) => el.id);
    const response = await deleteDepartments(selectedIds);
    if (response.status === 200) {
      showSuccess("Departamentos eliminados");
      refetch();
    } else {
      showError("Error al borrar departamentos");
    }
  };

  return (
    <>
      <DepartmentModal isOpen={departmentModal.isOpen} department={departmentModal.data} onClose={departmentModal.close} onUpdate={refetch} />

      <Grid item xs={12} className="card">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Departamentos</h1>
          <CustomButton onClick={() => departmentModal.open()} startIcon={<AddIcon />}>
            Nuevo Departamento
          </CustomButton>
        </Stack>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={<Checkbox size="small" checked={confirmDeletion} onChange={(e) => setConfirmDeletion(e.target.checked)} />}
              label="Confirmar eliminación"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton
              fullWidth
              onClick={handleDeleteDepartments}
              disabled={selectedRows.length === 0 || !confirmDeletion || user.role !== "owner"}
              startIcon={<DeleteIcon />}
            >
              Eliminar seleccionados
            </CustomButton>
          </Grid>
        </Grid>

        <DataTable
          progressPending={loading}
          data={departments}
          setSelectedRows={setSelectedRows}
          columns={[
            { name: "Nombre", selector: (row) => row.name, grow: 2 },
            { name: "Número de productos", selector: (row) => row.product_count },
            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text="Editar departamento">
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
