import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form } from "react-bootstrap";
import { formatTimeFromDate, getFormattedDate } from "../utils/utils";
import { getStoreProductLogs } from "../apis/products";
import { CustomSpinner2 } from "../commons/customSpinner/CustomSpinner";

const LogList = () => {
  const today = getFormattedDate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(today)
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true)
      const salesResponse = await getStoreProductLogs({
        "date": date
    });
      setSales(salesResponse.data);
      setLoading(false)
    };

    fetchSalesData();
  }, [date]);

  return (
    <>
      <CustomSpinner2 isLoading={loading}></CustomSpinner2>
      <div className="custom-section">
        <Form.Label className="fw-bold">Lista de logs</Form.Label>

        <Form>
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
          />
        </Form>

        <CustomTable
          data={sales}
          loading={loading}
          columns={[
            {
              name: "Marca",
              selector: (row) => row.product_brand,
            },

            {
              name: "Nombre",
              selector: (row) => row.product_name,
            },

            {
              name: "Descripción",
              selector: (row) => row.description,
            },

            {
              name: "Hora",
              selector: (row) => formatTimeFromDate(row.created_at),
            },

            {
              name: "Stock anterior",
              selector: (row) => row.previous_stock,
            },
            {
              name: "Stock actualizado",
              selector: (row) => row.updated_stock,
            },
            {
              name: "Diferencia de stock",
              selector: (row) => row.difference,
            },
          ]}
        />
      </div>
    </>
  );
};

export default LogList;
