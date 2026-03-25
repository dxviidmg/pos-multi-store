import React, { useEffect, useState } from "react";
import DataTable from "../../ui/DataTable/DataTable";
import { getPayments } from "../../../api/tenants";
import { Grid } from "@mui/material";

const formatDate = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
};

const TenantPaymentList = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const response = await getPayments();
      setPayments(response.data);
    };
    fetchPayments();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} className="card">
        <h1>Pagos del servicio</h1>
        <DataTable
          data={payments}
          pagination={true}
          columns={[
            {
              name: "Vigencia",
              selector: (row) =>
                `${formatDate(row.start_of_validity)} al ${formatDate(row.end_of_validity)}`,
              minWidth: 300,
            },
            { name: "Meses pagados", selector: (row) => row.months },
            { name: "Total", selector: (row) => `$${row.total}` },
          ]}
        />
      </Grid>
    </Grid>
  );
};

export default TenantPaymentList;
