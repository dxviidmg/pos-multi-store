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
      <div className="">
        <CustomTable
          noDataComponent="Sin traspasos pendientes"
          data={transfers}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Código",
              selector: (row) => row.product_code,
              grow: 2
            },
            {
              name: "Producto",
              selector: (row) => row.product_description,
              grow: 4,
              wrap: true
            },
            {
              name: "Cantidad",
              selector: (row) => row.quantity,

            },

            {
              name: "Descripcion",
              selector: (row) => row.product_description,

              grow: 4
            },
            {
              name: "Creado hace",
              selector: (row) => calculateTimeAgo(row.created_at),
              grow: 2
            },
          ]}
        />
      </div>
    </>
  );
};

export default TransferList;
