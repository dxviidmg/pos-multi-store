import React, { useState } from "react";
import DataTable from "@/src/components/ui/DataTable/DataTable";
import CustomButton from "@/src/components/ui/Button/Button";
import { deleteBrands } from "@/src/api/brands";
import BrandModal from "@/src/components/catalog/BrandModal/BrandModal";
import { showSuccess, showError, showConfirm } from "@/src/shared/utils/alerts";
import { useUser } from "@/src/context/UserContext";
import EditIcon from "@mui/icons-material/Edit";
import CustomTooltip from "@/src/components/ui/Tooltip";
import { useBrands } from "@/src/hooks/useBrands";
import { useModal } from "@/src/hooks/useModal";
import PageHeader from "@/src/components/ui/PageHeader";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const BrandList = () => {
  const { user } = useUser();
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
        <PageHeader title="Marcas">
          <CustomButton fullWidth onClick={() => brandModal.open()} startIcon={<AddIcon />}>
            Nueva Marca
          </CustomButton>
        </PageHeader>

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
          noDataComponent="Sin marcas"
          searcher={true}
          data={brands}
          setSelectedRows={setSelectedRows}
          columns={[
            { name: "Nombre", selector: (row) => row.name },
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
