/**
 * Funciones puras para cálculo de precios en el carrito.
 * No usan estado global; testables y reutilizables.
 */

/**
 * Determina si un cliente está seleccionado.
 * @param {Object} client - Objeto cliente
 * @returns {boolean}
 */
export const aClientIsSelected = (client) => Object.keys(client).length > 0;

/**
 * Calcula el precio que debe aplicarse a un producto en el carrito.
 * Reglas:
 * 1. Si el mayoreo no se aplica con descuento del cliente, usar precio unitario
 * 2. Si la cantidad cumple el mínimo de mayoreo, usar precio de mayoreo
 * 3. Si no, usar precio unitario
 * @param {number} quantity - Cantidad de producto
 * @param {Object} prices - Objeto con { unit_price, wholesale_price, min_wholesale_quantity, wholesale_price_on_client_discount }
 * @param {boolean} clientSelected - ¿Hay un cliente seleccionado?
 * @returns {number} Precio a aplicar
 */
export const calculateProductPrice = (quantity, prices, clientSelected) => {
  if (!prices.wholesale_price_on_client_discount && clientSelected) {
    return prices.unit_price;
  }
  if (prices.min_wholesale_quantity && quantity >= prices.min_wholesale_quantity) {
    return prices.wholesale_price;
  }
  return prices.unit_price;
};

/**
 * Alterna entre precio de mayoreo y precio unitario.
 * Usado cuando el usuario presiona "Mayoreo manual".
 * @param {number} product_price - Precio actual del producto en el carrito
 * @param {Object} prices - Objeto con precios
 * @returns {number} Precio alternado
 */
export const changeProductPrice = (product_price, prices) => {
  if (product_price === prices.wholesale_price) {
    return prices.unit_price;
  }
  return prices.wholesale_price;
};

/**
 * Actualiza todos los precios de un carrito cuando cambia el cliente.
 * @param {Array} cart - Carrito (arreglo de items)
 * @param {boolean} clientSelected - ¿Hay un cliente seleccionado?
 * @returns {Array} Carrito con precios recalculados
 */
export const updateCartWithPrice = (cart, clientSelected) => {
  return cart.map((item) => ({
    ...item,
    product_price: calculateProductPrice(item.quantity, item.product.prices, clientSelected)
  }));
};
