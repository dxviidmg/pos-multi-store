import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getTransfers } from "../apis/transfers";

const calculateTimeAgo = (creationDate) => {
  const now = new Date();
  const createdAt = new Date(creationDate);
  const differenceInMs = now - createdAt;

  const seconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `hace ${days} dia(s)`;
  } else if (hours > 0) {
    return `hace ${hours} horas(s)`;
  } else if (minutes > 0) {
    return `hace ${minutes} minuto(s)`;
  } else {
    return `hace ${seconds} segundo(s)`;
  }
};

const TransferList = () => {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getTransfers();
      setTransfers(response.data);
    };

    fetchData();
  }, []);


  return (
    <>
      <div className="section">
        <h1>Traspasos</h1>
        <CustomTable
          data={transfers}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Codigo",
              selector: (row) => row.product_code,
              grow: 2
            },
            {
              name: "Producto",
              selector: (row) => row.product_description,
              grow: 2,
              wrap: true
            },
            {
              name: "Cantidad",
              selector: (row) => row.quantity,

            },

            {
              name: "Descripcion",
              selector: (row) => row.description,

              grow: 3
            },
            {
              name: "Creado hace",
              selector: (row) => calculateTimeAgo(row.created_at), // Usar la función aquí
          grow: 2
            },
            {
              name: "Status",
              selector: (row) => row.is_delivered ? 'Completado': 'En proceso',

            },
          ]}
        />
      </div>
    </>
  );
};

export default TransferList;
