import { useCallback } from "react";
import { useSelector } from "react-redux";

export const useAvailableStock = () => {
  const { carts, activeCartId } = useSelector((state) => state.multiCartReducer);

  const getAvailableStock = useCallback((productId, productStock) => {
    const reservedInOtherCarts = carts.reduce((total, cart) => {
      if (cart.id === activeCartId) return total;
      const item = cart.cart.find(item => item.id === productId);
      return total + (item ? item.quantity : 0);
    }, 0);
    return productStock - reservedInOtherCarts;
  }, [carts, activeCartId]);

  return { getAvailableStock };
};
