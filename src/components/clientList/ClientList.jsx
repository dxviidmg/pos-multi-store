import React, { useState } from "react";
import CustomTable from "../commons/customTable/customTable";

import CustomButton from "../commons/customButton/CustomButton";
import { createDiscount } from "../apis/discounts";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  showClientModal,
} from "../redux/clientModal/ClientModalActions";
import ClientModal from "../clientModal/ClientModal";
import { EditIcon } from "../commons/icons/Icons";
import { getUserData } from "../apis/utils";
import { getDateDifference, getFormattedDate } from "../utils/utils";
import CustomTooltip from "../commons/Tooltip";
import { useClients } from "../../hooks/useClients";
import Grid from "@mui/material/Grid";
import { TextField, Box } from "@mui/material";

const ClientList = () => {
  const today = getFormattedDate();
  const dispatch = useDispatch();

  const [discountFormData, setDiscountFormData] = useState({
    discount_percentage: "",
  });

  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });

  const { data: clients = [], isLoading, refetch } = useClients(params);
  const range = getDateDifference(params.start_date, params.end_date);

  const handleDiscountInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveDiscount = async () => {
    const response = await createDiscount(discountFormData);

    if (response.status === 201) {
      setDiscountFormData({ discount_percentage: "" });

      Swal.fire({
        icon: "success",
        title: "Descuento creado",
        timer: 5000,
      });
    } else {
      handleDiscountError(response);
    }
  };

  const handleDiscountError = (error) => {
    let message = "Error desconocido, por favor comuníquese con soporte";

    if (
      error.response?.status === 400 &&
      error.response.data.discount_percentage
    ) {
      const discountError = error.response.data.discount_percentage[0];
      if (
        discountError ===
        "discount with this discount percentage already exists."
      ) {
        message = "El descuento ya existe";
      }
    }

    Swal.fire({
      icon: "error",
      title: "Error al crear descuento",
      text: message,
      timer: 5000,
    });
  };

  const handleOpenModal = (client) => {
    dispatch(showClientModal(client));
  };

  const handleUpdateClientList = () => {
    refetch();
  };

  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <ClientModal onUpdateClientList={handleUpdateClientList} />
      {getUserData().role === "owner" && (
        <Grid item xs={12} className="custom-section">
          <Box component="form">
            <h1>Crear descuento</h1>
            <br />
            <TextField size="small" fullWidth label="Descuento" type="number"
              value={discountFormData.discount_percentage}
              placeholder="Descuento"
              name="discount_percentage"
              onChange={handleDiscountInputChange}
            />
            <CustomButton
              fullWidth
              onClick={handleSaveDiscount}
              disabled={!discountFormData.discount_percentage}
              marginTop="10px"
            >
              Crear descuento
            </CustomButton>
          </Box>
        </Grid>
      )}
      <Grid item xs={12} className="custom-section">
        <h1>Clientes</h1>
        <CustomButton onClick={() => handleOpenModal()}>Crear</CustomButton>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box component="form">
              <TextField size="small" fullWidth label="Fecha de inicio" name="start_date"
                type="date"
                value={params.start_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box component="form">
              <TextField size="small" fullWidth label="Fecha de fin" name="end_date"
                type="date"
                value={params.end_date}
                onChange={(e) => handleParams(e)}
                max={today}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box component="form">
              <TextField size="small" fullWidth label="Rango" name="range" type="input" value={range} disabled />
            </Box>
          </Grid>
        </Grid>
        <CustomTable
          searcher={true}
          data={clients}
          columns={[
            { name: "#", selector: (row) => row.id },
            { name: "Nombre", selector: (row) => row.full_name, grow: 2 },
            {
              name: "Teléfono",
              selector: (row) => row.phone_number,
              grow: 2,
            },
            {
              name: "Suma de ventas",
              sortable: true,
              selector: (row) => row.total_sales_amount,
            },
            {
              name: "Descuento",
              selector: (row) => `${row.discount_percentage}%`,
            },
            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text={"Editar usuario"}>
                  <CustomButton onClick={() => handleOpenModal(row)}>
                    <EditIcon />
                  </CustomButton>
                </CustomTooltip>
              ),
            },
          ]}
          highlightOnHover
        />
      </Grid>
    </>
  );
};

export default ClientList;
