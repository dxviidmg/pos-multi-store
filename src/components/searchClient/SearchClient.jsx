import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable";
import { getClients } from "../apis/clients";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch } from "react-redux";
import { selectClient } from "../redux/clientSelected/clientSelectedActions";
import { Form } from "react-bootstrap";


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
      <Form.Label>Buscador de clientes</Form.Label>
      <Form.Control
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nombre y/o número"
      />
      <CustomTable
        data={options}
        columns={[
          {
            name: "Nombre",
            selector: (row) => row.full_name,
            sortable: true,
          },

          {
            name: "Teléfono",
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
