import React from "react";
import { useDispatch } from "react-redux";
import { Box, Grid, TextField } from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CustomButton from "../../ui/Button/Button";
import SearchClient from "../../clients/SearchClient/SearchClient";
import ClientModal from "../../clients/ClientModal/ClientModal";
import { addClientToCart, removeClientFromCart } from "../../../redux/cart/cartActions";
import { useModal } from "../../../hooks/useModal";
import PaymentCard from "./PaymentCard";

/**
 * Cliente del cobro: búsqueda y alta mientras no hay cliente; datos y "Quitar" cuando ya hay uno.
 */
const PaymentClientSection = ({ hidden, client }) => {
  const dispatch = useDispatch();
  const clientModal = useModal();
  const hasClient = Boolean(client?.id);

  const handleClientCreated = (newClient) => {
    if (newClient) dispatch(addClientToCart(newClient));
  };

  return (
    <PaymentCard hidden={hidden} title={hasClient ? "Cliente seleccionado" : "Seleccionar cliente"}>
      {!hasClient && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Box sx={{ flex: 1 }}>
                <SearchClient />
              </Box>
              <CustomButton
                onClick={() => clientModal.open()}
                startIcon={<PersonAddAltIcon />}
                sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Crear cliente
              </CustomButton>
            </Box>
          </Grid>
        </Grid>
      )}

      {hasClient && (
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid item xs={12} md={3}>
            <TextField size="small" fullWidth label="Nombre" value={client.full_name || ""} disabled />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField size="small" fullWidth label="Teléfono" value={client.phone_number || ""} disabled />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              size="small"
              fullWidth
              label="Descuento"
              value={client.discount_percentage != null ? `${client.discount_percentage}%` : ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomButton
              fullWidth
              onClick={() => dispatch(removeClientFromCart())}
              startIcon={<PersonRemoveIcon />}
              color="inherit"
              sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
            >
              Quitar (Ctrl+O)
            </CustomButton>
          </Grid>
        </Grid>
      )}

      <ClientModal isOpen={clientModal.isOpen} client={null} onClose={clientModal.close} onUpdate={handleClientCreated} />
    </PaymentCard>
  );
};

export default PaymentClientSection;
