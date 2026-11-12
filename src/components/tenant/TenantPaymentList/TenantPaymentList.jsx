import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getPayments } from "../../../api/tenants";
import { Grid } from "@mui/material";
import { formatCurrency, formatLongDate } from "../../../utils/utils";
import { showRequestError } from "../../../utils/alerts";
import PageHeader from "../../ui/PageHeader";

const TenantPaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const fetchPayments = async () => {
      try {
        const response = await getPayments();
        if (!ignore) setPayments(response.data);
      } catch (error) {
        if (!ignore) showRequestError("cargar los pagos", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchPayments();
    return () => { ignore = true; };
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} className="card">
        <PageHeader title="Historial de pagos realizados" />
        <DataTable
          progressPending={loading}
          noDataComponent="Sin pagos"
          data={payments}
          columns={[
            {
              name: "Vigencia",
              selector: (row) =>
                `${formatLongDate(row.start_of_validity)} al ${formatLongDate(row.end_of_validity)}`,
              minWidth: 300,
            },
            { name: "Meses pagados", selector: (row) => row.months },
            { name: "Total", selector: (row) => formatCurrency(row.total) },
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default TenantPaymentList;
