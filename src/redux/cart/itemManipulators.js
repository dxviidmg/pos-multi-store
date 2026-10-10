/**
 * Funciones puras para manipular items en el carrito.
 * No usan estado global; testables y reutilizables.
 */

/**
 * Agrega un producto nuevo al carrito con el precio que le corresponde.
 * 
 * @param {Object} activeCart - Carrito activo
 * @param {Object} payload - Producto a agregar { id, quantity, product, ... }
 * @param {Function} calculatePrice - Función para calcular el precio (importada de priceCalculators)
 * @param {Function} isClientSelected - Helper para saber si hay cliente (importado de priceCalculators)
 * @returns {Array} Nuevo carrito con el item agregado
 */
export const appendNewItem = (activeCart, payload, calculatePrice, isClientSelected) => {
  const product_price = calculatePrice(
    payload.quantity,
    payload.product.prices,
    isClientSelected(activeCart.client)
  );
  return [...activeCart.cart, { ...payload, product_price }];
};

/**
 * Suma `quantity` al producto que ya está en el carrito en la posición `index`.
 * 
 * @param {Array} cart - Carrito actual
 * @param {number} index - Índice del item a incrementar
 * @param {number} quantity - Cantidad a sumar
 * @returns {Array} Nuevo carrito con el item incrementado
 */
export const incrementItemAt = (cart, index, quantity) => {
  return cart.map((item, i) =>
    i === index ? { ...item, quantity: item.quantity + quantity } : item
  );
};

/**
 * Cambia la cantidad de un producto del carrito y recalcula su precio.
 * 
 * @param {Object} activeCart - Carrito activo
 * @param {Object} product - Producto con { id, available_stock, product { prices } }
 * @param {number} quantity - Nueva cantidad
 * @param {Function} calculatePrice - Función para calcular el precio
 * @param {Function} isClientSelected - Helper para saber si hay cliente
 * @returns {Array} Nuevo carrito con el item actualizado
 */
export const setItemQuantity = (activeCart, product, quantity, calculatePrice, isClientSelected) => {
  const clientSelected = isClientSelected(activeCart.client);
  return activeCart.cart.map((item) =>
    item.id === product.id
      ? {
          ...item,
          quantity,
          product_price: calculatePrice(quantity, item.product.prices, clientSelected),
          available_stock: product.available_stock || item.available_stock,
        }
      : item
  );
};
