import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable";
import { getSpecialClients } from "../apis/specialClients";
import CustomButton from "../commons/customButton/CustomButton";
import Searcher from "../commons/searcher/Searcher";
import { useDispatch } from "react-redux";
import { selectClient } from "../redux/clientSelected/clientSelectedActions";


const SearchClient = () => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch(); 

  useEffect(() => {
    const fetchData = async () => {
      console.log(query)

      if (query){
        const response = await getSpecialClients(query);
        setOptions(response.data);
      }
      else{
        setOptions([]);
      }

    };

    fetchData();
  }, [query]);


  const handleSelectClient = (client) => {
    dispatch(selectClient(client)); // Despachar la acción con el producto como payload
    setQuery('')
  };



  return (
    <>
    <Searcher setQuery={setQuery} title="Clientes" inputPlaceholder="Nombre o numero"></Searcher>
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
            selector: (row) => (
              <div>
                <CustomButton onClick={() => handleSelectClient(row)}>
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

export default SearchClient;
