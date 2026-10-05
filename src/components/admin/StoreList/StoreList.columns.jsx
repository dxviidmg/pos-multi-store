import { Box } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { formatCurrency, formatNumber } from "../../../utils/currency";
import { isOwner } from "../../../constants/routeAccess";
import { PAYMENT_METHOD_OPTIONS } from "../../../constants";
import HomeIcon from "@mui/icons-material/Home";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Columnas visibles por filtro rápido (se respeta el orden de la definición)
const PAYMENT_LABELS = PAYMENT_METHOD_OPTIONS.map(({ label }) => label);
const PAYMENT_COLUMNS = ["Nombre", ...PAYMENT_LABELS, "Caja", "Entrar"];
const SALES_COLUMNS = ["Nombre", "Vendido", "Apartado", "Total del día", "Ventas realizadas", "Apartados realizados", "Canceladas", "Ganancia", "Entrar"];

const FILTER_COLUMNS = {
  sales: SALES_COLUMNS,
  investment: ["Nombre", "Obtener (Inversión)", "Inversión", "Entrar"],
  managers: ["Nombre", "Administrador", "Editar usuario", "Cambiar contraseña", "Entrar"],
  printer: ["Nombre", "Impresora", "Entrar"],
  actions: ["Nombre", "Vaciar stock", "Entrar"],
};

const STORAGE_FILTER_COLUMNS = {
  ...FILTER_COLUMNS,
  all: ["Nombre", "Entrar"],
};

const pickColumns = (columns, names = []) => columns.filter((col) => names.includes(col.name));

const fromSummary = (row) => row.cash_summary;
const fromRow = (row) => row;

const cashCol = (name, key, source = fromSummary) => ({
  name,
  selector: (row) => formatCurrency(source(row)?.[key]),
});

const countCol = (name, key, source = fromSummary) => ({
  name,
  selector: (row) => formatNumber(source(row)?.[key]),
});

const emptyCol = (name) => ({ name, selector: () => "" });

const catalogCol = {
  name: "Catálogo",
  cell: ({ has_all_products }) => (
    <Box
      component="span"
      className={has_all_products ? "text-success" : "text-danger"}
      sx={{ fontSize: "13px", fontWeight: 600 }}
    >
      {has_all_products ? "Completo" : "Incompleto"}
    </Box>
  ),
};

// Con "Catálogo incompleto" se muestra la columna de catálogo entre "Nombre" y "Entrar"
const withCatalog = (columns, catalogColumn) => [
  columns.find((col) => col.name === "Nombre"),
  catalogColumn,
  columns.find((col) => col.name === "Entrar"),
];

const getAmountColumns = (source) => [
  ...PAYMENT_METHOD_OPTIONS.map(({ value, label }) => cashCol(label, value, source)),
  cashCol("Vendido", "total_sold", source),
  cashCol("Apartado", "total_reserved", source),
  cashCol("Total del día", "total_day", source),
  countCol("Ventas realizadas", "total_sales", source),
  countCol("Apartados realizados", "reservations_created", source),
  countCol("Canceladas", "canceled_sales", source),
  cashCol("Ganancia", "profit", source),
  cashCol("Caja", "cash", source),
];

const getAdminColumns = ({ user, handleOpenEditUser, handleOpenChangePassword }) => [
  {
    name: "Administrador",
    selector: ({ manager }) => manager?.username || "-",
  },
  ...(isOwner(user)
    ? [
        {
          name: "Editar usuario",
          cell: (row) => row.manager?.username ? (
            <CustomTooltip text="Editar usuario">
              <CustomButton onClick={() => handleOpenEditUser(row.manager.id)}><EditIcon /></CustomButton>
            </CustomTooltip>
          ) : "-",
        },
        {
          name: "Cambiar contraseña",
          cell: (row) => row.manager?.username ? (
            <CustomTooltip text="Cambiar contraseña">
              <CustomButton onClick={() => handleOpenChangePassword(row.manager.id)}><LockResetIcon /></CustomButton>
            </CustomTooltip>
          ) : "-",
        },
      ]
    : []),
];

const getInvestmentColumns = ({ storeInvestments, handleShowInvestmentForStore }) => [
  {
    name: "Obtener (Inversión)",
    cell: (row) => (
      <CustomButton onClick={() => handleShowInvestmentForStore(row.id)} startIcon={<AttachMoneyIcon />} disabled={storeInvestments[row.id] !== undefined}>
        Ver
      </CustomButton>
    ),
  },
  {
    name: "Inversión",
    cell: (row) => storeInvestments[row.id] !== undefined
      ? <span>{formatCurrency(storeInvestments[row.id])}</span>
      : <span className="text-muted">Pendiente</span>,
  },
];

const getActionColumns = ({ user, handleSelectStore, handleResetStore, enterTooltip }) => [
  ...(isOwner(user)
    ? [
        {
          name: "Vaciar stock",
          cell: (row) => (
            <CustomTooltip text="Vaciar stock de la tienda">
              <CustomButton onClick={() => handleResetStore(row.id, row.name)}><RestartAltIcon /></CustomButton>
            </CustomTooltip>
          ),
        },
      ]
    : []),
  {
    name: "Entrar",
    cell: (row) => (
      <CustomTooltip text={enterTooltip}>
        <CustomButton onClick={() => handleSelectStore(row)}><HomeIcon /></CustomButton>
      </CustomTooltip>
    ),
  },
];

const getStoreNameColumn = ({ user, averageSales }) => ({
  name: "Nombre",
  cell: ({ name, id, cash_summary }) => {
    const sold = cash_summary?.total_day || 0;
    const isAboveAverage = sold > averageSales;
    const isBelowAverage = sold < averageSales * 0.8;
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isAboveAverage && <span className="status-dot status-dot--success">●</span>}
        {isBelowAverage && <span className="status-dot status-dot--danger">●</span>}
        {!isAboveAverage && !isBelowAverage && <span className="status-dot status-dot--warning">●</span>}
        <Box component="span" sx={{ fontWeight: id === user?.store_id ? "bold" : "normal" }}>{name}</Box>
      </Box>
    );
  },
});

const printerCol = {
  name: "Impresora",
  cell: ({ printer }) => printer
    ? <span>{printer.brand} {printer.model}</span>
    : <Box component="span" sx={{ color: "text.secondary", fontStyle: "italic" }}>Sin impresora configurada</Box>,
};

/** Columnas de tiendas según el filtro rápido. */
export const getStoreColumns = ({ quickFilter, hasDepartment, ...props }) => {
  const columns = [
    getStoreNameColumn(props),
    ...getAdminColumns(props),
    printerCol,
    ...getAmountColumns(fromSummary),
    ...getInvestmentColumns(props),
    ...getActionColumns({ ...props, enterTooltip: "Ingresar a la tienda" }),
  ];
  if (quickFilter === "synced") return withCatalog(columns, catalogCol);
  if (quickFilter === "all") return pickColumns(columns, hasDepartment ? SALES_COLUMNS : PAYMENT_COLUMNS);
  return pickColumns(columns, FILTER_COLUMNS[quickFilter]);
};

/** Columnas de almacenes según el filtro rápido. */
export const getStorageColumns = ({ quickFilter, ...props }) => {
  const columns = [
    { name: "Nombre", selector: ({ name }) => `${name}` },
    ...getAdminColumns(props),
    ...getInvestmentColumns(props),
    ...getActionColumns({ ...props, enterTooltip: "Ingresar al almacén" }),
  ];
  if (quickFilter === "synced") return withCatalog(columns, catalogCol);
  return pickColumns(columns, STORAGE_FILTER_COLUMNS[quickFilter]);
};

// La tabla de totales solo se muestra con los filtros de pagos, ventas, inversión y catálogo
const TOTAL_COLUMNS = [
  { name: "Nombre", selector: () => "TOTAL" },
  ...getAmountColumns(fromRow),
  emptyCol("Entrar"),
];

/** Columnas de la fila de totales (`totals` de la API) según el filtro rápido. */
export const getTotalColumns = ({ quickFilter, hasDepartment }) => {
  if (quickFilter === "synced") return withCatalog(TOTAL_COLUMNS, emptyCol("Catálogo"));
  if (quickFilter === "all") return pickColumns(TOTAL_COLUMNS, hasDepartment ? SALES_COLUMNS : PAYMENT_COLUMNS);
  return pickColumns(TOTAL_COLUMNS, FILTER_COLUMNS[quickFilter]);
};
