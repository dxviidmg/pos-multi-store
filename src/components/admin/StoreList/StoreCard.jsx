import React, { memo } from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import LabelValue from "../../ui/LabelValue/LabelValue";
import { formatCurrency } from "../../../utils/currency";
import { isOwner } from "../../../constants/routeAccess";
import { PAYMENT_METHOD_OPTIONS } from "../../../constants";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const stop = (event) => event.stopPropagation();

/** Contenido de la tarjeta según el filtro rápido activo. */
const CardBody = ({ filter, store, props }) => {
  const summary = store.cash_summary || {};

  if (filter === "sales") {
    return (
      <>
        <LabelValue label="Vendido" sx={{ mb: 0.25 }}>{formatCurrency(summary.total_sold)}</LabelValue>
        <LabelValue label="Apartado" sx={{ mb: 0.25 }}>{formatCurrency(summary.total_reserved)}</LabelValue>
        <LabelValue label="Total del día" sx={{ mb: 0.25 }}>{formatCurrency(summary.total_day)}</LabelValue>
        <LabelValue label="Ganancia">{formatCurrency(summary.profit)}</LabelValue>
      </>
    );
  }

  if (filter === "managers") {
    const { user, handleOpenEditUser, handleOpenChangePassword } = props;
    const manager = store.manager;
    return (
      <>
        <LabelValue label="Administrador" sx={{ mb: isOwner(user) && manager ? 1 : 0 }}>
          {manager?.username || "-"}
        </LabelValue>
        {isOwner(user) && manager && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <CustomTooltip text="Editar usuario">
              <CustomButton onClick={() => handleOpenEditUser(manager.id)} startIcon={<EditOutlinedIcon />}>
                Editar
              </CustomButton>
            </CustomTooltip>
            <CustomTooltip text="Cambiar contraseña">
              <CustomButton onClick={() => handleOpenChangePassword(manager.id)} startIcon={<LockResetOutlinedIcon />}>
                Contraseña
              </CustomButton>
            </CustomTooltip>
          </Box>
        )}
      </>
    );
  }

  if (filter === "investment") {
    const { storeInvestments, handleShowInvestmentForStore } = props;
    const value = storeInvestments[store.id];
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        {value !== undefined
          ? <LabelValue label="Inversión">{formatCurrency(value)}</LabelValue>
          : (
            <CustomButton onClick={() => handleShowInvestmentForStore(store.id)}>
              Ver inversión
            </CustomButton>
          )}
      </Box>
    );
  }

  if (filter === "printer") {
    return (
      <LabelValue label="Impresora">
        {store.printer
          ? `${store.printer.brand} ${store.printer.model}`
          : <Box component="span" sx={{ color: "text.secondary", }}>Sin impresora configurada</Box>}
      </LabelValue>
    );
  }

  if (filter === "synced") {
    return (
      <LabelValue label="Catálogo">
        <Box
          component="span"
          className={store.has_all_products ? "text-success" : "text-danger"}
          sx={{ fontWeight: 600 }}
        >
          {store.has_all_products ? "Completo" : "Incompleto"}
        </Box>
      </LabelValue>
    );
  }

  if (filter === "actions") {
    const { user, handleResetStore } = props;
    if (!isOwner(user)) return null;
    return (
      <CustomTooltip text="Vaciar stock de la tienda">
        <CustomButton onClick={() => handleResetStore(store.id, store.name)} startIcon={<RestartAltOutlinedIcon />}>
          Vaciar stock
        </CustomButton>
      </CustomTooltip>
    );
  }

  // "all" (pagos): montos por método de pago + caja
  return (
    <>
      {PAYMENT_METHOD_OPTIONS.map(({ value, label }) => (
        <LabelValue key={value} label={label} sx={{ mb: 0.25 }}>{formatCurrency(summary[value])}</LabelValue>
      ))}
      <LabelValue label="Caja">{formatCurrency(summary.cash)}</LabelValue>
    </>
  );
};

/**
 * Tarjeta de una sucursal para la vista móvil de /tiendas/.
 * Toda la tarjeta abre la sucursal y muestra los datos del filtro activo.
 */
const StoreCard = ({ store, quickFilter, ...props }) => {
  const { user, handleSelectStore } = props;
  const isCurrent = store.id === user?.store_id;

  const handleKeyDown = (event) => {
    if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleSelectStore(store);
    }
  };

  return (
    <Paper
      tabIndex={0}
      aria-label={`Entrar a ${store.name}`}
      onClick={() => handleSelectStore(store)}
      onKeyDown={handleKeyDown}
      sx={{
        p: 2, height: "100%", cursor: "pointer",
        display: "flex", flexDirection: "column", gap: 1.25,
        bgcolor: isCurrent ? (theme) => alpha(theme.palette.primary.main, 0.05) : "background.paper",
        boxShadow: isCurrent ? (theme) => `inset 3px 0 0 ${theme.palette.accent.main}` : "none",
        transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: "action.hover" },
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>{store.name}</Typography>
        {isCurrent && <Typography variant="caption">Estás aquí</Typography>}
      </Box>

      <Divider />

      <Box onClick={stop} onKeyDown={stop} sx={{ flex: 1 }}>
        <CardBody filter={quickFilter} store={store} props={props} />
      </Box>

      <Typography variant="caption" sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", fontWeight: 500 }}>
        Entrar <ChevronRightRoundedIcon sx={{ fontSize: 16 }} />
      </Typography>
    </Paper>
  );
};

export default memo(StoreCard);
