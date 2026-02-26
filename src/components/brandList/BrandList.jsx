import React, { useState } from "react";
import CustomTable from "../commons/customTable/customTable";

import CustomButton from "../commons/customButton/CustomButton";
import { deleteBrands } from "../apis/brands";
import BrandModal from "../brandModal/BrandModal";
import { useDispatch } from "react-redux";
import {
  hideBrandModal,
  showBrandModal,
} from "../redux/brandModal/BrandModalActions";
import Swal from "sweetalert2";
import { getUserData } from "../apis/utils";
import { EditIcon } from "../commons/icons/Icons";
import CustomTooltip from "../commons/Tooltip";
import { useBrands } from "../../hooks/useBrands";
import Grid from "@mui/material/Grid";
import { TextField, Select, MenuItem, FormControl, InputLabel, FormLabel, Box, Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";

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
        <h1>Marcas</h1>
        <CustomButton onClick={() => handleOpenModal()}>Crear</CustomButton>
        <CustomButton
          onClick={handleDeleteBrands}
          disabled={
            selectedRows.length === 0 ||
            !confirmDeletion ||
            getUserData().role !== "owner"
          }
        >
          Borrar marcas
        </CustomButton>
        <FormControlLabel
          control={
            <Checkbox size="small"
              checked={confirmDeletion}
              onChange={handleCheck}
            />
          }
          label="Confirmar borrado"
        />
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
