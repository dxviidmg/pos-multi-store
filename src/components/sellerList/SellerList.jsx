import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form } from "react-bootstrap";
import { getSellers } from "../apis/sellers";


const SellerList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      const salesResponse = await getSellers();
      setSales(salesResponse.data);
      setLoading(false);
    };

    fetchSalesData();
  }, []);

  return (
    <>
      <div className="custom-section">
        <Form.Label className="fw-bold">Lista de vendedores</Form.Label>
        <CustomTable
        progressPending={loading}
          data={sales}
          pagination={false}
          columns={[
            {
              name: "Tienda",
              selector: (row) => row.store.name,
            },

            {
              name: "Username",
              selector: (row) => row.user.username,
            },
            {
              name: "Nombre",
              selector: (row) => `${row.user.first_name} ${row.user.last_name}`,
            },
            {
              name: "Vendido hoy",
              selector: (row) => `$${row.total_sales}`,
            }
          ]}
        />
      </div>
    </>
  );
};

export default SellerList;
