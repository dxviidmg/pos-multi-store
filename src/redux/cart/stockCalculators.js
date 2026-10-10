/**
 * Funciones puras para cálculo de stock disponible en el carrito.
 * No usan estado global; testables y reutilizables.
 */

import { MOVEMENT_TYPES } from "../../constants";

/**
 * Calcula la cantidad de un producto ya agregada en los carritos (excepto uno).
 * Se usa para evitar que múltiples carritos abiertos vendan la misma cantidad.
 * 
 * Ejemplo:
 * - Carrito 1: [producto A x5]
 * - Carrito 2: [vacío]
 * - getReservedStock(carts, productA.id, cartId2) → 5
 * 
 * @param {Array} carts - Todos los carritos
 * @param {number|string} productId - ID del producto
 * @param {number|string|null} excludeCartId - ID del carrito a excluir (opcional)
 * @returns {number} Cantidad reservada en otros carritos
 */
export const getReservedStock = (carts, productId, excludeCartId = null) => {
  return carts.reduce((total, cart) => {
    if (cart.id === excludeCartId) return total;
    const item = cart.cart.find(item => item.id === productId);
    return total + (item ? item.quantity : 0);
  }, 0);
};

/**
 * Calcula el stock disponible para agregar al carrito activo.
 * 
 * Reglas:
 * - En traspasos: usa reserved_stock (stock pendiente en otras sucursales)
 * - En otros movimientos: usa available_stock (stock en esta sucursal)
 * - Descuenta lo que ya está en otros carritos abiertos
 * 
 * Ejemplo:
 * - Producto: available_stock=10, reserved_stock=3
 * - Carrito activo: producto ya tiene qty=2
 * - Otro carrito: producto tiene qty=3
 * - En SALE: disponible = 10 - 3 (otros carritos) = 7
 * - En TRANSFER: disponible = 3 - 3 (otros carritos) = 0
 * 
 * @param {Object} state - Estado Redux completo (para acceder a todos los carritos)
 * @param {Object} activeCart - Carrito activo
 * @param {Object} product - Producto con { available_stock, reserved_stock }
 * @returns {number} Stock disponible para el carrito activo
 */
export const getAvailableStockForActiveCart = (state, activeCart, product) => {
  const productStock = activeCart.movementType === MOVEMENT_TYPES.TRANSFER
    ? (product.reserved_stock || 0)
    : (product.available_stock || 0);
  
  return productStock - getReservedStock(state.carts, product.id, state.activeCartId);
};
