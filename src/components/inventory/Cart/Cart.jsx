import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { selectCart, selectCarts, selectMovementType } from "../../../redux/cart/selectors";
import { removeFromCart, updateMovementType, updateQuantityInCart, changePrice } from "../../../redux/cart/cartActions";
import SimpleTable from "../../ui/SimpleTable/SimpleTable";
import { CustomSpinner } from "../../ui/Spinner/Spinner";
import PaymentModal from "../../sales/PaymentModal/PaymentModal";
import StockModal from "../StockModal/StockModal";
import { showWarning } from "../../../utils/alerts";
import { roundUpCustom } from "../../../utils/currency";
import { useUser } from "../../../context/UserContext";
import { useModal } from "../../../hooks/useModal";
import { useAvailableStock } from "../../../hooks/useAvailableStock";
import { useCtrlShortcut } from "../../../hooks/useCtrlShortcut";
import { MOVEMENT_TYPES } from "../../../constants";
import { isWarehouseView } from "../../../constants/routeAccess";
import { getCartColumns } from "./cartColumns";
import { countCartProducts, getNextSaleMode, getQuantityMode, parseQuantity, QUANTITY_MODES } from "./quantityRules";
import { CART_VIEW } from "./cartViewModes";
import { useCartSubmit } from "./useCartSubmit";
import CartToolbar from "./CartToolbar";
import CartItemCard from "./CartItemCard";

const Cart = ({ searchInputRef, cartViewMode = CART_VIEW.TABLE, setCartViewMode }) => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const stockModal = useModal();
  const paymentModal = useModal();
  const [saleModes, setSaleModes] = useState({});
  const lastQtyRef = useRef(null);
  const prevCartLenRef = useRef(0);
  const submit = useCartSubmit();

  const { getAvailableStock } = useAvailableStock();
  const cart = useSelector(selectCart);
  const movementType = useSelector(selectMovementType);
  const carts = useSelector(selectCarts);
  const isWarehouse = isWarehouseView(user);
  const canCharge = movementType === MOVEMENT_TYPES.SALE || movementType === MOVEMENT_TYPES.RESERVATION;

  // Auto-focus cantidad del último producto agregado en distribución o agregar inventario
  useEffect(() => {
    let timer;
    if ((movementType === MOVEMENT_TYPES.DISTRIBUTION || movementType === MOVEMENT_TYPES.ADD_STOCK) && cart.length > prevCartLenRef.current) {
      timer = setTimeout(() => {
        lastQtyRef.current?.focus();
        lastQtyRef.current?.select();
      }, 50);
    }
    prevCartLenRef.current = cart.length;
    return () => clearTimeout(timer);
  }, [cart.length, movementType]);

  // Ctrl+P abre el cobro en venta y apartado; la tecla se bloquea siempre en la pantalla de venta
  useCtrlShortcut("p", () => {
    if (canCharge) paymentModal.open();
  });

  // En almacén no se vende: el movimiento por defecto es distribución
  useEffect(() => {
    if (isWarehouse && movementType === MOVEMENT_TYPES.SALE) {
      dispatch(updateMovementType(MOVEMENT_TYPES.DISTRIBUTION));
    }
  }, [isWarehouse, dispatch, movementType]);

  // Mismo redondeo que PaymentModal para que el total coincida al cobrar
  const total = useMemo(
    () => roundUpCustom(cart.reduce((acc, item) => acc + item.product_price * item.quantity, 0)),
    [cart]
  );
  const totalProducts = useMemo(() => countCartProducts(cart), [cart]);

  const handleRemoveFromCart = useCallback((item) => dispatch(removeFromCart(item.id)), [dispatch]);
  const handleChangePrice = useCallback((item) => dispatch(changePrice(item)), [dispatch]);
  const handleToggleSaleMode = useCallback((item) => {
    setSaleModes((prev) => ({ ...prev, [item.id]: getNextSaleMode(prev[item.id] || QUANTITY_MODES.KG) }));
  }, []);

  // Tope de las flechas ↑: stock disponible considerando otros carritos (sin tope al agregar inventario)
  const getMaxQuantity = useCallback(
    (item) => (movementType === MOVEMENT_TYPES.ADD_STOCK ? Infinity : getAvailableStock(item.id, item.available_stock)),
    [movementType, getAvailableStock]
  );

  const openStockModal = stockModal.open;
  const handleQuantityChange = useCallback((item, text, mode) => {
    const newQuantity = parseQuantity(text, item, mode);
    if (newQuantity === null) return;

    const stockLimit = movementType === MOVEMENT_TYPES.TRANSFER ? item.stock : item.available_stock;
    const availableStock = movementType === MOVEMENT_TYPES.ADD_STOCK ? Infinity : getAvailableStock(item.id, stockLimit);

    if (carts.length > 1 && newQuantity > availableStock) {
      showWarning("No se pudo cambiar la cantidad", `"${item.product?.name || item.name}" está reservado en otros carritos.`);
      return;
    }

    // Si se excede el stock se ofrece pedirlo a otra tienda o agregarlo (excepto al agregar inventario)
    if (movementType !== MOVEMENT_TYPES.ADD_STOCK && newQuantity > item.available_stock) {
      openStockModal(item);
    }

    dispatch(updateQuantityInCart(item, Math.min(newQuantity, availableStock)));
  }, [movementType, getAvailableStock, carts.length, openStockModal, dispatch]);

  const columns = useMemo(
    () =>
      getCartColumns(movementType, {
        saleModes,
        onToggleSaleMode: handleToggleSaleMode,
        onQuantityChange: handleQuantityChange,
        getMaxQuantity,
        onChangePrice: handleChangePrice,
        onRemove: handleRemoveFromCart,
        cartLength: cart.length,
        lastQtyRef,
        searchInputRef,
      }),
    [movementType, saleModes, handleToggleSaleMode, handleQuantityChange, getMaxQuantity, handleChangePrice, handleRemoveFromCart, cart.length, searchInputRef]
  );

  const handleClosePayment = () => {
    paymentModal.close();
    setTimeout(() => searchInputRef?.current?.focus(), 100);
  };

  const renderCards = (variant) =>
    cart.map((item, idx) => (
      <CartItemCard
        key={item.id ?? idx}
        item={item}
        variant={variant}
        mode={getQuantityMode(item, movementType, saleModes)}
        movementType={movementType}
        maxQuantity={getMaxQuantity(item)}
        onQuantityChange={handleQuantityChange}
        onToggleSaleMode={handleToggleSaleMode}
        onChangePrice={handleChangePrice}
        onRemove={handleRemoveFromCart}
      />
    ));

  return (
    <div>
      <CustomSpinner isLoading={submit.loading} />
      <PaymentModal isOpen={paymentModal.isOpen} onClose={handleClosePayment} />
      <StockModal isOpen={stockModal.isOpen} product={stockModal.data} onClose={stockModal.close} />
      {cart.length !== 0 && (
        <CartToolbar
          movementType={movementType}
          isMobile={isMobile}
          viewMode={cartViewMode}
          onViewModeChange={setCartViewMode}
          totalProducts={totalProducts}
          total={total}
          onCharge={() => paymentModal.open()}
          destination={submit}
          onSubmitTransfer={() => submit.submitTransfer(cart)}
          onSubmitDistribution={() => submit.submitDistribution(cart)}
          onSubmitAddToStock={() => submit.submitAddToStock(cart)}
        />
      )}
      {!isMobile && cartViewMode === CART_VIEW.TABLE && (
        <SimpleTable noDataComponent="Sin productos" data={cart} columns={columns} />
      )}
      {!isMobile && cartViewMode === CART_VIEW.CARDS && (
        <Grid container spacing={2} sx={{ p: 2 }}>
          {renderCards("card")}
        </Grid>
      )}
      {isMobile && (
        <Grid container spacing={1}>
          {renderCards("mobile")}
        </Grid>
      )}
    </div>
  );
};

export default Cart;
