import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getSubscriptions } from "../../../api/subscriptions";
import { Grid } from "@mui/material";
import { showRequestError } from "../../../utils/alerts";
import { formatCurrency, formatLongDate } from "../../../utils/utils";
import { STATUS_TONES } from "../../../constants";
import PageHeader from "../../ui/PageHeader";
import StatusChip from "../../ui/StatusChip";

const statusMap = {
  authorized: { label: "Autorizada", tone: STATUS_TONES.SUCCESS },
  paused: { label: "Pausada", tone: STATUS_TONES.WARNING },
  cancelled: { label: "Cancelada", tone: STATUS_TONES.ERROR },
  expired: { label: "Vencida", tone: STATUS_TONES.WARNING },
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
    let ignore = false;
    const fetchSubscriptions = async () => {
      try {
        const response = await getSubscriptions();
        if (!ignore) setSubscriptions(response.data);
      } catch (error) {
        if (!ignore) showRequestError("cargar las suscripciones", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchSubscriptions();
    return () => { ignore = true; };
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} className="card">
        <PageHeader title="Suscripciones" />
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
              selector: (row) => formatCurrency(row.amount),
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
                const status = statusMap[row.status] || { label: row.status, tone: STATUS_TONES.NEUTRAL };
                return <StatusChip label={status.label} tone={status.tone} />;
              },
              width: 140,
            },
            {
              name: "Fecha de creación",
              selector: (row) => formatLongDate(row.created_at, { withTime: true }),
              minWidth: 220,
            },
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default SubscriptionList;
