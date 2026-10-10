import React, { memo } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import HistoryIcon from "@mui/icons-material/History";
import SendIcon from "@mui/icons-material/Send";
import LabelValue from "../../ui/LabelValue/LabelValue";
import GridCardBase, { GridCardAction } from "../shared/GridCardBase";
import { useUser } from "../../../context/UserContext";
import { isOwner, isSeller } from "../../../constants/routeAccess";

const LINE_SPACING = { mb: 0.25 };

/**
 * Tarjeta de store-product (inventario de tienda) para la vista de galería.
 * Clic abre ajuste de cantidad (owner) o historial de stock (admin); el vendedor no tiene acción.
 */
const StoreProductGridCard = ({ storeProduct, onAdjustStock, onLogs, onRequest }) => {
  const { user } = useUser();
  if (!storeProduct) return null;

  const product = storeProduct.product || {};
  const owner = isOwner(user);
  const seller = isSeller(user);
  const handleCardClick = owner
    ? () => onAdjustStock?.(storeProduct)
    : seller ? undefined : () => onLogs?.(storeProduct);

  return (
    <GridCardBase
      image={product.image}
      name={product.name}
      brandName={product.brand_name}
      onClick={handleCardClick}
      actions={
        <>
          {owner && (
            <GridCardAction text="Ajustar cantidad" onClick={() => onAdjustStock?.(storeProduct)} Icon={TuneIcon} />
          )}
          {!seller && (
            <GridCardAction text="Movimientos" onClick={() => onLogs?.(storeProduct)} Icon={HistoryIcon} />
          )}
          {!owner && (
            <GridCardAction text="Solicitar ajuste" onClick={() => onRequest?.(storeProduct)} Icon={SendIcon} />
          )}
        </>
      }
    >
      <LabelValue label="Código" sx={LINE_SPACING}>{product.code || "—"}</LabelValue>
      {product.department_name && (
        <LabelValue label="Depto" sx={LINE_SPACING}>{product.department_name}</LabelValue>
      )}
      <LabelValue label="Stock">
        {storeProduct.stock} {product.unit && `(${product.unit})`}
      </LabelValue>
    </GridCardBase>
  );
};

export default memo(StoreProductGridCard);
