import React, { useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import ClientModal from "../ClientModal/ClientModal";
import DiscountModal from "../DiscountModal/DiscountModal";
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
  const discountModal = useModal();

  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });

  const { data: clients = [], refetch } = useClients(params);
  const range = getDateDifference(params.start_date, params.end_date);

  const handleParams = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <ClientModal 
        isOpen={clientModal.isOpen}
        client={clientModal.data}
        onClose={clientModal.close}
        onUpdate={refetch}
      />
      <DiscountModal
        isOpen={discountModal.isOpen}
        onClose={discountModal.close}
      />
      
      <Grid item xs={12} className="card">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h1>Clientes</h1>
          <Stack direction="row" spacing={1}>
            {getUserData().role === "owner" && (
              <CustomButton onClick={() => discountModal.open()} startIcon={<DiscountIcon />}>
                Crear descuento
              </CustomButton>
            )}
            <CustomButton onClick={() => clientModal.open()} startIcon={<AddIcon />}>
              Nuevo Cliente
            </CustomButton>
          </Stack>
        </Stack>

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
              inputProps={{ max: today }}
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
              inputProps={{ max: today }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Rango"
              name="range"
              type="text"
              value={range}
              disabled
            />
          </Grid>
        </Grid>

        <DataTable
          searcher={true}
          data={clients}
          columns={[
            { name: "#", selector: (row) => row.id },
            { name: "Nombre", selector: (row) => row.full_name },
            {
              name: "Teléfono",
              selector: (row) => row.phone_number,
            },
            {
              name: "Total comprado",
              field: "total_sales_amount",
              sortable: true,
              selector: (row) => `$${Number(row.total_sales_amount).toLocaleString()}`,
            },
            {
              name: "Descuento",
              selector: (row) => `${row.discount_percentage}%`,
            },
            {
              name: "Acciones",
              cell: (row) => (
                <CustomTooltip text="Editar cliente">
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
