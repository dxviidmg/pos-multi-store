import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, countStockOtherStores } from "../redux/cart/cartActions";
import { getStockOtherStores } from "../api/products";
import { showWarning } from "../utils/alerts";

export const useCartActions = (getAvailableStock, movementType, keepListOpen) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { carts, activeCartId } = useSelector((state) => state.multiCartReducer);
  
  const cart = useSelector((state) => {
    const { carts, activeCartId } = state.multiCartReducer;
    const activeCart = carts?.find(c => c.id === activeCartId) || carts?.[0];
    return activeCart?.cart || [];
  });

  const handleAddToCartIfAvailable = useCallback((storeProduct, setData, setQuery, stockModal) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === storeProduct.id
    );
    const currentQuantityInCart = existingProductIndex !== -1 ? cart[existingProductIndex].quantity : 0;
    let added = false;

    if (existingProductIndex === -1) {
      if (movementType === "agregar") {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        added = true;
      } else {
        const stock =
          movementType === "traspaso"
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
        movementType === "traspaso"
          ? storeProduct.reserved_stock
          : storeProduct.available_stock;
      const availableStock = getAvailableStock(storeProduct.id, stock);

      if (movementType === "agregar") {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        added = true;
      } else if (currentQuantityInCart < availableStock) {
        dispatch(addToCart({ ...storeProduct, quantity: 1 }));
        added = true;
        if (!keepListOpen) {
          setData([]);
          setQuery("");
        }
      } else if (
        movementType === "venta" &&
        currentQuantityInCart >= availableStock
      ) {
        stockModal.open(cart[existingProductIndex]);
      }
    }

    if (added && storeProduct.requires_stock_verification) {
      return { productName: storeProduct.product?.name || "Producto", productCode: storeProduct.product?.code || "" };
    }

    if (added && movementType === "distribucion") {
      getStockOtherStores(storeProduct.id).then((response) => {
        dispatch(countStockOtherStores(storeProduct, response.data));
      });
    }

    return null;
  }, [cart, dispatch, movementType, getAvailableStock, keepListOpen]);

  return { handleAddToCartIfAvailable };
};
