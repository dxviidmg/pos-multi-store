import { Box } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { formatCurrency } from "../../../utils/utils";
import { chooseIcon } from "../../ui/Icons/Icons";
import HomeIcon from "@mui/icons-material/Home";
import PrintIcon from "@mui/icons-material/Print";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const alignTdStyles = {
  justifyContent: "flex-end",
  textAlign: "right",
};

const getCashValue = (cash_summary, key) =>
  formatCurrency(cash_summary?.[key] || 0);

const getCashValueTotal = (value) =>
  formatCurrency(value || 0);

export const getStoreColumns = ({ user, averageSales, storeInvestments, handleSelectStore, handleOpenEditUser, handleOpenChangePassword, handleShowInvestmentForStore, handleResetStore }) => [
  {
    name: "Nombre",
    cell: ({ name, id, cash_summary }) => {
      const vendido = cash_summary?.total_payment || 0;
      const isAboveAverage = vendido > averageSales;
      const isBelowAverage = vendido < averageSales * 0.8;
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAboveAverage && <span className="status-dot status-dot--success">●</span>}
          {isBelowAverage && <span className="status-dot status-dot--danger">●</span>}
          {!isAboveAverage && !isBelowAverage && <span className="status-dot status-dot--warning">●</span>}
          <span style={{ fontWeight: id === user?.store_id ? 'bold' : 'normal' }}>{name}</span>
        </Box>
      );
    },
  },
  {
    name: "Administrador",
    selector: ({ manager }) => manager?.username || "-",
  },
  {
    name: "Editar usuario",
    omit: user?.role !== "owner",
    cell: (row) => row.manager?.username ? (
      <CustomTooltip text="Editar usuario">
        <CustomButton size="small" onClick={() => handleOpenEditUser(row.manager.id)}><EditIcon /></CustomButton>
      </CustomTooltip>
    ) : "-",
  },
  {
    name: "Cambiar contraseña",
    omit: user?.role !== "owner",
    cell: (row) => row.manager?.username ? (
      <CustomTooltip text="Cambiar contraseña">
        <CustomButton size="small" onClick={() => handleOpenChangePassword(row.manager.id)}><LockResetIcon /></CustomButton>
      </CustomTooltip>
    ) : "-",
  },
  {
    name: "Impresora",
    cell: ({ printer }) => printer ? `${printer.brand} ${printer.model}` : "-",
  },
  {
    name: "Efectivo",
    style: alignTdStyles,
    selector: ({ cash_summary }) => getCashValue(cash_summary, "EF"),
  },
  {
    name: "Tarjeta",
    style: alignTdStyles,
    selector: ({ cash_summary }) => getCashValue(cash_summary, "TA"),
  },
  {
    name: "Transferencia",
    style: alignTdStyles,
    selector: ({ cash_summary }) => getCashValue(cash_summary, "TR"),
  },
  {
    name: "Vendido",
    style: alignTdStyles,
    selector: ({ cash_summary }) => getCashValue(cash_summary, "total_payment"),
  },
  {
    name: "Ventas realizadas",
    style: alignTdStyles,
    selector: ({ cash_summary }) => cash_summary?.total_sales?.toLocaleString() || "0",
  },
  {
    name: "Canceladas",
    style: alignTdStyles,
    selector: ({ cash_summary }) => cash_summary?.canceled_sales?.toLocaleString() || "0",
  },
  {
    name: "Distribuciones",
    style: alignTdStyles,
    selector: ({ cash_summary }) => cash_summary?.pending_distributions?.toLocaleString() || "0",
  },
  {
    name: "Traspasos",
    style: alignTdStyles,
    selector: ({ cash_summary }) => cash_summary?.pending_transfers?.toLocaleString() || "0",
  },
  {
    name: "Ganancia",
    style: alignTdStyles,
    selector: ({ cash_summary }) => getCashValue(cash_summary, "profit"),
  },
  {
    name: "Caja",
    style: alignTdStyles,
    selector: ({ cash_summary }) => getCashValue(cash_summary, "cash"),
  },
  {
    name: "Obtener (Inversión)",
    cell: (row) => (
      <CustomButton size="small" onClick={() => handleShowInvestmentForStore(row.id)} startIcon={<AttachMoneyIcon />} disabled={storeInvestments[row.id] !== undefined}>
        Ver
      </CustomButton>
    ),
  },
  {
    name: "Inversión",
    cell: (row) => storeInvestments[row.id] !== undefined
      ? <span>{getCashValueTotal(storeInvestments[row.id])}</span>
      : <span className="text-muted">Pendiente</span>,
  },
  {
    name: "Vaciar stock",
    cell: (row) => (
      <CustomTooltip text="Vaciar stock de la tienda">
        <CustomButton onClick={() => handleResetStore(row.id, row.name)} size="small"><RestartAltIcon /></CustomButton>
      </CustomTooltip>
    ),
  },
  {
    name: "Entrar",
    cell: (row) => (
      <CustomTooltip text="Ingresar a la tienda">
        <CustomButton onClick={() => handleSelectStore(row)}><HomeIcon /></CustomButton>
      </CustomTooltip>
    ),
  },
  {
    name: "Acciones",
    cell: (row) => (
      <>
        {chooseIcon(row.has_all_products)}
        {row.printer && <PrintIcon titleAccess={`${row.printer.brand} ${row.printer.model}`} />}
      </>
    ),
  },
];

export const getStorageColumns = ({ user, storeInvestments, handleSelectStore, handleOpenEditUser, handleOpenChangePassword, handleShowInvestmentForStore, handleResetStore }) => [
  {
    name: "Nombre",
    selector: ({ name }) => `${name}`,
  },
  {
    name: "Administrador",
    selector: ({ manager }) => manager?.username || "-",
  },
  {
    name: "Editar usuario",
    omit: user?.role !== "owner",
    cell: (row) => row.manager?.username ? (
      <CustomTooltip text="Editar usuario">
        <CustomButton size="small" onClick={() => handleOpenEditUser(row.manager.id)}><EditIcon /></CustomButton>
      </CustomTooltip>
    ) : "-",
  },
  {
    name: "Cambiar contraseña",
    omit: user?.role !== "owner",
    cell: (row) => row.manager?.username ? (
      <CustomTooltip text="Cambiar contraseña">
        <CustomButton size="small" onClick={() => handleOpenChangePassword(row.manager.id)}><LockResetIcon /></CustomButton>
      </CustomTooltip>
    ) : "-",
  },
  {
    name: "Pendientes",
    style: alignTdStyles,
    cell: ({ cash_summary }) => {
      const distributions = cash_summary?.pending_distributions?.toLocaleString() || "0";
      const transfers = cash_summary?.pending_transfers?.toLocaleString() || "0";
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div>Distribuciones: {distributions}</div>
          <div>Traspasos: {transfers}</div>
        </div>
      );
    },
  },
  {
    name: "Obtener (Inversión)",
    cell: (row) => (
      <CustomButton size="small" onClick={() => handleShowInvestmentForStore(row.id)} startIcon={<AttachMoneyIcon />} disabled={storeInvestments[row.id] !== undefined}>
        Ver
      </CustomButton>
    ),
  },
  {
    name: "Inversión",
    cell: (row) => storeInvestments[row.id] !== undefined
      ? <span>{getCashValueTotal(storeInvestments[row.id])}</span>
      : <span className="text-muted">Pendiente</span>,
  },
  {
    name: "Vaciar stock",
    cell: (row) => (
      <CustomTooltip text="Vaciar stock de la tienda">
        <CustomButton onClick={() => handleResetStore(row.id, row.name)} size="small"><RestartAltIcon /></CustomButton>
      </CustomTooltip>
    ),
  },
  {
    name: "Entrar",
    cell: (row) => (
      <CustomTooltip text="Ingresar al almacen">
        <CustomButton onClick={() => handleSelectStore(row)}><HomeIcon /></CustomButton>
      </CustomTooltip>
    ),
  },
  {
    name: "Acciones",
    cell: ({ has_all_products }) => <>{chooseIcon(has_all_products)}</>,
  },
];

export const getTotalColumns = ({ user, hasDepartment }) => [
  {
    name: "Nombre",
    selector: () => "TOTAL",
  },
  {
    name: "Administrador",
    selector: () => "",
  },
  {
    name: "Editar usuario",
    omit: user?.role !== "owner",
    selector: () => "",
  },
  {
    name: "Cambiar contraseña",
    omit: user?.role !== "owner",
    selector: () => "",
  },
  {
    name: "Impresora",
    selector: () => "",
  },
  {
    name: "Efectivo",
    style: alignTdStyles,
    selector: ({ paymentCash }) => getCashValueTotal(paymentCash),
  },
  {
    name: "Tarjeta",
    style: alignTdStyles,
    selector: ({ paymentCard }) => getCashValueTotal(paymentCard),
  },
  {
    name: "Transferencia",
    style: alignTdStyles,
    selector: ({ paymentTransfer }) => getCashValueTotal(paymentTransfer),
  },
  {
    name: "Vendido",
    style: alignTdStyles,
    selector: ({ totalPayment }) => getCashValueTotal(totalPayment),
  },
  {
    name: "Ventas realizadas",
    style: alignTdStyles,
    selector: ({ totalSales }) => totalSales,
  },
  {
    name: "Canceladas",
    style: alignTdStyles,
    selector: ({ canceledSales }) => canceledSales,
  },
  {
    name: "Distribuciones",
    style: alignTdStyles,
    selector: ({ distributions }) => distributions?.toLocaleString() || "0",
  },
  {
    name: "Traspasos",
    style: alignTdStyles,
    selector: ({ transfers }) => transfers?.toLocaleString() || "0",
  },
  {
    name: "Ganancia",
    style: alignTdStyles,
    selector: ({ profit }) => getCashValueTotal(profit),
  },
  {
    name: "Caja",
    style: alignTdStyles,
    selector: ({ cash }) => getCashValueTotal(cash),
  },
  {
    name: "Vaciar stock",
    selector: () => "",
  },
  {
    name: "Entrar",
    selector: () => "",
  },
  {
    name: "Acciones",
    selector: () => "",
  },
];

export const filterColumns = (allColumns, quickFilter, hasDepartment) => {
  if (quickFilter === "all") {
    return hasDepartment
      ? allColumns.filter(col => ["Nombre", "Vendido", "Ventas realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name))
      : allColumns.filter(col => ["Nombre", "Efectivo", "Tarjeta", "Transferencia", "Caja", "Entrar"].includes(col.name));
  }
  if (quickFilter === "sales") {
    return allColumns.filter(col => ["Nombre", "Vendido", "Ventas realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name));
  }
  if (quickFilter === "investment") {
    return allColumns.filter(col => ["Nombre", "Obtener (Inversión)", "Inversión", "Entrar"].includes(col.name));
  }
  if (quickFilter === "pending") {
    return allColumns.filter(col => ["Nombre", "Distribuciones", "Traspasos", "Entrar"].includes(col.name));
  }
  if (quickFilter === "managers") {
    return allColumns.filter(col => ["Nombre", "Administrador", "Editar usuario", "Cambiar contraseña", "Entrar"].includes(col.name));
  }
  if (quickFilter === "printer") {
    return allColumns.filter(col => ["Nombre", "Impresora", "Entrar"].includes(col.name));
  }
  if (quickFilter === "synced") {
    return [
      allColumns.find(col => col.name === "Nombre"),
      {
        name: "Catálogo",
        cell: ({ has_all_products }) => (
          <span className={has_all_products ? "text-success" : "text-danger"} style={{ fontSize: '13px', fontWeight: 600 }}>
            {has_all_products ? "Completo" : "Incompleto"}
          </span>
        ),
      },
      allColumns.find(col => col.name === "Entrar"),
    ];
  }
  if (quickFilter === "actions") {
    return allColumns.filter(col => ["Nombre", "Vaciar stock", "Entrar"].includes(col.name));
  }
  return allColumns;
};

export const filterStorageColumns = (allColumns, quickFilter) => {
  if (quickFilter === "all") {
    return allColumns.filter(col => ["Nombre", "Entrar"].includes(col.name));
  }
  if (quickFilter === "pending") {
    return allColumns.filter(col => ["Nombre", "Pendientes", "Entrar"].includes(col.name));
  }
  if (quickFilter === "managers") {
    return allColumns.filter(col => ["Nombre", "Administrador", "Editar usuario", "Cambiar contraseña", "Entrar"].includes(col.name));
  }
  if (quickFilter === "investment") {
    return allColumns.filter(col => ["Nombre", "Obtener (Inversión)", "Inversión", "Entrar"].includes(col.name));
  }
  if (quickFilter === "synced") {
    return [
      allColumns.find(col => col.name === "Nombre"),
      {
        name: "Catálogo",
        cell: ({ has_all_products }) => (
          <span className={has_all_products ? "text-success" : "text-danger"} style={{ fontSize: '13px', fontWeight: 600 }}>
            {has_all_products ? "Completo" : "Incompleto"}
          </span>
        ),
      },
      allColumns.find(col => col.name === "Entrar"),
    ];
  }
  if (quickFilter === "actions") {
    return allColumns.filter(col => ["Nombre", "Vaciar stock", "Entrar"].includes(col.name));
  }
  return allColumns;
};

export const filterTotalColumns = (allColumns, quickFilter, hasDepartment) => {
  if (quickFilter === "all") {
    return hasDepartment
      ? allColumns.filter(col => ["Nombre", "Vendido", "Ventas realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name))
      : allColumns.filter(col => ["Nombre", "Efectivo", "Tarjeta", "Transferencia", "Caja", "Entrar"].includes(col.name));
  }
  if (quickFilter === "sales") {
    return allColumns.filter(col => ["Nombre", "Vendido", "Ventas realizadas", "Canceladas", "Ganancia", "Entrar"].includes(col.name));
  }
  if (quickFilter === "investment") {
    return allColumns.filter(col => ["Nombre", "Obtener (Inversión)", "Inversión", "Entrar"].includes(col.name));
  }
  if (quickFilter === "pending") {
    return allColumns.filter(col => ["Nombre", "Distribuciones", "Traspasos", "Entrar"].includes(col.name));
  }
  if (quickFilter === "managers") {
    return allColumns.filter(col => ["Nombre", "Administrador", "Editar usuario", "Cambiar contraseña", "Entrar"].includes(col.name));
  }
  if (quickFilter === "printer") {
    return allColumns.filter(col => ["Nombre", "Impresora", "Entrar"].includes(col.name));
  }
  if (quickFilter === "synced") {
    return [
      allColumns.find(col => col.name === "Nombre"),
      { name: "Catálogo", selector: () => "" },
      allColumns.find(col => col.name === "Entrar"),
    ];
  }
  if (quickFilter === "actions") {
    return allColumns.filter(col => ["Nombre", "Vaciar stock", "Entrar"].includes(col.name));
  }
  return allColumns;
};
