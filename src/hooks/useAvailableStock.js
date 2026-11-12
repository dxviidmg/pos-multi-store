import { useCallback } from "react";
import { useSelector } from "react-redux";
import { selectActiveCartId, selectCarts } from "../redux/cart/selectors";
import { getReservedStock } from "../redux/cart/multiCartReducer";

export const useAvailableStock = () => {
  const carts = useSelector(selectCarts);
  const activeCartId = useSelector(selectActiveCartId);

  const getAvailableStock = useCallback(
    (productId, productStock) => productStock - getReservedStock(carts, productId, activeCartId),
    [carts, activeCartId]
  );

  return { getAvailableStock };
};
