import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { Form } from "react-bootstrap";
import { getFormattedDate, formatTimeFromDate } from "../utils/utils";
import { useDispatch } from "react-redux";
import { getStoreProductLogs } from "../apis/products";

const LogList = () => {
  const [sales, setSales] = useState([]);
  const today = getFormattedDate();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSalesData = async () => {
      const salesResponse = await getStoreProductLogs();
      setSales(salesResponse.data);
    };

    fetchSalesData();
  }, []);





  return (
    <>
      <div className="custom-section">
        <Form.Label className="fw-bold">Lista de logs</Form.Label>
        <CustomTable
          data={sales}
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
