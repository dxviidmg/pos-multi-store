import React, { memo } from "react";
import { Box, Checkbox, FormControlLabel, Grid, IconButton, Typography } from "@mui/material";
import { TextField } from "../../ui/Field/Field";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTooltip from "../../ui/Tooltip";
import LabelValue from "../../ui/LabelValue/LabelValue";
import { formatCurrency } from "../../../utils/currency";
import noPhotoImage from "../../../assets/images/noPhoto.webp";
import QuantityInput from "./QuantityInput";
import SaleModeButton from "./SaleModeButton";
import { QUANTITY_MODES, allowsSaleModes, getUnitLabel, isWeightedItem } from "./quantityRules";

const { KG, FRACTION, AMOUNT, STOCK } = QUANTITY_MODES;

const isLiter = (item) => item.product?.unit === "LT";

// Etiqueta del input de cantidad: corta en la tarjeta, completa en móvil
const getQuantityLabel = (item, mode, variant) => {
  const short = variant === "card";
  if (mode === AMOUNT) return short ? "Monto" : "Monto ($)";
  if (mode === FRACTION) return short ? "Frac" : "Fracción";
  if (mode === KG || mode === STOCK) {
    if (short) return isLiter(item) ? "Lt" : "Kg";
    return isLiter(item) ? "Litros" : "Kilos";
  }
  return short ? "Cant" : "Cantidad";
};

const CARD_LABEL_SX = { display: "block", mb: 0.5, fontWeight: 600, fontSize: "0.6rem", textTransform: "uppercase" };
const MOBILE_LABEL_SX = { display: "block", mb: 0.5, fontWeight: 600 };
const CARD_INPUT_SX = { "& input": { fontSize: "0.75rem", py: 0.4, textAlign: "center" } };
const CARD_WHOLESALE_SX = { fontSize: "0.65rem", m: 0, "& .MuiTypography-root": { fontSize: "0.65rem" } };
const MOBILE_REMOVE_SX = { width: 32, height: 32, flexShrink: 0, borderRadius: 1, bgcolor: "primary.main", color: "common.white", "&:hover": { bgcolor: "primary.dark" } };
const MOBILE_ROW_ITEM_SX = { py: 1.5, borderBottom: "1px solid", borderColor: "divider" };
const MOBILE_NAME_SX = {
  fontSize: "0.9375rem", fontWeight: 600, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
};
const MOBILE_ROW_SX = { display: "grid", gridTemplateColumns: "minmax(96px, 1.2fr) 1fr 1fr", gap: 1.5, alignItems: "start", mt: 1.25 };
const MOBILE_VALUE_SX = { display: "flex", alignItems: "center", minHeight: 40, fontSize: "1rem", fontWeight: 600 };
const MOBILE_FOOTER_SX = { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1, mt: 1, pt: 0.5, borderTop: "1px solid", borderColor: "divider" };

/**
 * Producto del carrito como tarjeta: `variant="card"` (cuadrícula de escritorio) o `"mobile"` (lista en móvil).
 * Usa las mismas reglas de cantidad que la tabla (`QuantityInput`).
 */
const CartItemCard = ({
  item,
  variant,
  mode,
  movementType,
  maxQuantity,
  onQuantityChange,
  onToggleSaleMode,
  onChangePrice,
  onRemove,
}) => {
  const isCard = variant === "card";
  const saleModes = allowsSaleModes(movementType);
  const weighted = isWeightedItem(item);
  const { prices } = item.product;
  const subtotal = formatCurrency(item.quantity * item.product_price);
  const showWholesale = saleModes && !!prices.wholesale_price;

  const removeButton = (
    <CustomTooltip text="Quitar" position="top">
      <IconButton
        size="small"
        onClick={() => onRemove(item)}
        aria-label="Quitar"
        sx={isCard ? { color: "error.main", flexShrink: 0, width: 32, height: 32 } : MOBILE_REMOVE_SX}
      >
        <DeleteIcon {...(isCard ? { sx: { fontSize: "1rem" } } : { fontSize: "small" })} />
      </IconButton>
    </CustomTooltip>
  );

  const quantityField = (
    <>
      <Typography variant="caption" sx={isCard ? CARD_LABEL_SX : MOBILE_LABEL_SX}>
        {getQuantityLabel(item, mode, variant)}
      </Typography>
      <QuantityInput
        item={item}
        mode={mode}
        onChange={onQuantityChange}
        maxQuantity={maxQuantity}
        fullWidth
        sx={isCard ? CARD_INPUT_SX : undefined}
      />
    </>
  );

  const priceField = (
    <>
      <Typography variant="caption" sx={isCard ? CARD_LABEL_SX : MOBILE_LABEL_SX}>
        {isCard ? "Precio" : "Precio unitario"}
      </Typography>
      <TextField
        size="small"
        type="number"
        value={item.product_price}
        disabled
        inputProps={{ step: 0.01, min: 0 }}
        fullWidth
        sx={isCard ? CARD_INPUT_SX : undefined}
      />
    </>
  );

  const wholesaleField = showWholesale && (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={item.product_price === prices.wholesale_price}
            onChange={() => onChangePrice(item)}
          />
        }
        label={
          isCard || !prices.apply_wholesale
            ? `Mayoreo ${formatCurrency(prices.wholesale_price)}`
            : `Mayoreo (${prices.min_wholesale_quantity}+) - ${formatCurrency(prices.wholesale_price)}`
        }
        sx={isCard ? CARD_WHOLESALE_SX : undefined}
      />
    </Box>
  );

  if (isCard) {
    return (
      <Grid item xs={12} md={3} className="fade-in-up" sx={{ display: "flex" }}>
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.2s ease",
            "&:hover": { boxShadow: 3, borderColor: "primary.light" },
          }}
        >
          <Box
            component="img"
            src={item.product.image || noPhotoImage}
            alt={item.product.name}
            sx={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              borderBottom: "1px solid",
              borderColor: "divider",
              transition: "transform 0.3s ease",
              cursor: "pointer",
              display: "block",
              "&:hover": { transform: "scale(1.04)" },
            }}
          />

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1, gap: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ color: "text.secondary", fontSize: "0.75rem", fontWeight: 500, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 0.5 }}>
                  {item.product.brand_name}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "text.primary", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {item.product.name}
                </Typography>
              </Box>
              {removeButton}
            </Box>

            <LabelValue label="Código">{item.product.code}</LabelValue>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.4 }}>
                <Box component="span" sx={{ fontWeight: 600 }}>{item.quantity}</Box> {getUnitLabel(item)}
              </Typography>
              <LabelValue label="Subtotal">{subtotal}</LabelValue>
            </Box>

            {saleModes && weighted && (
              <Box>
                <SaleModeButton item={item} mode={mode} onToggle={onToggleSaleMode} variant="card" />
              </Box>
            )}

            <Grid container spacing={1}>
              <Grid item xs={6}>{quantityField}</Grid>
              <Grid item xs={6}>{priceField}</Grid>
            </Grid>

            {wholesaleField}
          </Box>
        </Box>
      </Grid>
    );
  }

  const hasFooter = saleModes || showWholesale;

  return (
    <Grid item xs={12} className="fade-in-up" sx={MOBILE_ROW_ITEM_SX}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={MOBILE_NAME_SX}>
            {item.product.name}
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: "text.secondary" }}>
            {item.product.code} · {item.product.brand_name} · Stock {item.available_stock}
          </Typography>
        </Box>
        {removeButton}
      </Box>

      <Box sx={MOBILE_ROW_SX}>
        <Box>
          <Typography variant="caption" sx={MOBILE_LABEL_SX}>{getQuantityLabel(item, mode, variant)}</Typography>
          <QuantityInput item={item} mode={mode} onChange={onQuantityChange} maxQuantity={maxQuantity} fullWidth />
        </Box>
        <Box>
          <Typography variant="caption" sx={MOBILE_LABEL_SX}>Precio</Typography>
          <Typography variant="body2" sx={MOBILE_VALUE_SX}>{formatCurrency(item.product_price)}</Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" sx={MOBILE_LABEL_SX}>Total</Typography>
          <Typography variant="subtitle1" sx={{ ...MOBILE_VALUE_SX, justifyContent: "flex-end", fontSize: "1.125rem", fontWeight: 700 }}>{subtotal}</Typography>
        </Box>
      </Box>

      {hasFooter && (
        <Box sx={MOBILE_FOOTER_SX}>
          {saleModes && (weighted ? (
            <SaleModeButton item={item} mode={mode} onToggle={onToggleSaleMode} variant="mobile" />
          ) : (
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Venta por: {getUnitLabel(item)}</Typography>
          ))}
          {wholesaleField}
        </Box>
      )}
    </Grid>
  );
};

export default memo(CartItemCard);
