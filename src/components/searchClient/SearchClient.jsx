import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable";
import { getClients } from "../apis/clients";
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
        const response = await getClients(query);
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
    <Searcher setQuery={setQuery}  inputPlaceholder="Nombre o numero" label='Buscador de clientes'></Searcher>
      <CustomTable
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
            name: "Descuento",
            selector: (row) => row.discount.discount_percentage + '%',
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
