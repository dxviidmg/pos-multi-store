import React, { useEffect, useState } from "react";
import DataTable from "@/src/shared/ui/DataTable/DataTable";
import { getSubscriptions } from "@/src/features/tenant/api/subscriptions";
import { Grid, Chip } from "@mui/material";

const statusMap = {
  authorized: { label: "Autorizada", color: "success" },
  paused: { label: "Pausada", color: "warning" },
  cancelled: { label: "Cancelada", color: "error" },
  expired: { label: "Vencida", color: "warning" },
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

const formatCard = (row) => {
  if (!row.card_last_four) return "—";
  const brand = row.card_brand
    ? row.card_brand.charAt(0).toUpperCase() + row.card_brand.slice(1)
    : "Tarjeta";
  const expiration = row.card_expiration ? ` — vence ${row.card_expiration}` : "";
  return `${brand} •••• ${row.card_last_four}${expiration}`;
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
              width: 120,
            },
            {
              name: "Método de pago",
              selector: (row) => row.payment_method_id,
              width: 160,
            },
            {
              name: "Tarjeta",
              selector: (row) => formatCard(row),
              minWidth: 220,
            },
            {
              name: "Estado",
              cell: (row) => {
                const status = statusMap[row.status] || { label: row.status, color: "default" };
                return <Chip size="small" label={status.label} color={status.color} variant="filled" />;
              },
              width: 140,
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
