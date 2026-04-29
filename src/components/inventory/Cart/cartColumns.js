import React from "react";
import { TextField, Checkbox } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CalculateIcon from "@mui/icons-material/Calculate";

const commonColumns = [
  { name: "Código", field: "code", selector: (row) => row.product.code },
  {
    name: "Marca",
    field: "brand",
    selector: (row) => row.product.brand_name,
  },
  {
    name: "Nombre",
    field: "name",
    selector: (row) => row.product.name,
    renderCell: (params) => (
      <div className="cell-wrap">
        {params.row.product.name}
      </div>
    ),
  },
  { name: "Stock", field: "stock", selector: (row) => row.available_stock },
];

const commonColumns2 = [
  { name: "Código", field: "code", selector: (row) => row.product.code, width: 100 },
  {
    name: "Marca",
    field: "brand",
    selector: (row) => row.product.brand_name,
    width: 100,
  },
  {
    name: "Nombre",
    field: "name",
    selector: (row) => row.product.name,
    renderCell: (params) => (
      <div className="cell-wrap">
        {params.row.product.name}
      </div>
    ),
  },
];

export const getSaleColumns = (handleQuantityChangeToCart, handleRemoveFromCart, handleChangePrice, movementType, getAvailableStock) => [
  ...commonColumns2,
  {
    name: "Cantidad",
    width: 100,
    selector: (row) => (
      <TextField size="small" type="number" sx={{ width: 80 }}
        value={row.quantity}
        onChange={(e) => handleQuantityChangeToCart(e, row)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            const newValue = row.quantity + 1;
            const availableStock = movementType === "agregar" ? Infinity : getAvailableStock(row.id, row.available_stock);
            if (newValue <= availableStock) {
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const newValue = Math.max(1, row.quantity - 1);
            handleQuantityChangeToCart({ target: { value: newValue } }, row);
          }
        }}
        min="1"
        max={row.available_stock}
      />
    ),
  },
  { name: "Stock", selector: (row) => row.available_stock },
  { name: "Precio", selector: (row) => `$${row.product_price.toFixed(2)}` },
  {
    name: "Subtotal",
    selector: (row) => `$${(row.product_price * row.quantity).toFixed(2)}`,
  },
  {
    name: "Aplicar mayoreo",
    selector: (row) => (
      <Checkbox size="small"
        type="switch"
        id="custom-switch"
        checked={row.product_price === row.product.prices.wholesale_price}
        onClick={() => handleChangePrice(row)}
        disabled={!row.product.prices.wholesale_price}
      />
    ),
  },
  {
    name: "Borrar",
    selector: (row) => (
      <CustomButton onClick={() => handleRemoveFromCart(row)}>
        <DeleteIcon />
      </CustomButton>
    ),
  },
];

export const getTransferColumns = (handleQuantityChangeToCart, handleRemoveFromCart, getAvailableStock) => [
  { name: "Código", selector: (row) => row.product.code },
  {
    name: "Marca",
    selector: (row) => row.product.brand_name,
  },
  {
    name: "Nombre",
    selector: (row) => row.product.name,
    renderCell: (params) => (
      <div className="cell-wrap">
        {params.row.product.name}
      </div>
    ),
  },
  { name: "Stock disponible", selector: (row) => row.available_stock },
  { name: "Stock apartado", selector: (row) => row.reserved_stock },
  { name: "Stock total", selector: (row) => row.available_stock + row.reserved_stock },
  {
    name: "Cantidad",
    width: 100,
    selector: (row) => (
      <TextField size="small" type="number" sx={{ width: 80 }}
        value={row.quantity}
        onChange={(e) => handleQuantityChangeToCart(e, row)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            const newValue = row.quantity + 1;
            const availableStock = getAvailableStock(row.id, row.available_stock);
            if (newValue <= availableStock) {
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const newValue = Math.max(1, row.quantity - 1);
            handleQuantityChangeToCart({ target: { value: newValue } }, row);
          }
        }}
        min="1"
        max={row.available_stock}
      />
    ),
  },
  {
    name: "Borrar",
    selector: (row) => (
      <CustomButton onClick={() => handleRemoveFromCart(row)}>
        <DeleteIcon />
      </CustomButton>
    ),
  },
];

export const getDistributionColumns = (handleQuantityChangeToCart, handleRemoveFromCart, handleStockOtherStores, getAvailableStock, cart, searchInputRef, lastQtyRef) => [
  ...commonColumns,
  {
    name: "Cantidad",
    width: 100,
    selector: (row, index) => (
      <TextField size="small" type="number" sx={{ width: 80 }}
        inputRef={index === cart.length - 1 ? lastQtyRef : undefined}
        value={row.quantity}
        onChange={(e) => handleQuantityChangeToCart(e, row)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            searchInputRef?.current?.focus();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const newValue = row.quantity + 1;
            const availableStock = getAvailableStock(row.id, row.available_stock);
            if (newValue <= availableStock) {
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const newValue = Math.max(1, row.quantity - 1);
            handleQuantityChangeToCart({ target: { value: newValue } }, row);
          }
        }}
        min="1"
        max={row.available_stock}
      />
    ),
  },
  {
    name: "Stock General",
    cell: (row) => (
      <div>
        {row.stockOtherStores && row.stockOtherStores.length > 0 ? (
          <ul style={{ paddingLeft: "1rem", margin: "0.5rem 0 0 0" }}>
            {row.stockOtherStores.map((s) => (
              <li key={s.store_id}>
                {s.store_name}: {s.available_stock}
              </li>
            ))}
          </ul>
        ) : (
          <CustomButton onClick={() => handleStockOtherStores(row)} startIcon={<CalculateIcon />}>
            Contar
          </CustomButton>
        )}
      </div>
    ),
  },
  {
    name: "Borrar",
    selector: (row) => (
      <CustomButton onClick={() => handleRemoveFromCart(row)}>
        <DeleteIcon />
      </CustomButton>
    ),
  },
];

export const getAddToStockColumns = (handleQuantityChangeToCart, handleRemoveFromCart) => [
  ...commonColumns,
  {
    name: "Cantidad",
    width: 100,
    selector: (row) => (
      <TextField size="small" type="number" sx={{ width: 80 }}
        value={row.quantity}
        onChange={(e) => handleQuantityChangeToCart(e, row)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            const newValue = row.quantity + 1;
            handleQuantityChangeToCart({ target: { value: newValue } }, row);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const newValue = Math.max(1, row.quantity - 1);
            handleQuantityChangeToCart({ target: { value: newValue } }, row);
          }
        }}
        min="1"
      />
    ),
  },
  {
    name: "Borrar",
    selector: (row) => (
      <CustomButton onClick={() => handleRemoveFromCart(row)}>
        <DeleteIcon />
      </CustomButton>
    ),
  },
];
