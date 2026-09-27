import React, { useEffect, useRef, useState } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { getClients } from "../../../api/clients";
import { useDispatch } from "react-redux";
import { addClientToCart } from "../../../redux/cart/cartActions";
import { showWarning } from "../../../utils/alerts";
import { TextField, Box } from "@mui/material";

const SearchClient = () => {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState([]);
  const dispatch = useDispatch();

  const inputRefClient = useRef(null); // Crear una referencia para el input

  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        const response = await getClients({q: query});
        setClients(response.data.slice(0, 5));
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
    if (event.ctrlKey && (event.key === "j" || event.key === "J")) {
      event.preventDefault();
      inputRefClient.current?.focus();
    }
    if (event.ctrlKey && ["1", "2", "3", "4", "5"].includes(event.key)) {
      event.preventDefault();
      const client = clients[parseInt(event.key) - 1];

      if (client) {
        handleSelectClient(client);
      } else {
        showWarning("No se pudo seleccionar el cliente", `No hay un cliente en la posición ${event.key}.`);
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
    <Box sx={{ position: 'relative' }}>
      <TextField size="small" fullWidth ref={inputRefClient}
        type="text"
        label="Buscar cliente"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nombre y/o número (Ctrl+J)"
        InputLabelProps={{ shrink: true }}
        className="fade-in-left"
      />
      {query && (
        <Box sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, mt: 0.5 }}>
          <SimpleTable
            noDataComponent="Sin clientes"
            data={clients}
            onRowClicked={handleSelectClient}
            columns={[
              {
                name: "Nombre",
                selector: (row) => row.full_name,
              },
              {
                name: "Teléfono",
                selector: (row) => row.phone_number,
              },
              {
                name: "Descuento",
                selector: (row) => row.discount_percentage + "%",
              },
            ]}
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchClient;
