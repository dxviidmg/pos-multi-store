import React, { useEffect, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getClients } from "../apis/clients";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import { addClientToCart } from "../redux/cart/cartActions";

const SearchClient = () => {
  const client = useSelector((state) => state.cartReducer.client);
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        const response = await getClients(query);
        setClients(response.data);
      } else {
        setClients([]);
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        const response = await getClients(query);
        setClients(response.data);
      } else {
        setClients([]);
      }
    };

    fetchData();
  }, [query]);

  const handleSelectClient = (client) => {
    dispatch(addClientToCart(client));

    setQuery("");
  };

  return (
    <>
      <Form.Label className="fw-bold me-3">Buscador de clientes</Form.Label>

      <b>
        {Object.keys(client).length === 0 && (
          <>Aviso: No hay cliente seleccionado</>
        )}
      </b>

      <Form.Control
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nombre y/o número"
      />
      <CustomTable
        data={clients}
        showNoDataComponent={false}
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
            selector: (row) => row.discount_percentage + "%",
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
