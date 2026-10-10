import React, { memo } from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import LabelValue from "../../ui/LabelValue/LabelValue";
import { formatCurrency, formatNumber } from "../../../utils/currency";
import { isOwner } from "../../../constants/routeAccess";
import { PAYMENT_METHOD_OPTIONS } from "../../../constants";
import HomeIcon from "@mui/icons-material/Home";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

/** Punto de color del semáforo de ventas respecto al promedio. */
const SalesDot = ({ sold, averageSales }) => {
  const tone = sold > averageSales
    ? "success"
    : sold < averageSales * 0.8
      ? "danger"
      : "warning";
  return <span className={`status-dot status-dot--${tone}`}>●</span>;
};

/** Contenido de la tarjeta según el filtro rápido activo. */
const CardBody = ({ filter, store, props }) => {
  const summary = store.cash_summary || {};

  if (filter === "sales") {
    return (
      <>
        <LabelValue label="Vendido" sx={{ mb: 0.25 }}>{formatCurrency(summary.total_sold)}</LabelValue>
        <LabelValue label="Apartado" sx={{ mb: 0.25 }}>{formatCurrency(summary.total_reserved)}</LabelValue>
        <LabelValue label="Total del día" sx={{ mb: 0.25 }}>{formatCurrency(summary.total_day)}</LabelValue>
        <LabelValue label="Ventas realizadas" sx={{ mb: 0.25 }}>{formatNumber(summary.total_sales)}</LabelValue>
        <LabelValue label="Apartados realizados" sx={{ mb: 0.25 }}>{formatNumber(summary.reservations_created)}</LabelValue>
        <LabelValue label="Canceladas" sx={{ mb: 0.25 }}>{formatNumber(summary.canceled_sales)}</LabelValue>
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
              <CustomButton onClick={() => handleOpenEditUser(manager.id)} startIcon={<EditIcon />}>
                Editar
              </CustomButton>
            </CustomTooltip>
            <CustomTooltip text="Cambiar contraseña">
              <CustomButton onClick={() => handleOpenChangePassword(manager.id)} startIcon={<LockResetIcon />}>
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
            <CustomButton onClick={() => handleShowInvestmentForStore(store.id)} startIcon={<AttachMoneyIcon />}>
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
          : <Box component="span" sx={{ color: "text.secondary", fontStyle: "italic" }}>Sin impresora configurada</Box>}
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
        <CustomButton onClick={() => handleResetStore(store.id, store.name)} startIcon={<RestartAltIcon />}>
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
 * Muestra el nombre con el semáforo, los datos del filtro rápido activo y el botón de entrar.
 */
const StoreCard = ({ store, quickFilter, isStoreType, averageSales, enterTooltip, ...props }) => {
  const { user, handleSelectStore } = props;
  const isCurrent = store.id === user?.store_id;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2, borderRadius: 2, height: "100%",
        display: "flex", flexDirection: "column", gap: 1.25,
        border: "1px solid", borderColor: isCurrent ? "primary.main" : "divider",
        bgcolor: isCurrent ? "info.light" : "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isStoreType && <SalesDot sold={store.cash_summary?.total_day || 0} averageSales={averageSales} />}
        <Typography variant="h6" sx={{ fontWeight: isCurrent ? 700 : 600, fontSize: "1rem", lineHeight: 1.3 }}>
          {store.name}
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ flex: 1 }}>
        <CardBody filter={quickFilter} store={store} props={props} />
      </Box>

      <CustomButton onClick={() => handleSelectStore(store)} startIcon={<HomeIcon />} fullWidth>
        {enterTooltip}
      </CustomButton>
    </Paper>
  );
};

export default memo(StoreCard);
