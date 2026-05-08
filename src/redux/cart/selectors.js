import { createSelector } from "reselect";

const selectMultiCart = (state) => state.multiCartReducer;

export const selectCarts = createSelector(selectMultiCart, (mc) => mc.carts);
export const selectActiveCartId = createSelector(selectMultiCart, (mc) => mc.activeCartId);

const selectActiveCart = createSelector(
  selectCarts,
  selectActiveCartId,
  (carts, activeCartId) => carts?.find((c) => c.id === activeCartId) || carts?.[0]
);

export const selectCart = createSelector(selectActiveCart, (ac) => ac?.cart || []);
export const selectMovementType = createSelector(selectActiveCart, (ac) => ac?.movementType || "venta");
export const selectClient = createSelector(selectActiveCart, (ac) => ac?.client || {});
