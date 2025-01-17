import React, { useEffect, useRef, useState } from "react";
import CustomTable from "../commons/customTable/customTable";
import { getClients } from "../apis/clients";
import CustomButton from "../commons/customButton/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Form } from "react-bootstrap";
import { addClientToCart } from "../redux/cart/cartActions";
import Swal from "sweetalert2";

const SearchClient = () => {
  const client = useSelector((state) => state.cartReducer.client);
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState([]);
  const dispatch = useDispatch();

  const inputRefClient = useRef(null); // Crear una referencia para el input

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        const response = await getClients(query);
        setClients(response.data.slice(0, 5));
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

  const handleShortcut = (event) => {
    if (event.ctrlKey && event.key === "q") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      inputRefClient.current?.focus(); // Enfocar el input
    }
    if (event.ctrlKey && ["1", "2", "3", "4", "5"].includes(event.key)) {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      const client = clients[parseInt(event.key) - 1];

      if (client) {
        handleSelectClient(client);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al seleccionar cliente",
          text: "Fuera de rango",
          timer: 5000,
        });
      }
    }
  };

  useEffect(() => {
    // Añadir el listener al montar el componente
    window.addEventListener("keydown", handleShortcut);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [clients]);

  return (
    <>
      <Form.Label className="fw-bold me-3">Buscador de clientes</Form.Label>
      <b>
        {Object.keys(client).length === 0 && (
          <Badge bg="success">Aviso: No hay cliente seleccionado</Badge>
        )}
      </b>

      <Form.Control
        ref={inputRefClient}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nombre y/o número (Ctrl + Q)"
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
          {
            name: "Atajo",
            selector: (row, index) => <div>Ctrl + {index + 1}</div>,
          },
        ]}
      />
    </>
  );
};

export default SearchClient;
