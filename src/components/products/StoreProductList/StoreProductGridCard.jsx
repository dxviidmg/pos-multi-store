import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import HistoryIcon from "@mui/icons-material/History";
import SendIcon from "@mui/icons-material/Send";
import CustomTooltip from "../../ui/Tooltip";
import noPhoto from "../../../assets/images/noPhoto.webp";

/**
 * Tarjeta de store-product (inventario de tienda) para la vista de galería.
 * Muestra datos anidados (product.*) e inventario. Diseño uniforme, serio y elegante.
 * Clic abre ajuste de cantidad (no logs).
 */
const StoreProductGridCard = ({ storeProduct, onAdjustStock, onLogs, onRequest, role }) => {
  if (!storeProduct) return null;

  const product = storeProduct.product || {};
  const isOwner = role === "owner";
  const isSeller = role === "seller";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderColor: "primary.light",
        },
      }}
    >
      {/* Imagen - clickeable para ajustar stock (owner) o ver logs (no-seller) */}
      <Box
        onClick={() => isOwner ? onAdjustStock?.(storeProduct) : onLogs?.(storeProduct)}
        sx={{
          position: "relative",
          width: "100%",
          height: 140,
          overflow: "hidden",
          bgcolor: "action.hover",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            "& .spgc-image": { transform: "scale(1.04)" },
          },
        }}
      >
        <Box
          component="img"
          className="spgc-image"
          src={product.image || noPhoto}
          alt={product.name || "Producto"}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = noPhoto; }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.3s ease",
          }}
        />
      </Box>

      {/* Info */}
      <Box 
        onClick={() => isOwner ? onAdjustStock?.(storeProduct) : onLogs?.(storeProduct)}
        sx={{ 
          px: 1.5, 
          pt: 1.25, 
          pb: 0.75, 
          flex: 1,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {/* Marca (gris secundario) */}
        {product.brand_name && (
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.75rem",
              fontWeight: 500,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              mb: 0.5,
            }}
          >
            {product.brand_name}
          </Typography>
        )}

        {/* Nombre (destaca) */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "text.primary",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 0.75,
          }}
        >
          {product.name || "Producto"}
        </Typography>

        {/* Datos uniformes: etiqueta + valor */}
        <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.4, mb: 0.25 }}>
          <span style={{ fontWeight: 600 }}>Código:</span> {product.code || "—"}
        </Typography>

        {product.department_name && (
          <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.4, mb: 0.25 }}>
            <span style={{ fontWeight: 600 }}>Depto:</span> {product.department_name}
          </Typography>
        )}

        {/* Stock */}
        <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.4 }}>
          <span style={{ fontWeight: 600 }}>Stock:</span> {storeProduct.stock} {product.unit && `(${product.unit})`}
        </Typography>
      </Box>

      {/* Acciones */}
      <Stack 
        direction="row" 
        spacing={0.5} 
        sx={{ 
          px: 1, 
          pb: 1, 
          justifyContent: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          pt: 0.75,
        }}
      >
        {isOwner && (
          <CustomTooltip text="Ajustar cantidad">
            <IconButton size="small" onClick={() => onAdjustStock?.(storeProduct)} sx={{ color: "primary.main" }}>
              <TuneIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
        )}
        {!isSeller && (
          <CustomTooltip text="Movimientos">
            <IconButton size="small" onClick={() => onLogs?.(storeProduct)} sx={{ color: "primary.main" }}>
              <HistoryIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
        )}
        {!isOwner && (
          <CustomTooltip text="Solicitar ajuste">
            <IconButton size="small" onClick={() => onRequest?.(storeProduct)} sx={{ color: "primary.main" }}>
              <SendIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
        )}
      </Stack>
    </Box>
  );
};

export default StoreProductGridCard;
