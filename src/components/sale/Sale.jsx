import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable";
import { getSpecialClients } from "../apis/specialClients";
import CustomButton from "../commons/customButton/CustomButton";

const Sale = () => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response2 = await getSpecialClients();

      setOptions(response2.data);
      console.log(response2.data);
    };

    fetchData();
  }, []);

  return (
    <>
      <CustomTable
        inputPlaceholder="Buscar cliente"
        title="Clientes"
        data={options}
        columns={[
          {
            name: "Nombre",
            selector: (row) => row.full_name,
            sortable: true,
          },

          {
            name: "Telefono",
            selector: (row) => row.phone_number,
            sortable: true,
          },

          {
            name: "Tipo de cliente",
            selector: (row) => row.special_client_type.name,
            sortable: true,
          },

          {
            name: "Acciones",
            selector: (props) => (
              <div>
                <CustomButton >
                Seleccionar
                </CustomButton>
              </div>
            ),
          },

        ]}
      ></CustomTable>
    </>
  );
};

export default Sale;
