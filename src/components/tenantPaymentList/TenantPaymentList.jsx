import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form } from "react-bootstrap";
import { getPayments } from "../apis/tenants";

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
    <div className="custom-section">
      <Form.Label className="fw-bold">Lista de pagos</Form.Label>
      <CustomTable
        data={payments}
        columns={[
          {
            name: "Validez",
            selector: (row) =>
              row.start_of_validity + "-" + row.end_of_validity,
          },
          { name: "Meses pagados", selector: (row) => row.months },
          {
            name: "Total",
            selector: (row) => row.total,
          },
        ]}
      />
    </div>
  );
};

export default TenantPaymentList;
