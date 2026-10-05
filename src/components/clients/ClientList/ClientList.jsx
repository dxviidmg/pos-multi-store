import React, { useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import CustomButton from "../../ui/Button/Button";
import ClientModal from "../ClientModal/ClientModal";
import DiscountModal from "../DiscountModal/DiscountModal";
import EditIcon from "@mui/icons-material/Edit";
import { useUser } from "../../../context/UserContext";
import { isOwner } from "../../../constants/routeAccess";
import { getFormattedDate, formatCurrency } from "../../../utils/utils";
import CustomTooltip from "../../ui/Tooltip";
import { useClients } from "../../../hooks/useClients";
import { useModal } from "../../../hooks/useModal";
import Grid from "@mui/material/Grid";
import PageHeader from "../../ui/PageHeader";
import DateRangeFilter from "../../ui/DateRangeFilter/DateRangeFilter";
import AddIcon from "@mui/icons-material/Add";
import DiscountIcon from "@mui/icons-material/Discount";

const ClientList = () => {
  const { user } = useUser();
  const today = getFormattedDate();
  const clientModal = useModal();
  const discountModal = useModal();

  const [params, setParams] = useState({
    end_date: today,
    start_date: today,
  });

  const { data: clients = [], isLoading: loading } = useClients(params);

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
      />
      <DiscountModal
        isOpen={discountModal.isOpen}
        onClose={discountModal.close}
      />
      
      <Grid item xs={12} className="card">
        <PageHeader title="Clientes" childrenMd={6}>
          <Grid container spacing={2}>
            {isOwner(user) && (
              <Grid item xs={12} md={6}>
                <CustomButton fullWidth onClick={() => discountModal.open()} startIcon={<DiscountIcon />}>
                  Crear descuento
                </CustomButton>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <CustomButton fullWidth onClick={() => clientModal.open()} startIcon={<AddIcon />}>
                Nuevo cliente
              </CustomButton>
            </Grid>
          </Grid>
        </PageHeader>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <DateRangeFilter
            startDate={params.start_date}
            endDate={params.end_date}
            onChange={handleParams}
            showRange
          />
        </Grid>

        <DataTable
          progressPending={loading}
          noDataComponent="Sin clientes"
          searcher
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
              selector: (row) => formatCurrency(row.total_sales_amount),
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
        />
      </Grid>
    </>
  );
};

export default ClientList;
