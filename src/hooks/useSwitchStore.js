import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { cleanCart } from "../redux/cart/cartActions";
import { STORE_TYPES } from "../constants";

const OVERLAY_DELAY_MS = 1000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Cambio de sucursal activa y regreso a la vista general.
 * Limpia la caché de React Query y el carrito, actualiza el usuario, emite
 * `store-changed` y navega a la pantalla inicial cuando cambia el tipo de sucursal.
 *
 * @returns {{
 *   switchStore: (store: { id, name, full_name?, store_type, printer? }, options?: { withOverlay?: boolean }) => Promise<void>,
 *   backToGeneral: () => void,
 *   switching: boolean,
 * }}
 * `withOverlay` espera 1 s con `switching = true` antes de cambiar, para que el
 * llamador muestre un indicador (Backdrop) mientras tanto.
 */
export const useSwitchStore = () => {
  const { user, updateUser } = useUser();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState(false);

  const currentStoreId = user?.store_id;
  const currentStoreType = user?.store_type;

  const switchStore = useCallback(
    async (store, { withOverlay = false } = {}) => {
      if (!store || store.id === currentStoreId) return;

      if (withOverlay) {
        setSwitching(true);
        await wait(OVERLAY_DELAY_MS);
      }

      queryClient.clear();
      dispatch(cleanCart());
      updateUser({
        store_id: store.id,
        store_name: store.full_name || store.name,
        store_type: store.store_type,
        store_printer: store.printer?.id ?? null,
      });
      window.dispatchEvent(new Event("store-changed"));

      // Tienda y almacén tienen menús distintos: al cambiar de tipo (o al entrar desde
      // la vista general) se navega a la pantalla inicial de ese tipo.
      if (store.store_type !== currentStoreType) {
        navigate(store.store_type === STORE_TYPES.WAREHOUSE ? "/distribuir/" : "/vender/", { replace: true });
      }

      if (withOverlay) setSwitching(false);
    },
    [currentStoreId, currentStoreType, queryClient, dispatch, updateUser, navigate]
  );

  const backToGeneral = useCallback(() => {
    queryClient.clear();
    dispatch(cleanCart());
    updateUser({ store_type: "", store_name: "", store_id: null, store_printer: null });
    window.dispatchEvent(new Event("store-changed"));
    navigate("/tiendas/", { replace: true });
  }, [queryClient, dispatch, updateUser, navigate]);

  return { switchStore, backToGeneral, switching };
};
