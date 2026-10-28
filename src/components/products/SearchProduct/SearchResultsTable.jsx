import React from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import CustomButton from "../../ui/Button/Button";
import CustomTooltip from "../../ui/Tooltip";
import { formatCurrency } from "../../../utils/currency";
import { MOVEMENT_TYPES } from "../../../constants";

const renderPrices = ({ product: { prices } }) =>
  prices.apply_wholesale ? (
    <>
      Men: {formatCurrency(prices.unit_price)}
      <br />
      May: {formatCurrency(prices.wholesale_price)} ({prices.min_wholesale_quantity}+)
    </>
  ) : (
    formatCurrency(prices.unit_price)
  );

const ResultActions = ({ row, movementType, allowTransfer, onAdd, onOpenStock }) => (
  <>
    <CustomTooltip text="Agregar al carrito">
      <CustomButton
        onClick={() => onAdd(row)}
        disabled={movementType === MOVEMENT_TYPES.SALE && row.available_stock === 0}
      >
        <AddIcon />
      </CustomButton>
    </CustomTooltip>

    {allowTransfer && (
      <CustomTooltip text="Ver stock en todas las tiendas">
        <CustomButton onClick={() => onOpenStock({ ...row, onlyRead: true })}>
          <InventoryIcon />
        </CustomButton>
      </CustomTooltip>
    )}

    <CustomTooltip text="Ver imagen del producto">
      <CustomButton onClick={() => onOpenStock({ ...row, showImage: true })} disabled={!row.product.image}>
        <RemoveRedEyeIcon />
      </CustomButton>
    </CustomTooltip>
  </>
);

// Móvil: cada resultado es una fila de lista con sus acciones debajo
const ResultsList = ({ data, ...actionProps }) => (
  <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
    {data.map((row) => (
      <Box key={row.id} sx={{ py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle2" sx={{ fontSize: "0.9375rem", fontWeight: 600, lineHeight: 1.3 }}>
          {row.product.name}
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: "text.secondary" }}>
          {row.product.code} · {row.product.brand_name} · Stock {row.available_stock}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>{renderPrices(row)}</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <ResultActions row={row} {...actionProps} />
        </Box>
      </Box>
    ))}
  </Box>
);

/**
 * Resultados de la búsqueda por código o nombre con acciones: agregar al carrito,
 * ver stock en otras tiendas (multi-sucursal) y ver imagen.
 */
const SearchResultsTable = ({ isMobile, data, ...actionProps }) => {
  if (isMobile) return <ResultsList data={data} {...actionProps} />;

  return (
    <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
      <SimpleTable
        noDataComponent="Sin resultados"
        data={data}
        columns={[
          { name: "Código", selector: (row) => row.product.code },
          { name: "Marca", selector: (row) => row.product.brand_name },
          { name: "Nombre", selector: (row) => row.product.name },
          { name: "Stock", selector: (row) => row.available_stock },
          { name: "Precios", cell: renderPrices },
          {
            name: "Acciones",
            width: 180,
            cell: (row) => <ResultActions row={row} {...actionProps} />,
          },
        ]}
      />
    </Box>
  );
};

export default SearchResultsTable;
