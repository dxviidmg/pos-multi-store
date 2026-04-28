import { useSelector } from "react-redux";

export const useAvailableStock = () => {
  const { carts, activeCartId } = useSelector((state) => state.multiCart);

  const getAvailableStock = (product, movementType = "venta") => {
    // Calcular stock reservado en otros carritos
    const reservedInOtherCarts = carts.reduce((total, cart) => {
      if (cart.id === activeCartId) return total;
      const item = cart.cart.find((item) => item.id === product.id);
      return total + (item ? item.quantity : 0);
    }, 0);

    const productStock = movementType === "traspaso" 
      ? (product.reserved_stock || 0)
      : (product.available_stock || 0);
    
    return productStock - reservedInOtherCarts;
  };

  return { getAvailableStock };
};
