import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getPayments } from "../apis/tenants";
import { Grid } from "@mui/material";

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
    <Grid container spacing={2}>
      <Grid xs={12} className="custom-section">
      <h1>Pagos del servicio</h1>
      <CustomTable
        data={payments}
        columns={[
          {
            name: "Vigencia",
            selector: (row) =>
              row.start_of_validity + " al " + row.end_of_validity,
          },
          { name: "Meses pagados", selector: (row) => row.months },
          {
            name: "Total",
            selector: (row) => row.total,
          },
        ]}
      />
    </Grid>
    </Grid>
  );
};

export default TenantPaymentList;
