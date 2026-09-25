import React from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import HistoryIcon from "@mui/icons-material/History";
import ChecklistIcon from "@mui/icons-material/Checklist";
import CustomTooltip from "../../ui/Tooltip";
import noPhoto from "../../../assets/images/noPhoto.webp";

/**
 * Tarjeta de producto para la vista de galería de /productos/.
 * Diseño uniforme, serio y elegante. Clic abre edición; acciones abajo.
 */
const ProductGridCard = ({ product, onEdit, onPriceLogs, onStoreStock, onCameraPhoto, role }) => {
  if (!product) return null;

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
      {/* Imagen - clickeable para editar */}
      <Box
        onClick={() => onEdit?.(product)}
        sx={{
          position: "relative",
          width: "100%",
          height: 140,
          overflow: "hidden",
          bgcolor: "action.hover",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            "& .pgc-image": { transform: "scale(1.04)" },
          },
        }}
      >
        <Box
          component="img"
          className="pgc-image"
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
        onClick={() => onEdit?.(product)}
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

        {/* Nombre (destaca: más grande, más oscuro) */}
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

        {/* Datos uniformes: etiqueta + valor en una línea */}
        <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.4, mb: 0.25 }}>
          <span style={{ fontWeight: 600 }}>Código:</span> {product.code || "—"}
        </Typography>

        {product.department_name && (
          <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.4, mb: 0.25 }}>
            <span style={{ fontWeight: 600 }}>Depto:</span> {product.department_name}
          </Typography>
        )}

        {/* Precio */}
        <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", fontWeight: 600, lineHeight: 1.4, mb: 0.25 }}>
          ${product.unit_price}
        </Typography>

        {product.apply_wholesale && (
          <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.4, mb: 0.25 }}>
            <span style={{ fontWeight: 600 }}>May:</span> ${product.wholesale_price} ({product.min_wholesale_quantity}+)
          </Typography>
        )}

        {/* Stock solo para owner */}
        {isOwner && (
          <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.primary", lineHeight: 1.4 }}>
            <span style={{ fontWeight: 600 }}>Stock:</span> {product.stock}
          </Typography>
        )}
      </Box>

      {/* Acciones - solo si no es seller */}
      {!isSeller && (
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
          <CustomTooltip text="Editar">
            <IconButton size="small" onClick={() => onEdit?.(product)} sx={{ color: "primary.main" }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
          <CustomTooltip text="Tomar foto">
            <IconButton size="small" onClick={() => onCameraPhoto?.(product)} sx={{ color: "primary.main" }}>
              <CameraAltIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
          <CustomTooltip text="Historial">
            <IconButton size="small" onClick={() => onPriceLogs?.(product)} sx={{ color: "primary.main" }}>
              <HistoryIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
          {isOwner && (
            <CustomTooltip text="Stock en tiendas">
              <IconButton size="small" onClick={() => onStoreStock?.(product)} sx={{ color: "primary.main" }}>
                <ChecklistIcon fontSize="small" />
              </IconButton>
            </CustomTooltip>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default ProductGridCard;
