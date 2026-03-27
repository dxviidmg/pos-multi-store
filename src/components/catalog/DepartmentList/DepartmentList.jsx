import React, { useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { deleteDepartments } from "../../../api/departments";
import { showSuccess, showError, showConfirm } from "../../../utils/alerts";
import { useModal } from "../../../hooks/useModal";
import DepartmentModal from "../DepartmentModal/DepartmentModal";
import { getUserData } from "../../../api/utils";
import EditIcon from "@mui/icons-material/Edit";
import CustomTooltip from "../../ui/Tooltip";
import { useDepartments } from "../../../hooks/useDepartments";
import PageHeader from "../../ui/PageHeader";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const DepartmentList = () => {
  const user = getUserData();
  const [selectedRows, setSelectedRows] = useState([]);
  const departmentModal = useModal();
  const { data: departments = [], isLoading: loading, refetch } = useDepartments();

  const handleDeleteDepartments = async () => {
    const productsCount = selectedRows.reduce((sum, el) => sum + el.product_count, 0);
    if (productsCount > 0) {
      showError("Error al borrar departamentos", "Los departamentos no deben tener productos relacionados");
      return;
    }
    const confirmed = await showConfirm("¿Eliminar departamentos seleccionados?", `Se eliminarán ${selectedRows.length} departamento(s)`);
    if (!confirmed) return;
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
        <PageHeader title="Departamentos">
          <CustomButton onClick={() => departmentModal.open()} startIcon={<AddIcon />}>
            Nuevo Departamento
          </CustomButton>
        </PageHeader>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <CustomButton
              fullWidth
              onClick={handleDeleteDepartments}
              disabled={selectedRows.length === 0 || user.role !== "owner"}
              startIcon={<DeleteIcon />}
            >
              Eliminar seleccionados
            </CustomButton>
          </Grid>
        </Grid>

        <DataTable
          progressPending={loading}
          noDataComponent="Sin departamentos"
          searcher={true}
          data={departments}
          setSelectedRows={setSelectedRows}
          columns={[
            { name: "Nombre", selector: (row) => row.name },
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
