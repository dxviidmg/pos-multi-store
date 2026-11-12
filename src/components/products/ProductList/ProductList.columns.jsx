import React from "react";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import ChecklistIcon from "@mui/icons-material/Checklist";
import HistoryIcon from "@mui/icons-material/History";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { formatCurrency } from "../../../utils/utils";

/**
 * Columnas de la tabla de /productos/. Stock solo para el dueño; acciones ocultas al vendedor.
 */
export const getProductColumns = ({ owner, seller, onEdit, onCameraPhoto, onPriceLogs, onStoreStock }) => [
  { name: "Código", selector: (row) => row.code },
  { name: "Marca", selector: (row) => row.brand_name },
  { name: "Departamento", selector: (row) => row.department_name },
  { name: "Nombre", selector: (row) => row.name },
  ...(owner ? [{ name: "Stock", selector: (row) => row.stock }] : []),
  {
    name: "Precios",
    cell: (row) => (
      row.apply_wholesale
        ? <>Men: {formatCurrency(row.unit_price)}<br />May: {formatCurrency(row.wholesale_price)} ({row.min_wholesale_quantity}+)</>
        : formatCurrency(row.unit_price)
    ),
  },
  ...(!seller ? [{
    name: "Acciones",
    width: 220,
    cell: (row) => (
      <>
        <CustomTooltip text="Editar producto">
          <CustomButton onClick={() => onEdit(row)}>
            <EditIcon />
          </CustomButton>
        </CustomTooltip>
        <CustomTooltip text="Tomar foto">
          <CustomButton onClick={() => onCameraPhoto(row)}>
            <CameraAltIcon />
          </CustomButton>
        </CustomTooltip>
        <CustomTooltip text="Historial de precios">
          <CustomButton onClick={() => onPriceLogs(row)}>
            <HistoryIcon />
          </CustomButton>
        </CustomTooltip>
        {owner && (
          <CustomTooltip text="Mostrar stock en todas las tiendas y almacenes">
            <CustomButton onClick={() => onStoreStock(row)}>
              <ChecklistIcon />
            </CustomButton>
          </CustomTooltip>
        )}
      </>
    ),
  }] : []),
];
