import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getSubscriptions } from "../../../api/subscriptions";
import { Grid } from "@mui/material";
import StatusChip from "../../ui/StatusChip";

const statusMap = {
  active: { label: "Activa", color: "success" },
  paused: { label: "Pausada", color: "warning" },
  cancelled: { label: "Cancelada", color: "error" },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getSubscriptions();
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error al obtener suscripciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} className="card">
        <h1>Suscripciones</h1>
        <DataTable
          progressPending={loading}
          noDataComponent="Sin suscripciones"
          data={subscriptions}
          columns={[
            {
              name: "Email",
              selector: (row) => row.payer_email,
              minWidth: 200,
            },
            {
              name: "Monto",
              selector: (row) => `$${row.amount}`,
              width: "120px",
            },
            {
              name: "Método de pago",
              selector: (row) => row.payment_method_id,
              width: "160px",
            },
            {
              name: "Estado",
              cell: (row) => {
                const status = statusMap[row.status] || { label: row.status, color: "default" };
                return <StatusChip label={status.label} color={status.color} />;
              },
              width: "140px",
            },
            {
              name: "Fecha de creación",
              selector: (row) => formatDate(row.created_at),
              minWidth: 220,
            },
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default SubscriptionList;
