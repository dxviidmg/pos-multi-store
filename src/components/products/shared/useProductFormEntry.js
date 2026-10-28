import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";

export const PRODUCT_CREATE_PATH = "/productos/nuevo/";

/**
 * Punto de entrada al alta de producto: en celular abre la página `ProductCreate` y vuelve a
 * `returnTo` al terminar; en escritorio abre el modal recibido. `data` es `{ code, createFromSearch }`.
 */
export const useProductFormEntry = (productModal, returnTo) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { open } = productModal;

  return useCallback((data) => {
    if (isMobile) navigate(PRODUCT_CREATE_PATH, { state: { returnTo, code: data?.code, createFromSearch: !!data?.createFromSearch } });
    else open(data);
  }, [isMobile, navigate, open, returnTo]);
};
