import React, { memo } from "react";
import { Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HistoryIcon from "@mui/icons-material/History";
import ChecklistIcon from "@mui/icons-material/Checklist";
import LabelValue from "../../ui/LabelValue/LabelValue";
import GridCardBase, { GridCardAction } from "../shared/GridCardBase";
import { formatCurrency } from "../../../utils/utils";
import { useUser } from "../../../context/UserContext";
import { isOwner, isSeller } from "../../../constants/routeAccess";

const LINE_SPACING = { mb: 0.25 };

/**
 * Tarjeta de producto para la vista de galería de /productos/.
 * Clic abre edición; acciones abajo (el vendedor no tiene acciones).
 */
const ProductGridCard = ({ product, onEdit, onPriceLogs, onStoreStock, onCameraPhoto }) => {
  const { user } = useUser();
  if (!product) return null;

  const owner = isOwner(user);

  return (
    <GridCardBase
      image={product.image}
      name={product.name}
      brandName={product.brand_name}
      onClick={() => onEdit?.(product)}
      actions={!isSeller(user) && (
        <>
          <GridCardAction text="Editar" onClick={() => onEdit?.(product)} Icon={EditIcon} />
          <GridCardAction text="Tomar foto" onClick={() => onCameraPhoto?.(product)} Icon={CameraAltIcon} />
          <GridCardAction text="Historial" onClick={() => onPriceLogs?.(product)} Icon={HistoryIcon} />
          {owner && (
            <GridCardAction text="Stock en tiendas" onClick={() => onStoreStock?.(product)} Icon={ChecklistIcon} />
          )}
        </>
      )}
    >
      <LabelValue label="Código" sx={LINE_SPACING}>{product.code || "—"}</LabelValue>
      {product.department_name && (
        <LabelValue label="Depto" sx={LINE_SPACING}>{product.department_name}</LabelValue>
      )}
      <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", fontWeight: 600, lineHeight: 1.4, mb: 0.25 }}>
        {formatCurrency(product.unit_price)}
      </Typography>
      {product.apply_wholesale && (
        <LabelValue label="May" sx={LINE_SPACING}>
          {formatCurrency(product.wholesale_price)} ({product.min_wholesale_quantity}+)
        </LabelValue>
      )}
      {owner && <LabelValue label="Stock">{product.stock}</LabelValue>}
    </GridCardBase>
  );
};

export default memo(ProductGridCard);
