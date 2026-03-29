import React, { useEffect, useRef, useState } from "react";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { getClients } from "../../../api/clients";
import CustomButton from "../../ui/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { Chip } from "@mui/material";
import { addClientToCart } from "../../../redux/cart/cartActions";
import { showError } from "../../../utils/alerts";
import { TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SearchClient = () => {
  const client = useSelector((state) => state.cartReducer.client);
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
    if (event.ctrlKey && (event.key === "i" || event.key === "I")) {
      event.preventDefault();
      inputRefClient.current?.focus();
    }
    if (event.ctrlKey && ["1", "2", "3", "4", "5"].includes(event.key)) {
      event.preventDefault();
      const client = clients[parseInt(event.key) - 1];

      if (client) {
        handleSelectClient(client);
      } else {
        showError("Error al seleccionar cliente", "Fuera de rango");
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
<div className="flex-between" style={{ marginBottom: '0.5rem' }}>
  <h2>Seleccionar cliente</h2>
  {Object.keys(client).length === 0 && (
    <Chip label="Aviso: No hay cliente seleccionado" color="success" size="small" />
  )}
</div>

      <TextField size="small" fullWidth ref={inputRefClient}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nombre y/o número (Ctrl+I)"
        sx={{ mb: query ? 0 : 1 }}
      />
      {query && (
        <SimpleTable
          noDataComponent="Sin clientes"
          data={clients}
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

            {
              name: "Acciones",
              cell: (row) => (
                <CustomButton onClick={() => handleSelectClient(row)} startIcon={<CheckCircleIcon />}>
                  Seleccionar
                </CustomButton>
              ),
            },
          ]}
        />
      )}
    </>
  );
};

export default SearchClient;
