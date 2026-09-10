import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProductCard from "@/src/features/products/components/ProductCarousel/ProductCard";
import { MOVEMENT_TYPES } from "@/src/shared/constants";

/**
 * Carrusel horizontal de tarjetas de producto para la búsqueda visual.
 * - Desplazamiento por flechas laterales, swipe táctil y scroll horizontal.
 * - No genera scroll vertical largo.
 */
const ProductCarousel = ({ products = [], onSelect, movementType }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [products, updateScrollState]);

  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 160);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (!products || products.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", py: 2, textAlign: "center" }}
      >
        Sin resultados
      </Typography>
    );
  }

  const isSale = movementType === MOVEMENT_TYPES.SALE;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <IconButton
        onClick={() => scrollByAmount(-1)}
        disabled={!canScrollLeft}
        size="small"
        aria-label="Anterior"
        sx={{
          position: "absolute",
          left: -6,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <Box
        ref={scrollRef}
        onScroll={updateScrollState}
        sx={{
          display: "flex",
          gap: 1.5,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          py: 1,
          px: 4,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {products.map((sp) => {
          const disabled = isSale && sp.available_stock === 0;
          return (
            <ProductCard
              key={sp.id}
              storeProduct={sp}
              disabled={disabled}
              onClick={() => onSelect?.(sp)}
            />
          );
        })}
      </Box>

      <IconButton
        onClick={() => scrollByAmount(1)}
        disabled={!canScrollRight}
        size="small"
        aria-label="Siguiente"
        sx={{
          position: "absolute",
          right: -6,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default ProductCarousel;
