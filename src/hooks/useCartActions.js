import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCart } from "../redux/cart/selectors";
import { addToCart, countStockOtherStores } from "../redux/cart/cartActions";
import { getStockOtherStores } from "../api/products";
import { showWarning } from "../utils/alerts";
import { MOVEMENT_TYPES } from "../constants";

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
        
        if (availableStock >= 1) {
          dispatch(addToCart({ ...storeProduct, quantity: 1 }));
          added = true;
          if (!keepListOpen) {
            setData([]);
            setQuery("");
          }
        } else {
          showWarning("Stock insuficiente", `Este producto ya está reservado en otros carritos. Stock disponible: ${availableStock}`);
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
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        added = true;
        if (!keepListOpen) {
          setData([]);
          setQuery("");
        }
      } else {
        stockModal.open(cart[existingProductIndex]);
      }
    }

    if (added && movementType === MOVEMENT_TYPES.DISTRIBUTION) {
      getStockOtherStores(storeProduct.id).then((response) => {
        dispatch(countStockOtherStores(storeProduct, response.data));
      });
    }

    if (added && storeProduct.requires_stock_verification) {
      return { productName: storeProduct.product?.name || "Producto", productCode: storeProduct.product?.code || "" };
    }

    return null;
  }, [cart, dispatch, movementType, getAvailableStock, keepListOpen, setData, setQuery]);

  return { handleAddToCartIfAvailable };
};
