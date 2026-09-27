import React, { useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import CatalogModal from "../CatalogModal/CatalogModal";
import { showSuccess, showError, showConfirm } from "../../../utils/alerts";
import { useUser } from "../../../context/UserContext";
import EditIcon from "@mui/icons-material/Edit";
import CustomTooltip from "../../ui/Tooltip";
import { useModal } from "../../../hooks/useModal";
import PageHeader from "../../ui/PageHeader";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Listado de catálogos que solo tienen nombre (marcas, departamentos).
 * `labels` contiene los textos en español de cada entidad.
 */
const CatalogList = ({ useData, deleteFn, useCreate, useUpdate, labels }) => {
  const { user } = useUser();
  const [selectedRows, setSelectedRows] = useState([]);
  const modal = useModal();
  const { data = [], isLoading: loading, refetch } = useData();

  const handleDelete = async () => {
    const productsCount = selectedRows.reduce((sum, el) => sum + el.product_count, 0);
    if (productsCount > 0) {
      showError(labels.deleteError, labels.hasProducts);
      return;
    }
    const confirmed = await showConfirm(labels.confirmTitle, `Se eliminarán ${selectedRows.length} ${labels.countUnit}`);
    if (!confirmed) return;
    const selectedIds = selectedRows.map((el) => el.id);
    const response = await deleteFn(selectedIds);
    if (response.status === 200) {
      showSuccess(labels.deleted);
      refetch();
    } else {
      showError(labels.deleteError);
    }
  };

  return (
    <>
      <CatalogModal
        isOpen={modal.isOpen}
        item={modal.data}
        onClose={modal.close}
        onUpdate={refetch}
        useCreate={useCreate}
        useUpdate={useUpdate}
        entityLabel={labels.singular}
      />

      <Grid item xs={12} className="card">
        <PageHeader title={labels.title}>
          <CustomButton fullWidth onClick={() => modal.open()} startIcon={<AddIcon />}>
            {labels.create}
          </CustomButton>
        </PageHeader>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={3}>
            <CustomButton
              fullWidth
              onClick={handleDelete}
              disabled={selectedRows.length === 0 || user.role !== "owner"}
              startIcon={<DeleteIcon />}
            >
              {labels.deleteSelected}
            </CustomButton>
          </Grid>
        </Grid>

        <DataTable
          progressPending={loading}
          noDataComponent={labels.empty}
          searcher
          data={data}
          setSelectedRows={setSelectedRows}
          columns={[
            { name: "Nombre", selector: (row) => row.name },
            { name: "Número de productos", selector: (row) => row.product_count },
            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text={`Editar ${labels.singular}`}>
                  <CustomButton onClick={() => modal.open(row)}>
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

export default CatalogList;
