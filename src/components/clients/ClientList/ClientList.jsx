import React, { useState } from "react";
import CustomTable from "../../ui/Table/Table";
import CustomButton from "../../ui/Button/Button";
import { createDiscount } from "../../../api/discounts";
import { showSuccess, showError } from "../../../utils/alerts";
import ClientModal from "../ClientModal/ClientModal";
import EditIcon from "@mui/icons-material/Edit";
import { getUserData } from "../../../api/utils";
import { getDateDifference, getFormattedDate } from "../../../utils/utils";
import CustomTooltip from "../../ui/Tooltip";
import { useClients } from "../../../hooks/useClients";
import { useModal } from "../../../hooks/useModal";
import Grid from "@mui/material/Grid";
import { TextField, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DiscountIcon from "@mui/icons-material/Discount";

const ClientList = () => {
  const today = getFormattedDate();
  const clientModal = useModal();

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

      showSuccess("Descuento creado");
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

    showError("Error al crear descuento", message);
  };

  const handleParams = async (e) => {
    let { name, value } = e.target;
    setParams((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      {/* 1. MODALS */}
      <ClientModal 
        isOpen={clientModal.isOpen}
        client={clientModal.data}
        onClose={clientModal.close}
        onUpdate={refetch}
      />
      
      {/* 2. SECCIÓN DE DESCUENTOS (solo owner) */}
      {getUserData().role === "owner" && (
        <Grid item xs={12} className="card">
          <h1>Crear descuento</h1>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                fullWidth
                label="Descuento"
                type="number"
                value={discountFormData.discount_percentage}
                placeholder="Descuento"
                name="discount_percentage"
                onChange={handleDiscountInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomButton
                fullWidth
                onClick={handleSaveDiscount}
                disabled={!discountFormData.discount_percentage}
                startIcon={<DiscountIcon />}
              >
                Crear descuento
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* 3. CONTENIDO PRINCIPAL */}
      <Grid item xs={12} className="card">
        {/* 3.1 Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Clientes</h1>
          <CustomButton onClick={() => clientModal.open()} startIcon={<AddIcon />}>
            Nuevo Cliente
          </CustomButton>
        </Stack>

        {/* 3.2 Filtros */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Fecha de inicio"
              name="start_date"
              type="date"
              value={params.start_date}
              onChange={handleParams}
              max={today}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Fecha de fin"
              name="end_date"
              type="date"
              value={params.end_date}
              onChange={handleParams}
              max={today}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Rango"
              name="range"
              type="input"
              value={range}
              disabled
            />
          </Grid>
        </Grid>

        {/* 3.3 Tabla */}
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
                  <CustomButton onClick={() => clientModal.open(row)}>
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
