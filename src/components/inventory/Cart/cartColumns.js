import React from "react";
import { TextField, Checkbox, IconButton } from "@mui/material";
import CustomButton from "../../ui/Button/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import ScaleIcon from "@mui/icons-material/Scale";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { MOVEMENT_TYPES } from "../../../constants";

const isKg = (row) => row.product?.unit === "KG";
const SALE_MODES_CYCLE = ["KG", "FRAC", "$"];
const getNextMode = (current) => {
  const idx = SALE_MODES_CYCLE.indexOf(current);
  return SALE_MODES_CYCLE[(idx + 1) % SALE_MODES_CYCLE.length];
};
const getStep = (row, mode) => {
  if (mode === "$") return 1;
  if (mode === "FRAC") return 0.1;
  return 1;
};
const getMin = (row, mode) => {
  if (mode === "$") return 1;
  if (mode === "FRAC") return 0.1;
  return 1;
};

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

export const getSaleColumns = (handleQuantityChangeToCart, handleRemoveFromCart, handleChangePrice, movementType, getAvailableStock, handleStockWarning, saleModes, setSaleModes) => [
  ...commonColumns2,
  {
    name: "Venta por",
    width: 100,
    selector: (row) => {
      const mode = isKg(row) ? (saleModes[row.id] || "KG") : "PZ";
      if (!isKg(row)) {
        const unitLabels = { PZ: "Pieza", CO: "Costal" };
        return <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{unitLabels[row.product?.unit] || "Pieza"}</span>;
      }

      const labels = { KG: "Kilo", FRAC: "Fracción", $: "Pesos" };
      const icons = { KG: <ScaleIcon sx={{ fontSize: 14, mr: 0.3 }} />, FRAC: <ScaleIcon sx={{ fontSize: 14, mr: 0.3 }} />, $: <AttachMoneyIcon sx={{ fontSize: 14, mr: 0.3 }} /> };
      const isActive = mode === "$" || mode === "FRAC";

      return (
        <IconButton
          size="small"
          onClick={() => setSaleModes((prev) => ({ ...prev, [row.id]: getNextMode(mode) }))}
          sx={{ 
            border: '1px solid', 
            borderColor: isActive ? 'primary.main' : 'divider',
            bgcolor: isActive ? 'primary.main' : 'transparent',
            color: isActive ? '#fff' : 'text.secondary',
            borderRadius: '8px',
            px: 1,
            width: 'auto', height: 28,
            fontSize: '0.7rem', fontWeight: 600,
            '&:hover': { bgcolor: isActive ? 'primary.dark' : 'action.hover' }
          }}
        >
          {icons[mode]}{labels[mode]}
        </IconButton>
      );
    },
  },
  {
    name: "Cantidad",
    width: 100,
    selector: (row) => {
      const mode = isKg(row) ? (saleModes[row.id] || "KG") : "PZ";
      const step = getStep(row, mode);
      const min = getMin(row, mode);

      if (mode === "$") {
        return <span style={{ fontSize: '0.85rem' }}>{(Math.round(row.quantity * 1000) / 1000)} kg</span>;
      }

      return (
        <TextField size="small" type="number" sx={{ width: 80 }}
          value={row.quantity}
          onChange={(e) => {
            const val = e.target.value;
            if (mode === "FRAC" && val.includes('.') && val.split('.')[1]?.length > 3) return;
            if (mode === "KG" && val.includes('.')) return;
            handleQuantityChangeToCart(e, row);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const newValue = Math.round((row.quantity + step) * 1000) / 1000;
              const availableStock = movementType === MOVEMENT_TYPES.ADD_STOCK ? Infinity : getAvailableStock(row.id, row.available_stock);
              if (newValue <= availableStock) {
                handleQuantityChangeToCart({ target: { value: newValue } }, row);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const newValue = Math.max(min, Math.round((row.quantity - step) * 1000) / 1000);
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          }}
          inputProps={{ min, step }}
        />
      );
    },
  },
  { name: "Stock", selector: (row) => row.available_stock },
  {
    name: "Precio",
    selector: (row) => `$${row.product_price.toFixed(2)}`,
  },
  {
    name: "Subtotal",
    width: 100,
    selector: (row) => {
      const mode = isKg(row) ? (saleModes[row.id] || "KG") : "PZ";
      if (mode === "$") {
        const pesoValue = Math.round(row.quantity * row.product_price * 10) / 10;
        return (
          <TextField size="small" type="number" sx={{ width: 80 }}
            value={pesoValue}
            onChange={(e) => handleQuantityChangeToCart(e, row)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const newValue = Math.round((pesoValue + 1) * 10) / 10;
                handleQuantityChangeToCart({ target: { value: newValue } }, row);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const newValue = Math.max(1, Math.round((pesoValue - 1) * 10) / 10);
                handleQuantityChangeToCart({ target: { value: newValue } }, row);
              }
            }}
            inputProps={{ min: 1, step: 1 }}
            InputProps={{ startAdornment: '$' }}
          />
        );
      }
      return `$${(row.product_price * row.quantity).toFixed(2)}`;
    },
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
          const step = getStep(row, "KG");
          if (e.key === "ArrowUp") {
            e.preventDefault();
            const newValue = Math.round((row.quantity + step) * 10) / 10;
            const availableStock = getAvailableStock(row.id, row.available_stock);
            if (newValue <= availableStock) {
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const min = getMin(row, "KG");
            const newValue = Math.max(min, Math.round((row.quantity - step) * 10) / 10);
            handleQuantityChangeToCart({ target: { value: newValue } }, row);
          }
        }}
        inputProps={{ min: getMin(row, "KG"), step: getStep(row, "KG") }}
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
          const step = getStep(row, "KG");
          if (e.key === "Enter") {
            e.preventDefault();
            searchInputRef?.current?.focus();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const newValue = Math.round((row.quantity + step) * 10) / 10;
            const availableStock = getAvailableStock(row.id, row.available_stock);
            if (newValue <= availableStock) {
              handleQuantityChangeToCart({ target: { value: newValue } }, row);
            }
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const min = getMin(row, "KG");
            const newValue = Math.max(min, Math.round((row.quantity - step) * 10) / 10);
            handleQuantityChangeToCart({ target: { value: newValue } }, row);
          }
        }}
        inputProps={{ min: getMin(row, "KG"), step: getStep(row, "KG") }}
      />
    ),
  },
  {
    name: "Stock General",
    cell: (row) => (
      <div>
        {row.stockOtherStores && row.stockOtherStores.length > 0 && (
          <ul style={{ paddingLeft: "1rem", margin: "0.5rem 0 0 0" }}>
            {row.stockOtherStores.map((s) => (
              <li key={s.store_id}>
                {s.store_name}: {s.available_stock}
              </li>
            ))}
          </ul>
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

export const getAddToStockColumns = (handleQuantityChangeToCart, handleRemoveFromCart, cart, searchInputRef, lastQtyRef) => [
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
          const step = getStep(row, "KG");
          if (e.key === "Enter") {
            e.preventDefault();
            searchInputRef?.current?.focus();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const newValue = Math.round((row.quantity + step) * 10) / 10;
            handleQuantityChangeToCart({ target: { value: newValue } }, row);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const min = getMin(row, "KG");
            const newValue = Math.max(min, Math.round((row.quantity - step) * 10) / 10);
            handleQuantityChangeToCart({ target: { value: newValue } }, row);
          }
        }}
        inputProps={{ min: getMin(row, "KG"), step: getStep(row, "KG") }}
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
