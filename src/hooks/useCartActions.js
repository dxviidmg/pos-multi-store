import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCart } from "../redux/cart/selectors";
import { addToCart, countStockOtherStores } from "../redux/cart/cartActions";
import { getStockOtherStores } from "../api/products";
import { showWarning } from "../utils/alerts";
import { MOVEMENT_TYPES } from "../constants";
import { logger } from "../utils/logger";

export const useCartActions = (getAvailableStock, movementType, keepListOpen, setData, setQuery) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  const handleAddToCartIfAvailable = useCallback((storeProduct, stockModal) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === storeProduct.id
    );
    const currentQuantityInCart = existingProductIndex !== -1 ? cart[existingProductIndex].quantity : 0;
    let added = false;

    if (existingProductIndex === -1) {
      if (movementType === MOVEMENT_TYPES.ADD_STOCK) {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        added = true;
      } else {
        const stock =
          movementType === MOVEMENT_TYPES.TRANSFER
            ? storeProduct.reserved_stock
            : storeProduct.available_stock;
        const availableStock = getAvailableStock(storeProduct.id, stock);
        
        if (availableStock > 0) {
          const quantity = availableStock < 1 ? availableStock : 1;
          dispatch(addToCart({ ...storeProduct, quantity }));
          added = true;
          if (!keepListOpen) {
            setData([]);
            setQuery("");
          }
        } else if (!(Number(stock) > 0)) {
          showWarning(
            "No se pudo agregar el producto",
            movementType === MOVEMENT_TYPES.TRANSFER
              ? "No está incluido en ningún traspaso pendiente."
              : "No hay stock disponible en esta tienda"
          );
        } else {
          showWarning("No se pudo agregar el producto", `Está reservado en otros carritos. Stock disponible: ${availableStock}`);
        }
      }
    } else {
      const stock =
        movementType === MOVEMENT_TYPES.TRANSFER
          ? storeProduct.reserved_stock
          : storeProduct.available_stock;
      const availableStock = getAvailableStock(storeProduct.id, stock);

      if (movementType === MOVEMENT_TYPES.ADD_STOCK) {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        added = true;
        if (!keepListOpen) {
          setData([]);
          setQuery("");
        }
      } else if (currentQuantityInCart < availableStock) {
        const remainingStock = availableStock - currentQuantityInCart;
        const quantity = remainingStock < 1 ? remainingStock : 1;
        dispatch(addToCart({ ...storeProduct, quantity }));
        added = true;
        if (!keepListOpen) {
          setData([]);
          setQuery("");
        }
      } else {
        stockModal?.open(cart[existingProductIndex]);
      }
    }

    if (added && movementType === MOVEMENT_TYPES.DISTRIBUTION) {
      getStockOtherStores(storeProduct.id)
        .then((response) => {
          dispatch(countStockOtherStores(storeProduct, response.data));
        })
        .catch((error) => logger.warn("No se pudo cargar el stock de otras sucursales:", error?.message || error));
    }

    if (added && storeProduct.requires_stock_verification) {
      return { productName: storeProduct.product?.name || "Producto", productCode: storeProduct.product?.code || "" };
    }

    return null;
  }, [cart, dispatch, movementType, getAvailableStock, keepListOpen, setData, setQuery]);

  return { handleAddToCartIfAvailable };
};
