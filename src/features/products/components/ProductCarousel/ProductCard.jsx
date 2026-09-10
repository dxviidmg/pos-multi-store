import React from "react";
import { Box, Typography } from "@mui/material";
import noPhotoImg from "@/src/shared/assets/images/noPhoto.webp";

// En Next.js, importar una imagen devuelve un objeto StaticImageData,
// no una string. Normalizamos a la URL para usarla en <img src>.
const noPhoto = noPhotoImg.src || noPhotoImg;

/**
 * Tarjeta visual de producto para el carrusel de búsqueda visual.
 * Diseño acorde a SmartVenta: imagen protagonista, gradiente primario,
 * precio destacado tipo badge y feedback visual al pasar el cursor.
 */
const ProductCard = ({ storeProduct, disabled = false, onClick }) => {
  const product = storeProduct?.product || {};
  const unitPrice = product?.prices?.unit_price;

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <Box
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={`Agregar ${product?.name || "producto"} al carrito`}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      sx={{
        position: "relative",
        flex: "0 0 auto",
        width: 168,
        scrollSnapAlign: "start",
        bgcolor: "background.paper",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        overflow: "hidden",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        userSelect: "none",
        "&:hover": disabled
          ? {}
          : {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 30px rgba(4,53,107,0.22)",
              "& .pc-image": { transform: "scale(1.06)" },
            },
        "&:focus-visible": {
          outline: "3px solid",
          outlineColor: "primary.light",
          outlineOffset: 2,
        },
      }}
    >
      {/* Imagen protagonista */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 130,
          overflow: "hidden",
          bgcolor: "action.hover",
        }}
      >
        <Box
          component="img"
          className="pc-image"
          src={product?.image || noPhoto}
          alt={product?.name || "Producto"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = noPhoto;
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Etiqueta sin stock centrada sobre la imagen */}
        {disabled && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,0.35)",
            }}
          >
            <Box
              sx={{
                px: 1.25,
                py: 0.4,
                borderRadius: "8px",
                bgcolor: "error.main",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              Sin stock
            </Box>
          </Box>
        )}
      </Box>

      {/* Info del producto */}
      <Box sx={{ px: 1.25, pt: 1, pb: 0.75 }}>
        {product?.brand_name && (
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.68rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.brand_name}
          </Typography>
        )}
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.82rem",
            color: "text.primary",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mt: product?.brand_name ? 0.25 : 0,
          }}
        >
          {product?.name || "Producto"}
        </Typography>
        {typeof unitPrice === "number" && (
          <Typography
            sx={{
              mt: 0.25,
              fontWeight: 700,
              fontSize: "1rem",
              color: "primary.main",
              lineHeight: 1.2,
            }}
          >
            ${unitPrice.toFixed(2)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductCard;
