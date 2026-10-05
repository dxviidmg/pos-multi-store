import React from "react";
import { Box, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "../../ui/Button/Button";
import { MOVEMENT_TYPES } from "../../../constants";
import { formatCurrency } from "../../../utils/currency";
import QuantityInput from "./QuantityInput";
import SaleModeButton from "./SaleModeButton";
import {
  QUANTITY_MODES,
  formatWeightedQuantity,
  getQuantityMode,
  getUnitLabel,
  isWeightedItem,
} from "./quantityRules";

const QUANTITY_INPUT_SX = { width: 80 };

const unitStock = (value, row) => `${value} ${row.product?.unit || "PZ"}`;

const codeColumn = { name: "Código", field: "code", selector: (row) => row.product.code };
const brandColumn = { name: "Marca", field: "brand", selector: (row) => row.product.brand_name };
const nameColumn = { name: "Nombre", field: "name", selector: (row) => row.product.name };

const commonColumns = [
  codeColumn,
  brandColumn,
  nameColumn,
  { name: "Stock", field: "stock", selector: (row) => row.available_stock },
];

const removeColumn = (onRemove) => ({
  name: "Quitar",
  selector: (row) => (
    <CustomButton onClick={() => onRemove(row)}>
      <DeleteIcon />
    </CustomButton>
  ),
});

/**
 * Columna "Cantidad" de traspaso, distribución y agregar inventario.
 * En distribución y agregar, el último input recibe `lastQtyRef` y Enter regresa a la búsqueda.
 */
const stockQuantityColumn = (movementType, ctx, { focusable = false } = {}) => ({
  name: "Cantidad",
  width: 100,
  selector: (row, index) => (
    <QuantityInput
      item={row}
      mode={getQuantityMode(row, movementType, ctx.saleModes)}
      onChange={ctx.onQuantityChange}
      maxQuantity={ctx.getMaxQuantity(row)}
      sx={QUANTITY_INPUT_SX}
      {...(focusable && {
        inputRef: index === ctx.cartLength - 1 ? ctx.lastQtyRef : undefined,
        onEnter: () => ctx.searchInputRef?.current?.focus(),
      })}
    />
  ),
});

const getSaleColumns = (movementType, ctx) => [
  { ...codeColumn, width: 100 },
  { ...brandColumn, width: 100 },
  nameColumn,
  {
    name: "Venta por",
    width: 100,
    selector: (row) => {
      if (!isWeightedItem(row)) {
        return <Box component="span" sx={{ fontSize: "0.8rem", fontWeight: 600 }}>{getUnitLabel(row)}</Box>;
      }
      return <SaleModeButton item={row} mode={getQuantityMode(row, movementType, ctx.saleModes)} onToggle={ctx.onToggleSaleMode} />;
    },
  },
  {
    name: "Cantidad",
    width: 100,
    selector: (row) => {
      const mode = getQuantityMode(row, movementType, ctx.saleModes);
      if (mode === QUANTITY_MODES.AMOUNT) {
        return <Box component="span" sx={{ fontSize: "0.85rem" }}>{formatWeightedQuantity(row)}</Box>;
      }
      return (
        <QuantityInput
          item={row}
          mode={mode}
          onChange={ctx.onQuantityChange}
          maxQuantity={ctx.getMaxQuantity(row)}
          sx={QUANTITY_INPUT_SX}
        />
      );
    },
  },
  { name: "Stock", selector: (row) => unitStock(row.available_stock, row) },
  { name: "Precio", selector: (row) => formatCurrency(row.product_price) },
  {
    name: "Subtotal",
    width: 100,
    selector: (row) => {
      const mode = getQuantityMode(row, movementType, ctx.saleModes);
      if (mode !== QUANTITY_MODES.AMOUNT) return formatCurrency(row.product_price * row.quantity);
      return (
        <QuantityInput
          item={row}
          mode={mode}
          onChange={ctx.onQuantityChange}
          maxQuantity={ctx.getMaxQuantity(row)}
          sx={QUANTITY_INPUT_SX}
        />
      );
    },
  },
  {
    name: "Aplicar mayoreo",
    selector: (row) => (
      <Checkbox
        size="small"
        checked={row.product_price === row.product.prices.wholesale_price}
        onClick={() => ctx.onChangePrice(row)}
        disabled={!row.product.prices.wholesale_price}
      />
    ),
  },
  removeColumn(ctx.onRemove),
];

const getTransferColumns = (movementType, ctx) => [
  { name: "Código", selector: (row) => row.product.code },
  { name: "Marca", selector: (row) => row.product.brand_name },
  { name: "Nombre", selector: (row) => row.product.name },
  { name: "Stock disponible", selector: (row) => unitStock(row.available_stock, row) },
  { name: "Stock apartado", selector: (row) => unitStock(row.reserved_stock, row) },
  { name: "Stock total", selector: (row) => unitStock(row.available_stock + row.reserved_stock, row) },
  stockQuantityColumn(movementType, ctx),
  removeColumn(ctx.onRemove),
];

const getDistributionColumns = (movementType, ctx) => [
  ...commonColumns,
  stockQuantityColumn(movementType, ctx, { focusable: true }),
  {
    name: "Stock general",
    cell: (row) => (
      <div>
        {row.stockOtherStores?.length > 0 && (
          <Box component="ul" sx={{ pl: "1rem", m: "0.5rem 0 0 0" }}>
            {row.stockOtherStores.map((s) => (
              <li key={s.store_id}>
                {s.store_name}: {s.available_stock}
              </li>
            ))}
          </Box>
        )}
      </div>
    ),
  },
  removeColumn(ctx.onRemove),
];

const getAddToStockColumns = (movementType, ctx) => [
  ...commonColumns,
  stockQuantityColumn(movementType, ctx, { focusable: true }),
  removeColumn(ctx.onRemove),
];

const COLUMN_BUILDERS = {
  [MOVEMENT_TYPES.SALE]: getSaleColumns,
  [MOVEMENT_TYPES.RESERVATION]: getSaleColumns,
  [MOVEMENT_TYPES.TRANSFER]: getTransferColumns,
  [MOVEMENT_TYPES.DISTRIBUTION]: getDistributionColumns,
  [MOVEMENT_TYPES.ADD_STOCK]: getAddToStockColumns,
};

/**
 * Columnas de la tabla del carrito según el tipo de movimiento.
 *
 * `ctx`: { saleModes, onToggleSaleMode(item), onQuantityChange(item, text, mode), getMaxQuantity(item),
 *          onChangePrice(item), onRemove(item), cartLength, lastQtyRef, searchInputRef }
 */
export const getCartColumns = (movementType, ctx) => {
  const build = COLUMN_BUILDERS[movementType];
  return build ? build(movementType, ctx) : commonColumns;
};
