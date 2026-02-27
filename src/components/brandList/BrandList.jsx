import React, { useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import CustomButton from "../commons/customButton/CustomButton";
import { deleteBrands } from "../apis/brands";
import BrandModal from "../brandModal/BrandModal";
import { useDispatch } from "react-redux";
import { showBrandModal } from "../redux/brandModal/BrandModalActions";
import Swal from "sweetalert2";
import { getUserData } from "../apis/utils";
import EditIcon from "@mui/icons-material/Edit";
import CustomTooltip from "../commons/Tooltip";
import { useBrands } from "../../hooks/useBrands";
import Grid from "@mui/material/Grid";
import { Checkbox, FormControlLabel, Box, Typography, Stack, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const BrandList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const dispatch = useDispatch();

  const { data: brands = [], isLoading: loading, refetch } = useBrands();

  const handleOpenModal = (brand) => {
    dispatch(showBrandModal(brand));
  };

  const handleUpdateBrandList = () => {
    refetch();
  };

  const handleDeleteBrands = async () => {
    const productsCount = selectedRows.reduce(
      (sum, element) => sum + element.product_count,
      0
    );

    if (productsCount > 0) {
      Swal.fire({
        icon: "error",
        title: "Error al borrar marcas",
        text: "Las marcas no deben tener productos relacionados",
        timer: 5000,
      });
      return;
    }
    const selectedIds = selectedRows.map((element) => element.id);
    const response = await deleteBrands(selectedIds);

    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Marcas eliminadas",
        timer: 5000,
      });
      refetch();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al borrar marcas",
        timer: 5000,
      });
    }
  };

  const handleCheck = (e) => {
    setConfirmDeletion(e.target.checked);
  };

  return (
      <Grid item xs={12} className="custom-section">
        <BrandModal onUpdateBrandList={handleUpdateBrandList} />
        
        <Box>
          <Stack direction="row" justifyContent="space-between">
            <h1>
              Marcas
            </h1>
            <CustomButton onClick={() => handleOpenModal()} startIcon={<AddIcon />}>
              Nueva Marca
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

        <CustomTable
          progressPending={loading}
          data={brands}
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
                <CustomTooltip text={"Editar marca"}>
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    <EditIcon />
                  </CustomButton>
                </CustomTooltip>
              ),
            },
          ]}
        />
      </Grid>
  );
};

export default BrandList;
