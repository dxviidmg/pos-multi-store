import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { TextField, Box } from "@mui/material";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { getClients } from "../../../api/clients";
import { addClientToCart } from "../../../redux/cart/cartActions";
import { showWarning } from "../../../utils/alerts";
import { logger } from "../../../utils/logger";
import { useCtrlShortcut } from "../../../hooks/useCtrlShortcut";

const MAX_RESULTS = 5;
// Ctrl+J enfoca la búsqueda; Ctrl+1…5 elige el cliente de esa posición
const POSITION_KEYS = ["1", "2", "3", "4", "5"];

const columns = [
  { name: "Nombre", selector: (row) => row.full_name },
  { name: "Teléfono", selector: (row) => row.phone_number },
  { name: "Descuento", selector: (row) => row.discount_percentage + "%" },
];

const SearchClient = () => {
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState([]);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setClients([]);
      return undefined;
    }
    let active = true;
    const fetchData = async () => {
      try {
        const response = await getClients({ q: query });
        if (active) setClients(response.data.slice(0, MAX_RESULTS));
      } catch (error) {
        logger.error("Error searching clients:", error);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [query]);

  const handleSelectClient = (client) => {
    dispatch(addClientToCart(client));
    setQuery("");
  };

  useCtrlShortcut(["j", ...POSITION_KEYS], (_event, key) => {
    if (key === "j") {
      inputRef.current?.focus();
      return;
    }
    const client = clients[Number(key) - 1];
    if (client) {
      handleSelectClient(client);
    } else {
      showWarning("No se pudo seleccionar el cliente", `No hay un cliente en la posición ${key}.`);
    }
  });

  return (
    <Box sx={{ position: "relative" }}>
      <TextField size="small" fullWidth inputRef={inputRef}
        type="text"
        label="Buscar cliente"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nombre y/o número (Ctrl+J)"
        InputLabelProps={{ shrink: true }}
        className="fade-in-left"
      />
      {query && (
        <Box sx={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, mt: 0.5 }}>
          <SimpleTable
            noDataComponent="Sin clientes"
            data={clients}
            onRowClicked={handleSelectClient}
            columns={columns}
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchClient;
