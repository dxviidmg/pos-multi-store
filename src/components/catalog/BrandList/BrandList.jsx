import React, { useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import { deleteBrands } from "../../../api/brands";
import BrandModal from "../BrandModal/BrandModal";
import { showSuccess, showError, showConfirm } from "../../../utils/alerts";
import { getUserData } from "../../../api/utils";
import EditIcon from "@mui/icons-material/Edit";
import CustomTooltip from "../../ui/Tooltip";
import { useBrands } from "../../../hooks/useBrands";
import { useModal } from "../../../hooks/useModal";
import { Grid, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const BrandList = () => {
  const user = getUserData();
  const [selectedRows, setSelectedRows] = useState([]);
  const brandModal = useModal();
  const { data: brands = [], isLoading: loading, refetch } = useBrands();

  const handleDeleteBrands = async () => {
    const productsCount = selectedRows.reduce((sum, el) => sum + el.product_count, 0);
    if (productsCount > 0) {
      showError("Error al borrar marcas", "Las marcas no deben tener productos relacionados");
      return;
    }
    const confirmed = await showConfirm("¿Eliminar marcas seleccionadas?", `Se eliminarán ${selectedRows.length} marca(s)`);
    if (!confirmed) return;
    const selectedIds = selectedRows.map((el) => el.id);
    const response = await deleteBrands(selectedIds);
    if (response.status === 200) {
      showSuccess("Marcas eliminadas");
      refetch();
    } else {
      showError("Error al borrar marcas");
    }
  };

  return (
    <>
      <BrandModal isOpen={brandModal.isOpen} brand={brandModal.data} onClose={brandModal.close} onUpdate={refetch} />

      <Grid item xs={12} className="card">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Marcas</h1>
          <CustomButton onClick={() => brandModal.open()} startIcon={<AddIcon />}>
            Nueva Marca
          </CustomButton>
        </Stack>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <CustomButton
              fullWidth
              onClick={handleDeleteBrands}
              disabled={selectedRows.length === 0 || user.role !== "owner"}
              startIcon={<DeleteIcon />}
            >
              Eliminar seleccionadas
            </CustomButton>
          </Grid>
        </Grid>

        <DataTable
          progressPending={loading}
          data={brands}
          setSelectedRows={setSelectedRows}
          columns={[
            { name: "Nombre", selector: (row) => row.name, grow: 2 },
            { name: "Número de productos", selector: (row) => row.product_count },
            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text="Editar marca">
                  <CustomButton onClick={() => brandModal.open(row)}>
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

export default BrandList;
