import { Box, ButtonBase } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { formatCurrency } from "../../../utils/currency";
import { isOwner } from "../../../constants/routeAccess";
import { PAYMENT_METHOD_OPTIONS } from "../../../constants";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

// Columnas visibles por filtro rápido (se respeta el orden de la definición)
const PAYMENT_LABELS = PAYMENT_METHOD_OPTIONS.map(({ label }) => label);
const PAYMENT_COLUMNS = ["Nombre", ...PAYMENT_LABELS, "Caja", "Entrar"];
const SALES_COLUMNS = ["Nombre", "Vendido", "Apartado", "Total del día", "Ganancia", "Entrar"];

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

const cashCol = (name, key) => ({
  name,
  selector: (row) => formatCurrency(row.cash_summary?.[key]),
});

const EnterButton = ({ tooltip, onClick }) => (
  <CustomTooltip text={tooltip}>
    <ButtonBase
      onClick={onClick}
      aria-label={tooltip}
      sx={{
        "&&&": { width: 30, height: 30, minWidth: 30, padding: 0, borderRadius: "8px", "& .MuiSvgIcon-root": { fontSize: 18 } },
        bgcolor: "tableHead.main", color: "common.white", transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: "primary.dark" },
        "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
      }}
    >
      <HomeOutlinedIcon />
    </ButtonBase>
  </CustomTooltip>
);

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

const getAmountColumns = () => [
  ...PAYMENT_METHOD_OPTIONS.map(({ value, label }) => cashCol(label, value)),
  cashCol("Vendido", "total_sold"),
  cashCol("Apartado", "total_reserved"),
  cashCol("Total del día", "total_day"),
  cashCol("Ganancia", "profit"),
  cashCol("Caja", "cash"),
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
              <CustomButton onClick={() => handleOpenEditUser(row.manager.id)}><EditOutlinedIcon /></CustomButton>
            </CustomTooltip>
          ) : "-",
        },
        {
          name: "Cambiar contraseña",
          cell: (row) => row.manager?.username ? (
            <CustomTooltip text="Cambiar contraseña">
              <CustomButton onClick={() => handleOpenChangePassword(row.manager.id)}><LockResetOutlinedIcon /></CustomButton>
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
      <CustomButton onClick={() => handleShowInvestmentForStore(row.id)} disabled={storeInvestments[row.id] !== undefined}>
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
              <CustomButton onClick={() => handleResetStore(row.id, row.name)}><RestartAltOutlinedIcon /></CustomButton>
            </CustomTooltip>
          ),
        },
      ]
    : []),
  {
    name: "Entrar",
    cell: (row) => <EnterButton tooltip={enterTooltip} onClick={() => handleSelectStore(row)} />,
  },
];

const nameCell = ({ name, id }, { user }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
    <Box component="span" sx={{ fontWeight: 600 }}>{name}</Box>
    {id === user?.store_id && <Box component="span" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Estás aquí</Box>}
  </Box>
);

const getStoreNameColumn = (props) => ({
  name: "Nombre",
  cell: (row) => nameCell(row, props),
});

const printerCol = {
  name: "Impresora",
  cell: ({ printer }) => printer
    ? <span>{printer.brand} {printer.model}</span>
    : <Box component="span" sx={{ color: "text.secondary" }}>Sin impresora configurada</Box>,
};

/** Columnas de tiendas según el filtro rápido. */
export const getStoreColumns = ({ quickFilter, hasDepartment, ...props }) => {
  const columns = [
    getStoreNameColumn(props),
    ...getAdminColumns(props),
    printerCol,
    ...getAmountColumns(),
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
    getStoreNameColumn(props),
    ...getAdminColumns(props),
    ...getInvestmentColumns(props),
    ...getActionColumns({ ...props, enterTooltip: "Ingresar al almacén" }),
  ];
  if (quickFilter === "synced") return withCatalog(columns, catalogCol);
  return pickColumns(columns, STORAGE_FILTER_COLUMNS[quickFilter]);
};
