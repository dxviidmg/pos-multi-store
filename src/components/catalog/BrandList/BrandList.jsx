import React, { useState } from "react";
import CustomTable from "../../ui/Table/Table";
import CustomButton from "../../ui/Button/Button";
import { deleteBrands } from "../../../api/brands";
import BrandModal from "../BrandModal/BrandModal";
import { showSuccess, showError } from "../../../utils/alerts";
import { getUserData } from "../../../api/utils";
import EditIcon from "@mui/icons-material/Edit";
import CustomTooltip from "../../ui/Tooltip";
import { useBrands } from "../../../hooks/useBrands";
import { useModal } from "../../../hooks/useModal";
import Grid from "@mui/material/Grid";
import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const BrandList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const brandModal = useModal();

  const { data: brands = [], isLoading: loading, refetch } = useBrands();

  const handleDeleteBrands = async () => {
    const productsCount = selectedRows.reduce(
      (sum, element) => sum + element.product_count,
      0
    );

    if (productsCount > 0) {
      showError("Error al borrar marcas", "Las marcas no deben tener productos relacionados");
      return;
    }
    const selectedIds = selectedRows.map((element) => element.id);
    const response = await deleteBrands(selectedIds);

    if (response.status === 200) {
      showSuccess("Marcas eliminadas");
      refetch();
    } else {
      showError("Error al borrar marcas");
    }
  };

  const handleCheck = (e) => {
    setConfirmDeletion(e.target.checked);
  };

  return (
    <>
      {/* 1. MODALS */}
      <BrandModal 
        isOpen={brandModal.isOpen}
        brand={brandModal.data}
        onClose={brandModal.close}
        onUpdate={refetch}
      />
      
      {/* 2. CONTENIDO PRINCIPAL */}
      <Grid item xs={12} className="custom-section">
        {/* 2.1 Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Marcas</h1>
          <CustomButton onClick={() => brandModal.open()} startIcon={<AddIcon />}>
            Nueva Marca
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
            onClick={handleDeleteBrands}
            disabled={
              selectedRows.length === 0 ||
              !confirmDeletion ||
              getUserData().role !== "owner"
            }
            startIcon={<DeleteIcon />}
            color="error"
          >
            Eliminar seleccionadas
          </CustomButton>
        </Stack>

        {/* 2.3 Tabla */}
        <CustomTable
          progressPending={loading}
          data={brands}
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
                <CustomTooltip text={"Editar marca"}>
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
