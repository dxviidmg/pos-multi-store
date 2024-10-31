import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getClients } from "../apis/clients";


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

const ClientList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getClients();
      setClients(response.data);
    };

    fetchData();
  }, []);


  return (
    <>
      <div className="section">
        <h1>Clientes</h1>
        <CustomTable
          data={clients}
          columns={[
            {
              name: "#",
              selector: (row) => row.id,
            },
            {
              name: "Nombre",
              selector: (row) => row.full_name,
              grow: 2
            },
            {
              name: "Telefono",
              selector: (row) => row.phone_number,
              grow: 2,
              wrap: true
            },
            {
              name: "Descuento",
              selector: (row) => row.discount.discount_percentage + '%',

            },


          ]}
        />
      </div>
    </>
  );
};

export default ClientList;
