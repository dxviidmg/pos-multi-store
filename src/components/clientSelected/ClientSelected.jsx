import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomButton from "../commons/customButton/CustomButton";
import { removeClientfromCart } from "../redux/cart/cartActions";
import { Grid, TextField, Box } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";


const ClientSelected = () => {
  const client = useSelector((state) => state.cartReducer.client);
  const dispatch = useDispatch();

  const handleShortcut = (event) => {
    if (event.ctrlKey && event.key === "e") {
      event.preventDefault(); // Evita la acción predeterminada del navegador
      dispatch(removeClientfromCart())
    }
  };

  useEffect(() => {
    // Añadir el listener al montar el componente
    window.addEventListener("keydown", handleShortcut);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  return (
    <Grid container spacing={2} className="align-items-end">
      <Grid item xs={12} md={3}>
        <Box>
          <TextField size="small" fullWidth label="Nombre" type="text"
            value={client.full_name ? client.full_name : ""}
            placeholder="Nombre"
            disabled
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={3}>
        <Box>
          <TextField size="small" fullWidth label="Teléfono" type="text"
            value={client.phone_number ? client.phone_number : ""}
            placeholder="Teléfono"
            disabled
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={3}>
        <Box>
          <TextField size="small" fullWidth label="Descuento" type="text"
            value={client.discount_percentage ? `${client.discount_percentage}%` : ""}
            placeholder="Descuento"
            disabled
          />
        </Box>
      </Grid>

      <Grid item xs={12} md={3}>
        <Box>
          <CustomButton fullWidth={true} onClick={() => dispatch(removeClientfromCart())} startIcon={<PersonRemoveIcon />}>
          Borrar 
          (Ctrl + E)
          </CustomButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ClientSelected;
